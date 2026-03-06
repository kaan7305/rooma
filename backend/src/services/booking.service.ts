import supabase from '../config/supabase';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { BOOKING_STATUS, PRICING, MIN_STAY_WEEKS, CANCELLATION_POLICIES, CALENDAR_STATUS } from '../utils/constants';
import { sendBookingConfirmationEmail } from './email.service';
import { createNotification } from './notification.service';
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
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, host_id, title, status, max_guests, minimum_stay_weeks, maximum_stay_months, monthly_price_cents, cleaning_fee_cents, security_deposit_cents')
    .eq('id', property_id)
    .single();

  if (propertyError || !property) {
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
  // Get all bookings for this property with overlapping dates
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('id, check_in_date, check_out_date')
    .eq('property_id', property_id)
    .in('booking_status', [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING]);

  // Filter for overlapping bookings in JavaScript
  const overlappingBookings = existingBookings?.filter((booking) => {
    const existingCheckIn = new Date(booking.check_in_date);
    const existingCheckOut = new Date(booking.check_out_date);
    
    // Check if dates overlap
    return (
      (checkIn <= existingCheckIn && checkOut > existingCheckIn) ||
      (checkIn < existingCheckOut && checkOut >= existingCheckOut) ||
      (checkIn >= existingCheckIn && checkOut <= existingCheckOut)
    );
  }) || [];

  if (overlappingBookings.length > 0) {
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
  const { data: booking, error: createError } = await supabase
    .from('bookings')
    .insert({
      property_id,
      guest_id: guestId,
      host_id: property.host_id,
      check_in_date: checkIn.toISOString().split('T')[0],
      check_out_date: checkOut.toISOString().split('T')[0],
      nights,
      guest_count,
      purpose_of_stay,
      special_requests,
      ...pricing,
      booking_status: BOOKING_STATUS.PENDING,
      payment_status: 'pending',
    })
    .select()
    .single();

  if (createError || !booking) {
    throw new Error(createError?.message || 'Failed to create booking');
  }

  // Get property details
  const { data: propertyData } = await supabase
    .from('properties')
    .select('id, title, address_line1, city, country')
    .eq('id', property_id)
    .single();

  // Get property photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('photo_url')
    .eq('property_id', property_id)
    .order('display_order', { ascending: true })
    .limit(1);

  // Get host details
  const { data: host } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', property.host_id)
    .single();

  // Send notification to host about new booking request
  await createNotification({
    user_id: property.host_id,
    type: 'booking_request',
    title: 'New Booking Request',
    message: `You have a new booking request for "${propertyData?.title || 'your property'}" from ${host ? '' : 'a guest'}`,
    data: { booking_id: booking.id, property_id: property_id },
  });

  // Create conversation between guest and host
  const [part1, part2] = [guestId, property.host_id].sort();
  const { data: existingConv } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1_id', part1)
    .eq('participant_2_id', part2)
    .eq('property_id', property_id)
    .maybeSingle();

  if (!existingConv) {
    await supabase.from('conversations').insert({
      participant_1_id: part1,
      participant_2_id: part2,
      property_id,
      booking_id: booking.id,
    });
  }

  return {
    ...booking,
    property: propertyData ? {
      ...propertyData,
      photos: photos || [],
    } : null,
    host: host || null,
  };
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

  // Build Supabase query
  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' });

  // Filter by role
  if (role === 'guest') {
    query = query.eq('guest_id', userId);
  } else if (role === 'host') {
    query = query.eq('host_id', userId);
  } else {
    // Return both guest and host bookings - need to use OR
    query = query.or(`guest_id.eq.${userId},host_id.eq.${userId}`);
  }

  // Filter by status
  if (status) {
    query = query.eq('booking_status', status);
  }

  // Filter by property
  if (property_id) {
    query = query.eq('property_id', property_id);
  }

  // Filter upcoming bookings
  if (upcoming) {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('check_in_date', today);
  }

  // Apply pagination and ordering
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: bookings, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Get related data for each booking
  const bookingsWithRelations = await Promise.all(
    (bookings || []).map(async (booking) => {
      // Get property
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, address_line1, city, country')
        .eq('id', booking.property_id)
        .single();

      // Get property photos
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', booking.property_id)
        .order('display_order', { ascending: true })
        .limit(1);

      // Get guest
      const { data: guest } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', booking.guest_id)
        .single();

      // Get host
      const { data: host } = await supabase
        .from('users')
        .select('id, first_name, last_name, profile_photo_url')
        .eq('id', booking.host_id)
        .single();

      return {
        ...booking,
        property: property ? { ...property, photos: photos || [] } : null,
        guest: guest || null,
        host: host || null,
      };
    })
  );

  return {
    bookings: bookingsWithRelations,
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages: Math.ceil((count || 0) / limit),
    },
  };
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string, userId: string) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only guest or host can view booking details
  if (booking.guest_id !== userId && booking.host_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this booking');
  }

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, description, property_type, address_line1, address_line2, city, state_province, postal_code, country, bedrooms, bathrooms, max_guests, cancellation_policy')
    .eq('id', booking.property_id)
    .single();

  // Get property photos
  const { data: photos } = await supabase
    .from('property_photos')
    .select('photo_url, caption')
    .eq('property_id', booking.property_id)
    .order('display_order', { ascending: true });

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, phone, profile_photo_url, student_verified, id_verified')
    .eq('id', booking.guest_id)
    .single();

  // Get host
  const { data: host } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, phone, profile_photo_url, student_verified, id_verified')
    .eq('id', booking.host_id)
    .single();

  return {
    ...booking,
    property: property ? { ...property, photos: photos || [] } : null,
    guest: guest || null,
    host: host || null,
  };
};

