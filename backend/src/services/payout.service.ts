import supabase from '../config/supabase';
// import stripe from '../config/stripe'; // Reserved for future Stripe Connect integration
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type { GetPayoutsInput, RequestPayoutInput } from '../validators/payout.validator';
import type { 
  PayoutRow, PayoutInsert, 
  BookingRow, PropertyRow, UserRow 
} from '../types/supabase-helpers';

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

  // Build query
  let query = supabase
    .from('payouts')
    .select('*', { count: 'exact' })
    .eq('host_id', userId);

  if (status) {
    query = query.eq('payout_status', status);
  }

  const from = skip;
  const to = skip + limit - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: payouts, error, count } = await query as { data: PayoutRow[] | null; error: any; count: number | null };

  if (error) {
    throw new Error(error.message);
  }

  // Get related booking data
  const payoutsWithRelations = await Promise.all(
    (payouts || []).map(async (payout) => {
      // Get booking
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, check_in_date, check_out_date, total_cents, property_id, guest_id')
        .eq('id', payout.booking_id || '')
        .single() as { data: Pick<BookingRow, 'id' | 'check_in_date' | 'check_out_date' | 'total_cents' | 'property_id' | 'guest_id'> | null; error: any };

      if (!booking) {
        return { ...payout, booking: null };
      }

      // Get property
      const { data: property } = await supabase
        .from('properties')
        .select('id, title')
        .eq('id', booking.property_id || '')
        .single() as { data: Pick<PropertyRow, 'id' | 'title'> | null; error: any };

      // Get guest
      const { data: guest } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', booking.guest_id || '')
        .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name'> | null; error: any };

      return {
        ...payout,
        booking: booking ? {
          ...booking,
          property: property || null,
          guest: guest || null,
        } : null,
      };
    })
  );

  const total = count || 0;

  return {
    payouts: payoutsWithRelations,
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
  const { data: payout, error: payoutError } = await supabase
    .from('payouts')
    .select('*')
    .eq('id', payoutId)
    .single() as { data: PayoutRow | null; error: any };

  if (payoutError || !payout) {
    throw new NotFoundError('Payout not found');
  }

  // Only the host can view their payout
  if (payout.host_id !== userId) {
    throw new ForbiddenError('You can only view your own payouts');
  }

  // Get booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, check_in_date, check_out_date, total_cents, nights, property_id, guest_id')
    .eq('id', payout.booking_id || '')
    .single() as { data: Pick<BookingRow, 'id' | 'check_in_date' | 'check_out_date' | 'total_cents' | 'nights' | 'property_id' | 'guest_id'> | null; error: any };

  if (!booking) {
    return { ...payout, booking: null };
  }

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, city, country')
    .eq('id', booking.property_id || '')
    .single() as { data: Pick<PropertyRow, 'id' | 'title' | 'city' | 'country'> | null; error: any };

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('id', booking.guest_id || '')
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'email'> | null; error: any };

  return {
    ...payout,
    booking: {
      ...booking,
      property: property || null,
      guest: guest || null,
    },
  };
};

/**
 * Request a payout for completed bookings
 * POST /api/payouts/request
 */
