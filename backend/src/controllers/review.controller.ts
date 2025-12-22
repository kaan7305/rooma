import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  HostResponseInput,
  GetReviewsInput,
} from '../validators/review.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/reviews
 * Create review for a completed booking
 */
export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: CreateReviewInput = req.body;

    const review = await reviewService.createReview(userId, data);

    res.status(201).json({
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/:id
 * Get review details
 */
export const getReviewById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const review = await reviewService.getReviewById(id);

    res.status(200).json({
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews
 * Get reviews with filters
 */
export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as unknown as GetReviewsInput;

    const result = await reviewService.getReviews(filters);

    res.status(200).json({
      data: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/reviews/:id
 * Update review (before host responds)
 */
export const updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: UpdateReviewInput = req.body;

    const review = await reviewService.updateReview(id, userId, data);

    res.status(200).json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/reviews/:id
 * Delete review (within 48 hours, before host responds)
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const result = await reviewService.deleteReview(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reviews/:id/respond
 * Host response to a review
 */
export const addHostResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: HostResponseInput = req.body;

    const review = await reviewService.addHostResponse(id, userId, data);

    res.status(200).json({
      message: 'Response added successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
