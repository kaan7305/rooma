import Stripe from 'stripe';
import prisma from '../config/database';
import stripe from '../config/stripe';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type {
  CreatePaymentIntentInput,
  ConfirmPaymentInput,
  RefundPaymentInput,
} from '../validators/payment.validator';

/**
 * Create a Stripe payment intent for a booking
 * POST /api/payments/create-intent
 */
export const createPaymentIntent = async (userId: string, data: CreatePaymentIntentInput) => {
  const { booking_id, payment_method } = data;

  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: booking_id },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          host_id: true,
        },
      },
      guest: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Verify user is the guest
  if (booking.guest_id !== userId) {
    throw new ForbiddenError('You can only create payment for your own bookings');
  }

  // Check if booking already has a payment intent
  if (booking.stripe_payment_intent_id) {
    // Retrieve existing payment intent
    const existingIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);

    // If payment is already succeeded, return error
    if (existingIntent.status === 'succeeded') {
      throw new BadRequestError('Booking has already been paid');
    }

    // If payment is not cancelled, return the existing intent
    if (existingIntent.status !== 'canceled') {
      return {
        payment_intent_id: existingIntent.id,
        client_secret: existingIntent.client_secret,
        amount_cents: booking.total_cents,
        status: existingIntent.status,
      };
    }
  }

  // Create new payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.total_cents,
    currency: 'usd',
    payment_method_types: payment_method ? [payment_method] : ['card'],
    metadata: {
      booking_id: booking.id,
      guest_id: booking.guest_id || '',
      host_id: booking.property?.host_id || '',
      property_id: booking.property_id || '',
    },
    description: `Booking for ${booking.property?.title || 'property'}`,
    receipt_email: booking.guest?.email,
  });

  // Update booking with payment intent ID
  await prisma.booking.update({
    where: { id: booking_id },
    data: {
      stripe_payment_intent_id: paymentIntent.id,
      payment_method: payment_method || 'card',
      payment_status: 'pending',
    },
  });

  return {
    payment_intent_id: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
    amount_cents: booking.total_cents,
    status: paymentIntent.status,
  };
};

/**
 * Confirm a payment
 * POST /api/payments/:bookingId/confirm
 */
export const confirmPayment = async (bookingId: string, userId: string, data: ConfirmPaymentInput) => {
  const { payment_intent_id } = data;

  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      guest_id: true,
      stripe_payment_intent_id: true,
      payment_status: true,
      total_cents: true,
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Verify user is the guest
  if (booking.guest_id !== userId) {
    throw new ForbiddenError('You can only confirm payment for your own bookings');
  }

  // Verify payment intent matches
  if (booking.stripe_payment_intent_id !== payment_intent_id) {
    throw new BadRequestError('Payment intent does not match booking');
  }

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

  // Check if payment succeeded
  if (paymentIntent.status !== 'succeeded') {
    throw new BadRequestError(`Payment status is ${paymentIntent.status}, not succeeded`);
  }

  // Update booking payment status
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      payment_status: 'completed',
      booking_status: 'confirmed',
    },
  });

  return {
    message: 'Payment confirmed successfully',
    payment_intent_id: paymentIntent.id,
    status: paymentIntent.status,
    amount_cents: booking.total_cents,
  };
};

/**
 * Get payment details for a booking
 * GET /api/payments/:bookingId
 */
