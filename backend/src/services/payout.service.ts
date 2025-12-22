import prisma from '../config/database';
// import stripe from '../config/stripe'; // Reserved for future Stripe Connect integration
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type { GetPayoutsInput, RequestPayoutInput } from '../validators/payout.validator';

// Platform fee percentage (host keeps rest)
const PLATFORM_FEE_PERCENT = 15;

/**
 * Get all payouts for a host
 * GET /api/payouts
 */
export const getHostPayouts = async (userId: string, filters: GetPayoutsInput) => {
  const { status, page, limit } = filters;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    host_id: userId,
  };

  if (status) {
    where.payout_status = status;
  }

  const [payouts, total] = await Promise.all([
    prisma.payout.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            check_in_date: true,
            check_out_date: true,
            total_cents: true,
            property: {
              select: {
                id: true,
                title: true,
              },
            },
            guest: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    }),
    prisma.payout.count({ where }),
  ]);

  return {
    payouts,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get payout by ID
 * GET /api/payouts/:id
 */
export const getPayoutById = async (payoutId: string, userId: string) => {
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      booking: {
        select: {
          id: true,
          check_in_date: true,
          check_out_date: true,
          total_cents: true,
          nights: true,
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
            },
          },
          guest: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!payout) {
    throw new NotFoundError('Payout not found');
  }

  // Only the host can view their payout
  if (payout.host_id !== userId) {
    throw new ForbiddenError('You can only view your own payouts');
  }

  return payout;
};

/**
 * Request a payout for completed bookings
 * POST /api/payouts/request
 */
export const requestPayout = async (userId: string, data: RequestPayoutInput) => {
  const { booking_ids, payout_method_id } = data;

  // Verify user is a host
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Build where clause for eligible bookings
  const bookingWhere: any = {
    host_id: userId,
    payment_status: 'completed',
    booking_status: 'completed',
  };

  // If specific booking IDs provided, only those
  if (booking_ids && booking_ids.length > 0) {
    bookingWhere.id = { in: booking_ids };
  }

  // Find all completed bookings that haven't been paid out yet
  const eligibleBookings = await prisma.booking.findMany({
    where: {
      ...bookingWhere,
      // No existing payout for this booking
      payouts: {
        none: {},
      },
    },
    select: {
      id: true,
      total_cents: true,
      service_fee_cents: true,
      cleaning_fee_cents: true,
      subtotal_cents: true,
    },
  });

  if (eligibleBookings.length === 0) {
    throw new BadRequestError('No eligible bookings found for payout');
  }

  // Calculate total payout amount
  let totalHostEarnings = 0;
  let totalPlatformFee = 0;

  for (const booking of eligibleBookings) {
    // Host gets: subtotal + cleaning fee - platform fee
    // Platform keeps: service fee + platform fee on (subtotal + cleaning fee)
    const hostRevenue = booking.subtotal_cents + booking.cleaning_fee_cents;
    const platformFee = Math.round(hostRevenue * (PLATFORM_FEE_PERCENT / 100));

    totalHostEarnings += hostRevenue;
    totalPlatformFee += platformFee;
  }

  const netPayoutAmount = totalHostEarnings - totalPlatformFee;

  if (netPayoutAmount <= 0) {
    throw new BadRequestError('Payout amount must be greater than zero');
  }

  // Create payout records for each booking
  const payoutPromises = eligibleBookings.map(async (booking) => {
    const hostRevenue = booking.subtotal_cents + booking.cleaning_fee_cents;
    const platformFee = Math.round(hostRevenue * (PLATFORM_FEE_PERCENT / 100));
    const netAmount = hostRevenue - platformFee;

    return prisma.payout.create({
      data: {
        host_id: userId,
        booking_id: booking.id,
        amount_cents: hostRevenue,
        platform_fee_cents: platformFee,
        net_amount_cents: netAmount,
        payout_status: 'pending',
        payout_method_id: payout_method_id || null,
        scheduled_for: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      include: {
        booking: {
          select: {
            id: true,
            check_in_date: true,
            check_out_date: true,
            total_cents: true,
            property: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  });

  const payouts = await Promise.all(payoutPromises);

  // In a real implementation, you would create a Stripe transfer here
  // For now, we'll just mark as pending and return the payout records
  /*
  try {
    // Example Stripe transfer (requires Stripe Connect setup)
    const transfer = await stripe.transfers.create({
      amount: netPayoutAmount,
      currency: 'usd',
      destination: stripeAccountId, // Host's connected Stripe account
      metadata: {
        host_id: userId,
        booking_ids: eligibleBookings.map(b => b.id).join(','),
      },
    });

    // Update payouts with transfer ID
    await Promise.all(
      payouts.map(payout =>
        prisma.payout.update({
          where: { id: payout.id },
          data: {
            stripe_transfer_id: transfer.id,
            payout_status: 'processing',
          },
        })
      )
    );
  } catch (error) {
    // Handle Stripe errors
  }
  */

  return {
    message: 'Payout request created successfully',
    total_payouts: payouts.length,
    total_amount_cents: totalHostEarnings,
    platform_fee_cents: totalPlatformFee,
    net_payout_cents: netPayoutAmount,
    scheduled_for: payouts[0]?.scheduled_for,
    payouts: payouts,
  };
};
