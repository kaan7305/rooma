import { z } from 'zod';

/**
 * POST /api/reviews
 * Create review for a completed booking
 */
export const createReviewSchema = z.object({
  booking_id: z.string().uuid('Invalid booking ID'),

  // Ratings (1-5 scale)
  overall_rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  cleanliness_rating: z.number().min(1).max(5).optional(),
  accuracy_rating: z.number().min(1).max(5).optional(),
  location_rating: z.number().min(1).max(5).optional(),
  communication_rating: z.number().min(1).max(5).optional(),
  value_rating: z.number().min(1).max(5).optional(),

  // Review content
  review_text: z.string().min(20, 'Review must be at least 20 characters').max(2000).optional(),

  // Photo URLs (uploaded separately via file upload service)
  photo_urls: z.array(z.string().url()).max(10, 'Maximum 10 photos').optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

/**
 * PATCH /api/reviews/:id
 * Update review (before host responds)
 */
export const updateReviewSchema = z.object({
  // Ratings
  overall_rating: z.number().min(1).max(5).optional(),
  cleanliness_rating: z.number().min(1).max(5).optional(),
  accuracy_rating: z.number().min(1).max(5).optional(),
  location_rating: z.number().min(1).max(5).optional(),
  communication_rating: z.number().min(1).max(5).optional(),
  value_rating: z.number().min(1).max(5).optional(),

  // Review content
  review_text: z.string().min(20).max(2000).optional(),
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

/**
 * POST /api/reviews/:id/respond
 * Host response to a review
 */
export const hostResponseSchema = z.object({
  host_response: z.string().min(20, 'Response must be at least 20 characters').max(1000),
});

export type HostResponseInput = z.infer<typeof hostResponseSchema>;

/**
 * GET /api/reviews
 * Query parameters for listing reviews
 */
export const getReviewsSchema = z.object({
  property_id: z.string().uuid().optional(),
  reviewer_id: z.string().uuid().optional(),
  reviewee_id: z.string().uuid().optional(),
  min_rating: z.string().transform(Number).pipe(z.number().min(1).max(5)).optional(),
  page: z.string().optional().default('1').transform(Number).pipe(z.number().int().min(1)),
  limit: z.string().optional().default('20').transform(Number).pipe(z.number().int().min(1).max(100)),
});

export type GetReviewsInput = z.infer<typeof getReviewsSchema>;