export const getPaymentDetails = async (bookingId: string, userId: string) => {
  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          host_id: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Verify user is the guest or host
  if (booking.guest_id !== userId && booking.property?.host_id !== userId) {
    throw new ForbiddenError('You can only view payment details for your own bookings');
  }

  // If no payment intent, return basic booking payment info
  if (!booking.stripe_payment_intent_id) {
    return {
      booking_id: booking.id,
      payment_status: booking.payment_status,
      payment_method: booking.payment_method,
      total_cents: booking.total_cents,
      subtotal_cents: booking.subtotal_cents,
      service_fee_cents: booking.service_fee_cents,
      cleaning_fee_cents: booking.cleaning_fee_cents,
      security_deposit_cents: booking.security_deposit_cents,
    };
  }

  // Retrieve payment intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id, {
    expand: ['latest_charge'],
  });

  // Extract charge info if available
  const chargeInfo: any[] = [];
  if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object') {
    const charge = paymentIntent.latest_charge as any;
    chargeInfo.push({
      id: charge.id,
      amount_cents: charge.amount,
      status: charge.status,
      created_at: new Date(charge.created * 1000),
    });
  }

  return {
    booking_id: booking.id,
    payment_intent_id: paymentIntent.id,
    payment_status: booking.payment_status,
    payment_method: booking.payment_method,
    stripe_status: paymentIntent.status,
    total_cents: booking.total_cents,
    subtotal_cents: booking.subtotal_cents,
    service_fee_cents: booking.service_fee_cents,
    cleaning_fee_cents: booking.cleaning_fee_cents,
    security_deposit_cents: booking.security_deposit_cents,
    created_at: new Date(paymentIntent.created * 1000),
    charges: chargeInfo,
  };
};

/**
 * Refund a payment
 * POST /api/payments/:bookingId/refund
 */
export const refundPayment = async (
  bookingId: string,
  userId: string,
  data: RefundPaymentInput
) => {
  const { amount_cents, reason } = data;

  // Verify booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        select: {
          id: true,
          host_id: true,
        },
      },
    },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Only host can issue refunds
  if (booking.property?.host_id !== userId) {
    throw new ForbiddenError('Only the host can issue refunds');
  }

  // Verify payment has been completed
  if (booking.payment_status !== 'completed') {
    throw new BadRequestError('Cannot refund a payment that has not been completed');
  }

  // Verify payment intent exists
  if (!booking.stripe_payment_intent_id) {
    throw new BadRequestError('No payment intent found for this booking');
  }

  // Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);

  // Verify payment succeeded
  if (paymentIntent.status !== 'succeeded') {
    throw new BadRequestError('Payment has not succeeded, cannot refund');
  }

  // Get the charge ID from payment intent
  if (!paymentIntent.latest_charge) {
    throw new BadRequestError('No charge found for this payment');
  }

  // Validate refund amount
  const refundAmount = amount_cents || booking.total_cents;
  if (refundAmount > booking.total_cents) {
    throw new BadRequestError('Refund amount cannot exceed total payment amount');
  }

  // Create refund
  const refundParams: any = {
    payment_intent: paymentIntent.id,
    amount: refundAmount,
    metadata: {
      booking_id: booking.id,
      refunded_by: userId,
    },
  };

  // Add reason if provided (must be one of Stripe's allowed values)
  if (reason) {
    refundParams.reason = 'requested_by_customer';
  }

  const refund = await stripe.refunds.create(refundParams);

  // Update booking payment status
  const newPaymentStatus = refundAmount === booking.total_cents ? 'refunded' : 'partial';

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      payment_status: newPaymentStatus,
      booking_status: 'cancelled',
    },
  });

  return {
    message: 'Refund processed successfully',
    refund_id: refund.id,
    amount_cents: refundAmount,
    status: refund.status,
  };
};

/**
 * Handle Stripe webhook events
 * POST /api/payments/webhook
 */
export const handleStripeWebhook = async (signature: string, rawBody: Buffer) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    throw new BadRequestError(`Webhook signature verification failed: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.booking_id;

      if (bookingId) {
        // Update booking status
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            payment_status: 'completed',
            booking_status: 'confirmed',
          },
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.booking_id;

      if (bookingId) {
        // Keep payment status as pending, but could add failed attempts tracking
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            payment_status: 'pending',
          },
        });
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      if (paymentIntentId) {
        // Find booking by payment intent ID
        const booking = await prisma.booking.findFirst({
          where: { stripe_payment_intent_id: paymentIntentId },
        });

        if (booking) {
          // Check if full or partial refund
          const isFullRefund = charge.amount_refunded === charge.amount;

          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              payment_status: isFullRefund ? 'refunded' : 'partial',
              booking_status: 'cancelled',
            },
          });
        }
      }
      break;
    }

    // Add more event types as needed
    default:
      // Unhandled event type
      break;
  }

  return { received: true };
};
