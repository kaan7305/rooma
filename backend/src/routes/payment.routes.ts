import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createPaymentIntentSchema,
  confirmPaymentSchema,
  refundPaymentSchema,
} from '../validators/payment.validator';

const router = Router();

/**
 * @route   POST /api/payments/create-intent
 * @desc    Create a payment intent for a booking
 * @access  Private (Guest only)
 */
router.post('/create-intent', requireAuth, validate(createPaymentIntentSchema), paymentController.createPaymentIntent);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (Stripe only - verified by signature)
 * @note    This route must NOT have body parsing middleware
 */
router.post('/webhook', paymentController.handleWebhook);

/**
 * @route   GET /api/payments/:bookingId
 * @desc    Get payment details for a booking
 * @access  Private (Guest or Host)
 */
router.get('/:bookingId', requireAuth, paymentController.getPaymentDetails);

/**
 * @route   POST /api/payments/:bookingId/confirm
 * @desc    Confirm a payment
 * @access  Private (Guest only)
 */
router.post('/:bookingId/confirm', requireAuth, validate(confirmPaymentSchema), paymentController.confirmPayment);

/**
 * @route   POST /api/payments/:bookingId/refund
 * @desc    Refund a payment
 * @access  Private (Host only)
 */
router.post('/:bookingId/refund', requireAuth, validate(refundPaymentSchema), paymentController.refundPayment);

export default router;
