import prisma from '../config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { BOOKING_STATUS, PRICING, MIN_STAY_WEEKS } from '../utils/constants';
import type {
  CreateBookingInput,
  GetBookingsInput,
  CancelBookingInput,
  DeclineBookingInput,
} from '../validators/booking.validator';

/**
 * Helper: Calculate nights between two dates
 */
const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Helper: Calculate booking pricing
 */
const calculatePricing = (
  monthlyPriceCents: number,
  cleaningFeeCents: number,
  securityDepositCents: number | null,
  nights: number
) => {
  // Calculate subtotal (pro-rated monthly price)
  const daysPerMonth = 30;
  const dailyRate = monthlyPriceCents / daysPerMonth;
  const subtotal = Math.round(dailyRate * nights);

  // Calculate service fee (guest pays platform fee)
  const serviceFee = Math.round(subtotal * (PRICING.GUEST_SERVICE_FEE_PERCENT / 100));

  // Total
  const total = subtotal + serviceFee + cleaningFeeCents + (securityDepositCents || 0);

  return {
    subtotal_cents: subtotal,
    service_fee_cents: serviceFee,
    cleaning_fee_cents: cleaningFeeCents,
    security_deposit_cents: securityDepositCents || 0,
    total_cents: total,
  };
};

/**
 * Create new booking request
 */
export const createBooking = async (guestId: string, data: CreateBookingInput) => {
  const { property_id, check_in_date, check_out_date, guest_count, purpose_of_stay, special_requests } = data;

  const checkIn = new Date(check_in_date);
  const checkOut = new Date(check_out_date);
  const nights = calculateNights(checkIn, checkOut);

  // Validate minimum stay (2 weeks minimum)
  const weeks = nights / 7;
  if (weeks < MIN_STAY_WEEKS) {
    throw new BadRequestError(`Minimum stay is ${MIN_STAY_WEEKS} weeks`);
  }

  // Get property details
  const property = await prisma.property.findUnique({
    where: { id: property_id },
    select: {
      id: true,
      host_id: true,
      title: true,
      status: true,
      max_guests: true,
      minimum_stay_weeks: true,
      maximum_stay_months: true,
      monthly_price_cents: true,
      cleaning_fee_cents: true,
      security_deposit_cents: true,
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (property.status !== 'active') {
    throw new BadRequestError('Property is not available for booking');
  }

  // Validate guest count
  if (guest_count > property.max_guests) {
    throw new BadRequestError(`Maximum ${property.max_guests} guests allowed`);
  }

  // Validate stay duration
  if (weeks < property.minimum_stay_weeks) {
    throw new BadRequestError(`Minimum stay for this property is ${property.minimum_stay_weeks} weeks`);
  }

  const months = nights / 30;
  if (months > property.maximum_stay_months) {
    throw new BadRequestError(`Maximum stay for this property is ${property.maximum_stay_months} months`);
  }

  // Check if guest is trying to book their own property
  if (property.host_id === guestId) {
    throw new BadRequestError('You cannot book your own property');
  }

  // Check availability - no overlapping confirmed bookings
  const overlappingBookings = await prisma.booking.count({
    where: {
      property_id,
      booking_status: { in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
      OR: [
        {
          // New booking starts during existing booking
          AND: [{ check_in_date: { lte: checkIn } }, { check_out_date: { gt: checkIn } }],
        },
        {
          // New booking ends during existing booking
          AND: [{ check_in_date: { lt: checkOut } }, { check_out_date: { gte: checkOut } }],
        },
        {
          // New booking completely contains existing booking
          AND: [{ check_in_date: { gte: checkIn } }, { check_out_date: { lte: checkOut } }],
        },
      ],
    },
  });

  if (overlappingBookings > 0) {
    throw new BadRequestError('Property is not available for the selected dates');
  }

  // Calculate pricing
  const pricing = calculatePricing(
    property.monthly_price_cents,
    property.cleaning_fee_cents,
    property.security_deposit_cents,
    nights
  );

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      property_id,
      guest_id: guestId,
      host_id: property.host_id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      nights,
      guest_count,
      purpose_of_stay,
      special_requests,
      ...pricing,
      booking_status: BOOKING_STATUS.PENDING,
      payment_status: 'pending',
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address_line1: true,
          city: true,
          country: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
      },
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          profile_photo_url: true,
        },
      },
    },
  });

  // TODO: Send notification to host about new booking request
  // TODO: Create conversation between guest and host

  return booking;
};

/**
 * Get bookings for a user (as guest or host)
 */
