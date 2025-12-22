import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/payment.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreatePaymentIntentInput,
  ConfirmPaymentInput,
  RefundPaymentInput,
} from '../validators/payment.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/payments/create-intent
 * Create a payment intent for a booking
 */
export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: CreatePaymentIntentInput = req.body;

    const result = await paymentService.createPaymentIntent(userId, data);

    res.status(201).json({
      message: 'Payment intent created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/:bookingId/confirm
 * Confirm a payment
 */
export const confirmPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const bookingId = req.params.bookingId as string;
    const data: ConfirmPaymentInput = req.body;

    const result = await paymentService.confirmPayment(bookingId, userId, data);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payments/:bookingId
 * Get payment details for a booking
 */
export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const bookingId = req.params.bookingId as string;

    const result = await paymentService.getPaymentDetails(bookingId, userId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/:bookingId/refund
 * Refund a payment
 */
export const refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const bookingId = req.params.bookingId as string;
    const data: RefundPaymentInput = req.body;

    const result = await paymentService.refundPayment(bookingId, userId, data);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 */
export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      res.status(400).json({ error: 'Missing stripe-signature header' });
      return;
    }

    // Raw body is needed for webhook signature verification
    const rawBody = (req as any).rawBody as Buffer;

    if (!rawBody) {
      res.status(400).json({ error: 'Missing raw body for webhook verification' });
      return;
    }

    const result = await paymentService.handleStripeWebhook(signature, rawBody);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
