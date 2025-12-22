import { z } from 'zod';
import { BOOKING_STATUS } from '../utils/constants';

/**
 * POST /api/bookings
 * Create new booking request
 */
export const createBookingSchema = z.object({
  property_id: z.string().uuid('Invalid property ID'),
  check_in_date: z.string().date('Invalid check-in date'),
  check_out_date: z.string().date('Invalid check-out date'),
  guest_count: z.number().int().min(1, 'At least 1 guest required').max(50),
  purpose_of_stay: z.enum(['university', 'internship', 'research', 'travel']).optional(),
  special_requests: z.string().max(1000).optional(),
}).refine(
  (data) => {
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    return checkOut > checkIn;
  },
  {
    message: 'Check-out date must be after check-in date',
    path: ['check_out_date'],
  }
);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/**
 * GET /api/bookings
 * Query parameters for listing bookings
 */
export const getBookingsSchema = z.object({
  role: z.enum(['guest', 'host']).optional(), // Filter by role (my bookings as guest or as host)
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.COMPLETED,
    ] as const)
    .optional(),
  property_id: z.string().uuid().optional(),
  upcoming: z.string().transform((val) => val === 'true').optional(), // Only future bookings
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
});

export type GetBookingsInput = z.infer<typeof getBookingsSchema>;

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel booking
 */
export const cancelBookingSchema = z.object({
  cancellation_reason: z.string().min(10, 'Please provide a reason (min 10 characters)').max(500),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

/**
 * PATCH /api/bookings/:id/decline
 * Decline booking (host only)
 */
export const declineBookingSchema = z.object({
  decline_reason: z.string().min(10, 'Please provide a reason (min 10 characters)').max(500),
});

export type DeclineBookingInput = z.infer<typeof declineBookingSchema>;