/**
 * Accept booking (host only)
 */
export const acceptBooking = async (bookingId: string, hostId: string) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, host_id, booking_status')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.host_id !== hostId) {
    throw new ForbiddenError('Only the host can accept this booking');
  }

  if (booking.booking_status !== BOOKING_STATUS.PENDING) {
    throw new BadRequestError('Only pending bookings can be accepted');
  }

  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({
      booking_status: BOOKING_STATUS.CONFIRMED,
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError || !updatedBooking) {
    throw new Error(updateError?.message || 'Failed to update booking');
  }

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title')
    .eq('id', updatedBooking.property_id)
    .single();

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('id', updatedBooking.guest_id)
    .single();

  // Send notification to guest about accepted booking
  if (guest) {
    await createNotification({
      user_id: updatedBooking.guest_id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your booking for "${property?.title || 'a property'}" has been confirmed.`,
      data: { booking_id: bookingId, property_id: updatedBooking.property_id },
    });

    // Send confirmation email
    await sendBookingConfirmationEmail(guest.email, guest.first_name, {
      propertyTitle: property?.title || 'Property',
      checkIn: updatedBooking.check_in_date,
      checkOut: updatedBooking.check_out_date,
      totalPrice: updatedBooking.total_cents,
      bookingId: bookingId,
    });
  }

  // Create calendar entries (block dates for the booking)
  const checkIn = new Date(updatedBooking.check_in_date);
  const checkOut = new Date(updatedBooking.check_out_date);
  const calendarEntries: Array<{ property_id: string; date: string; status: string; booking_id: string }> = [];
  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    calendarEntries.push({
      property_id: updatedBooking.property_id,
      date: d.toISOString().split('T')[0]!,
      status: CALENDAR_STATUS.BOOKED,
      booking_id: bookingId,
    });
  }
  if (calendarEntries.length > 0) {
    await supabase.from('booking_calendar').upsert(calendarEntries, {
      onConflict: 'property_id,date',
    });
  }

  return {
    ...updatedBooking,
    property: property || null,
    guest: guest || null,
  };
};

/**
 * Decline booking (host only)
 */
export const declineBooking = async (bookingId: string, hostId: string, data: DeclineBookingInput) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, host_id, booking_status')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.host_id !== hostId) {
    throw new ForbiddenError('Only the host can decline this booking');
  }

  if (booking.booking_status !== BOOKING_STATUS.PENDING) {
    throw new BadRequestError('Only pending bookings can be declined');
  }

  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({
      booking_status: BOOKING_STATUS.CANCELLED,
      cancellation_reason: data.decline_reason,
      cancelled_by: hostId,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError || !updatedBooking) {
    throw new Error(updateError?.message || 'Failed to update booking');
  }

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, email')
    .eq('id', updatedBooking.guest_id)
    .single();

  // Send notification to guest about declined booking
  if (guest) {
    await createNotification({
      user_id: updatedBooking.guest_id,
      type: 'booking_declined',
      title: 'Booking Declined',
      message: `Your booking request has been declined.${data.decline_reason ? ` Reason: ${data.decline_reason}` : ''}`,
      data: { booking_id: bookingId },
    });
  }

  // Process refund if any payment was made
  if (updatedBooking.stripe_payment_intent_id && updatedBooking.payment_status === 'completed') {
    try {
      const stripe = (await import('../config/stripe')).default;
      await stripe.refunds.create({
        payment_intent: updatedBooking.stripe_payment_intent_id,
        metadata: { booking_id: bookingId, reason: 'host_declined' },
      });
      await supabase.from('bookings').update({ payment_status: 'refunded' }).eq('id', bookingId);
    } catch (refundErr) {
      console.error('Failed to process refund for declined booking:', refundErr);
    }
  }

  return {
    ...updatedBooking,
    guest: guest || null,
  };
};

/**
 * Cancel booking (guest or host)
 */
export const cancelBooking = async (bookingId: string, userId: string, data: CancelBookingInput) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, guest_id, host_id, booking_status, check_in_date, payment_status, property_id')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
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

  // Get property cancellation policy and details
  const { data: propertyInfo } = await supabase
    .from('properties')
    .select('id, title, cancellation_policy')
    .eq('id', booking.property_id)
    .single();

  const cancellationPolicy = propertyInfo?.cancellation_policy || CANCELLATION_POLICIES.MODERATE;
  const daysUntilCheckIn = Math.ceil(
    (new Date(booking.check_in_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate refund percentage based on cancellation policy
  let refundPercent = 0;
  switch (cancellationPolicy) {
    case CANCELLATION_POLICIES.FLEXIBLE:
      refundPercent = daysUntilCheckIn >= 1 ? 100 : 0;
      break;
    case CANCELLATION_POLICIES.MODERATE:
      refundPercent = daysUntilCheckIn >= 5 ? 100 : 0;
      break;
    case CANCELLATION_POLICIES.STRICT:
      refundPercent = daysUntilCheckIn >= 7 ? 50 : 0;
      break;
  }

  const { data: updatedBooking, error: updateError } = await supabase
    .from('bookings')
    .update({
      booking_status: BOOKING_STATUS.CANCELLED,
      cancellation_reason: data.cancellation_reason,
      cancelled_by: userId,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError || !updatedBooking) {
    throw new Error(updateError?.message || 'Failed to update booking');
  }

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, email')
    .eq('id', updatedBooking.guest_id)
    .single();

  // Get host
  const { data: host } = await supabase
    .from('users')
    .select('id, first_name, email')
    .eq('id', updatedBooking.host_id)
    .single();

  // Process refund based on cancellation policy
  if (
    refundPercent > 0 &&
    booking.payment_status === 'completed' &&
    updatedBooking.stripe_payment_intent_id
  ) {
    try {
      const stripe = (await import('../config/stripe')).default;
      const refundAmount = Math.round((updatedBooking.total_cents * refundPercent) / 100);
      await stripe.refunds.create({
        payment_intent: updatedBooking.stripe_payment_intent_id,
        amount: refundAmount,
        metadata: { booking_id: bookingId, refund_percent: String(refundPercent) },
      });
      const newPaymentStatus = refundPercent === 100 ? 'refunded' : 'partial';
      await supabase.from('bookings').update({ payment_status: newPaymentStatus }).eq('id', bookingId);
    } catch (refundErr) {
      console.error('Failed to process cancellation refund:', refundErr);
    }
  }

  // Send notifications to both parties
  if (guest) {
    await createNotification({
      user_id: updatedBooking.guest_id,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `Your booking for "${propertyInfo?.title || 'a property'}" has been cancelled.${refundPercent > 0 ? ` A ${refundPercent}% refund is being processed.` : ''}`,
      data: { booking_id: bookingId, refund_percent: refundPercent },
    });
  }
  if (host) {
    await createNotification({
      user_id: updatedBooking.host_id,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `A booking for "${propertyInfo?.title || 'your property'}" has been cancelled by the ${booking.guest_id === userId ? 'guest' : 'host'}.`,
      data: { booking_id: bookingId },
    });
  }

  // Clear calendar entries for cancelled booking
  await supabase
    .from('booking_calendar')
    .delete()
    .eq('booking_id', bookingId);

  return {
    ...updatedBooking,
    property: propertyInfo || null,
    guest: guest || null,
    host: host || null,
  };
};

/**
 * Get booking invoice/receipt
 */
export const getBookingInvoice = async (bookingId: string, userId: string) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (bookingError || !booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only guest or host can view invoice
  if (booking.guest_id !== userId && booking.host_id !== userId) {
    throw new ForbiddenError('You do not have permission to view this invoice');
  }

  // Get property
  const { data: property } = await supabase
    .from('properties')
    .select('id, title, address_line1, address_line2, city, state_province, postal_code, country')
    .eq('id', booking.property_id)
    .single();

  // Get guest
  const { data: guest } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('id', booking.guest_id)
    .single();

  // Format invoice data
  return {
    booking_id: booking.id,
    booking_status: booking.booking_status,
    payment_status: booking.payment_status,
    created_at: booking.created_at,
    confirmed_at: booking.confirmed_at,

    // Guest details
    guest: guest || null,

    // Property details
    property: property || null,

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
