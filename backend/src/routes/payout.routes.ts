import { Router } from 'express';
import * as payoutController from '../controllers/payout.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { getPayoutsSchema, requestPayoutSchema } from '../validators/payout.validator';

const router = Router();

/**
 * @route   POST /api/payouts/request
 * @desc    Request a payout for completed bookings
 * @access  Private (Host only)
 */
router.post('/request', requireAuth, validate(requestPayoutSchema), payoutController.requestPayout);

/**
 * @route   GET /api/payouts
 * @desc    Get all payouts for a host
 * @access  Private (Host only)
 */
router.get('/', requireAuth, validate(getPayoutsSchema, 'query'), payoutController.getPayouts);

/**
 * @route   GET /api/payouts/:id
 * @desc    Get payout by ID
 * @access  Private (Host only)
 */
router.get('/:id', requireAuth, payoutController.getPayoutById);

export default router;
