import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createReviewSchema,
  updateReviewSchema,
  hostResponseSchema,
  getReviewsSchema,
} from '../validators/review.validator';

const router = Router();

/**
 * @route   POST /api/reviews
 * @desc    Create review for a completed booking
 * @access  Private
 */
router.post('/', requireAuth, validate(createReviewSchema), reviewController.createReview);

/**
 * @route   GET /api/reviews
 * @desc    Get reviews with filters
 * @access  Public
 */
router.get('/', validate(getReviewsSchema, 'query'), reviewController.getReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review details
 * @access  Public
 */
router.get('/:id', reviewController.getReviewById);

/**
 * @route   PATCH /api/reviews/:id
 * @desc    Update review (before host responds)
 * @access  Private (Reviewer only)
 */
router.patch('/:id', requireAuth, validate(updateReviewSchema), reviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review (within 48 hours)
 * @access  Private (Reviewer only)
 */
router.delete('/:id', requireAuth, reviewController.deleteReview);

/**
 * @route   POST /api/reviews/:id/respond
 * @desc    Host response to a review
 * @access  Private (Host only)
 */
router.post('/:id/respond', requireAuth, validate(hostResponseSchema), reviewController.addHostResponse);

export default router;