export const getBookings = async (userId: string, filters: GetBookingsInput) => {
  const { role, status, property_id, upcoming, page = 1, limit = 20 } = filters;

  const where: any = {};

  // Filter by role
  if (role === 'guest') {
    where.guest_id = userId;
  } else if (role === 'host') {
    where.host_id = userId;
  } else {
    // Return both guest and host bookings
    where.OR = [{ guest_id: userId }, { host_id: userId }];
  }

  // Filter by status
  if (status) {
    where.booking_status = status;
  }

  // Filter by property
  if (property_id) {
    where.property_id = property_id;
  }

  // Filter upcoming bookings
  if (upcoming) {
    where.check_in_date = { gte: new Date() };
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address_line1: true,
            city: true,
            country: true,
            photos: {
              take: 1,
              orderBy: { display_order: 'asc' },
              select: { photo_url: true },
            },
          },
        },
        guest: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
          },
        },
        host: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_photo_url: true,
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          property_type: true,
          address_line1: true,
          address_line2: true,
          city: true,
          state_province: true,
          postal_code: true,
          country: true,
          bedrooms: true,
          bathrooms: true,
          max_guests: true,
          cancellation_policy: true,
          photos: {
            orderBy: { display_order: 'asc' },
            select: { photo_url: true, caption: true },
          },
        },
      },
      guest: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          profile_photo_url: true,
          student_verified: true,
          id_verified: true,
        },
      },
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          profile_photo_url: true,
          student_verified: true,
          id_verified: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only guest or host can view booking details
  if (booking.guest_id !== userId && booking.host_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this booking');
  }

  return booking;
};

/**
 * Accept booking (host only)
 */
export const acceptBooking = async (bookingId: string, hostId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, host_id: true, booking_status: true },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.host_id !== hostId) {
    throw new ForbiddenError('Only the host can accept this booking');
  }

  if (booking.booking_status !== BOOKING_STATUS.PENDING) {
    throw new BadRequestError('Only pending bookings can be accepted');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      booking_status: BOOKING_STATUS.CONFIRMED,
      confirmed_at: new Date(),
      updated_at: new Date(),
    },
    include: {
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
          email: true,
        },
      },
    },
  });

  // TODO: Send notification to guest about accepted booking
  // TODO: Create calendar entries for the booking
  // TODO: Trigger payment processing

  return updatedBooking;
};

/**
 * Decline booking (host only)
 */
export const declineBooking = async (bookingId: string, hostId: string, data: DeclineBookingInput) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, host_id: true, booking_status: true },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.host_id !== hostId) {
    throw new ForbiddenError('Only the host can decline this booking');
  }

  if (booking.booking_status !== BOOKING_STATUS.PENDING) {
    throw new BadRequestError('Only pending bookings can be declined');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      booking_status: BOOKING_STATUS.CANCELLED,
      cancellation_reason: data.decline_reason,
      cancelled_by: hostId,
      cancelled_at: new Date(),
      updated_at: new Date(),
    },
    include: {
      guest: {
        select: {
          id: true,
          first_name: true,
          email: true,
        },
      },
    },
  });

  // TODO: Send notification to guest about declined booking
  // TODO: Process refund if any payment was made

  return updatedBooking;
};

/**
 * Cancel booking (guest or host)
 */
export const cancelBooking = async (bookingId: string, userId: string, data: CancelBookingInput) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      guest_id: true,
      host_id: true,
      booking_status: true,
      check_in_date: true,
      payment_status: true,
      property: {
        select: {
          cancellation_policy: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.guest_id !== userId && booking.host_id !== userId) {
    throw new ForbiddenError('Only the guest or host can cancel this booking');
  }

  if (booking.booking_status === BOOKING_STATUS.CANCELLED) {
    throw new BadRequestError('Booking is already cancelled');
  }

  if (booking.booking_status === BOOKING_STATUS.COMPLETED) {
    throw new BadRequestError('Cannot cancel a completed booking');
  }

  // TODO: Implement cancellation policy logic for refunds
  // Calculate refund based on cancellation policy and days until check-in
  // const daysUntilCheckIn = Math.ceil(
  //   (booking.check_in_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  // );
  // - Flexible: Full refund up to 24 hours before check-in
  // - Moderate: Full refund up to 5 days before check-in
  // - Strict: 50% refund up to 7 days before check-in

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      booking_status: BOOKING_STATUS.CANCELLED,
      cancellation_reason: data.cancellation_reason,
      cancelled_by: userId,
      cancelled_at: new Date(),
      updated_at: new Date(),
    },
    include: {
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
          email: true,
        },
      },
      host: {
        select: {
          id: true,
          first_name: true,
          email: true,
        },
      },
    },
  });

  // TODO: Process refund based on cancellation policy
  // TODO: Send notifications to both parties
  // TODO: Clear calendar entries

  return updatedBooking;
};

/**
 * Get booking invoice/receipt
 */
export const getBookingInvoice = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address_line1: true,
          address_line2: true,
          city: true,
          state_province: true,
          postal_code: true,
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
      host: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only guest or host can view invoice
  if (booking.guest_id !== userId && booking.host_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this invoice');
  }

  // Format invoice data
  return {
    booking_id: booking.id,
    booking_status: booking.booking_status,
    payment_status: booking.payment_status,
    created_at: booking.created_at,
    confirmed_at: booking.confirmed_at,

    // Guest details
    guest: booking.guest,

    // Property details
    property: booking.property,

    // Booking details
    check_in_date: booking.check_in_date,
    check_out_date: booking.check_out_date,
    nights: booking.nights,
    guest_count: booking.guest_count,

    // Pricing breakdown
    pricing: {
      subtotal_cents: booking.subtotal_cents,
      cleaning_fee_cents: booking.cleaning_fee_cents,
      service_fee_cents: booking.service_fee_cents,
      security_deposit_cents: booking.security_deposit_cents,
      total_cents: booking.total_cents,
    },

    // Payment details
    payment_method: booking.payment_method,
    stripe_payment_intent_id: booking.stripe_payment_intent_id,
  };
};