export const requestPayout = async (userId: string, data: RequestPayoutInput) => {
  const { booking_ids, payout_method_id } = data;

  // Verify user is a host
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', userId)
    .single() as { data: Pick<UserRow, 'id' | 'email'> | null; error: any };

  if (userError || !user) {
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

  // Find all completed bookings
  let bookingQuery = supabase
    .from('bookings')
    .select('id, total_cents, service_fee_cents, cleaning_fee_cents, subtotal_cents')
    .eq('host_id', userId)
    .eq('payment_status', 'completed')
    .eq('booking_status', 'completed');

  if (booking_ids && booking_ids.length > 0) {
    bookingQuery = bookingQuery.in('id', booking_ids);
  }

  const { data: allBookings } = await bookingQuery as { data: Array<Pick<BookingRow, 'id' | 'total_cents' | 'service_fee_cents' | 'cleaning_fee_cents' | 'subtotal_cents'>> | null; error: any };

  // Filter out bookings that already have payouts
  const { data: existingPayouts } = await supabase
    .from('payouts')
    .select('booking_id')
    .in('booking_id', (allBookings || []).map(b => b.id || '').filter(id => id)) as { data: Array<Pick<PayoutRow, 'booking_id'>> | null; error: any };

  const existingBookingIds = new Set((existingPayouts || []).map(p => p.booking_id || '').filter(id => id));
  const eligibleBookings = (allBookings || []).filter(b => !existingBookingIds.has(b.id || ''));

  if (eligibleBookings.length === 0) {
    throw new BadRequestError('No eligible bookings found for payout');
  }

  // Calculate total payout amount
  let totalHostEarnings = 0;
  let totalPlatformFee = 0;

  for (const booking of eligibleBookings) {
    // Host gets: subtotal + cleaning fee - platform fee
    // Platform keeps: service fee + platform fee on (subtotal + cleaning fee)
    const hostRevenue = (booking.subtotal_cents || 0) + (booking.cleaning_fee_cents || 0);
    const platformFee = Math.round(hostRevenue * (PLATFORM_FEE_PERCENT / 100));

    totalHostEarnings += hostRevenue;
    totalPlatformFee += platformFee;
  }

  const netPayoutAmount = totalHostEarnings - totalPlatformFee;

  if (netPayoutAmount <= 0) {
    throw new BadRequestError('Payout amount must be greater than zero');
  }

  // Create payout records for each booking
  const payoutData: PayoutInsert[] = eligibleBookings.map((booking) => {
    const hostRevenue = (booking.subtotal_cents || 0) + (booking.cleaning_fee_cents || 0);
    const platformFee = Math.round(hostRevenue * (PLATFORM_FEE_PERCENT / 100));
    const netAmount = hostRevenue - platformFee;

    return {
        host_id: userId,
      booking_id: booking.id || '',
        amount_cents: hostRevenue,
        platform_fee_cents: platformFee,
        net_amount_cents: netAmount,
        payout_status: 'pending',
        payout_method_id: payout_method_id || null,
      scheduled_for: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    };
  });

  const { data: payouts, error: createError } = await supabase
    .from('payouts')
    .insert(payoutData as any)
    .select() as { data: PayoutRow[] | null; error: any };

  if (createError || !payouts) {
    throw new Error(createError?.message || 'Failed to create payouts');
  }

  // Get booking details for each payout
  const payoutsWithBookings = await Promise.all(
    payouts.map(async (payout) => {
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, check_in_date, check_out_date, total_cents, property_id')
        .eq('id', payout.booking_id || '')
        .single() as { data: Pick<BookingRow, 'id' | 'check_in_date' | 'check_out_date' | 'total_cents' | 'property_id'> | null; error: any };

      if (!booking) {
        return { ...payout, booking: null };
      }

      const { data: property } = await supabase
        .from('properties')
        .select('id, title')
        .eq('id', booking.property_id || '')
        .single() as { data: Pick<PropertyRow, 'id' | 'title'> | null; error: any };

      return {
        ...payout,
        booking: {
          ...booking,
          property: property || null,
      },
      };
    })
  );

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
        // @ts-expect-error - Supabase type inference issue with update()
        supabase
          .from('payouts')
          .update({
            stripe_transfer_id: transfer.id,
            payout_status: 'processing',
        })
          .eq('id', payout.id)
      )
    );
  } catch (error) {
    // Handle Stripe errors
  }
  */

  return {
    message: 'Payout request created successfully',
    total_payouts: payoutsWithBookings.length,
    total_amount_cents: totalHostEarnings,
    platform_fee_cents: totalPlatformFee,
    net_payout_cents: netPayoutAmount,
    scheduled_for: payoutsWithBookings[0]?.scheduled_for,
    payouts: payoutsWithBookings,
  };
};
