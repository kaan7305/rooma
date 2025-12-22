import { z } from 'zod';

/**
 * GET /api/payouts
 * Get all payouts for a host
 */
export const getPayoutsSchema = z.object({
  // Filter by status
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),

  // Pagination
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
});

export type GetPayoutsInput = z.infer<typeof getPayoutsSchema>;

/**
 * POST /api/payouts/request
 * Request a payout for completed bookings
 */
export const requestPayoutSchema = z.object({
  // Optional: specific booking IDs to payout (if not provided, payout all eligible)
  booking_ids: z.array(z.string().uuid()).optional(),

  // Optional: payout method ID (if not provided, use default)
  payout_method_id: z.string().uuid().optional(),
});

export type RequestPayoutInput = z.infer<typeof requestPayoutSchema>;
