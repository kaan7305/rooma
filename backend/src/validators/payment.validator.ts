import { z } from 'zod';

/**
 * POST /api/payments/create-intent
 * Create a payment intent for a booking
 */
export const createPaymentIntentSchema = z.object({
  booking_id: z.string().uuid(),
  payment_method: z.string().optional(), // 'card', 'bank_transfer', etc.
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;

/**
 * POST /api/payments/:id/confirm
 * Confirm a payment
 */
export const confirmPaymentSchema = z.object({
  payment_intent_id: z.string().min(1),
});

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;

/**
 * POST /api/payments/:id/refund
 * Refund a payment
 */
export const refundPaymentSchema = z.object({
  amount_cents: z.number().int().positive().optional(), // Partial refund if specified, full if not
  reason: z.string().min(1).max(500).optional(),
});

export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
