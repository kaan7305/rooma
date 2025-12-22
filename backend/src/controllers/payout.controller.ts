import { Request, Response, NextFunction } from 'express';
import * as payoutService from '../services/payout.service';
import { UnauthorizedError } from '../utils/errors';
import type { GetPayoutsInput, RequestPayoutInput } from '../validators/payout.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * GET /api/payouts
 * Get all payouts for a host
 */
export const getPayouts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const filters: GetPayoutsInput = req.query as any;

    const result = await payoutService.getHostPayouts(userId, filters);

    res.status(200).json({
      data: result.payouts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payouts/:id
 * Get payout by ID
 */
export const getPayoutById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const payout = await payoutService.getPayoutById(id, userId);

    res.status(200).json({
      data: payout,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payouts/request
 * Request a payout for completed bookings
 */
export const requestPayout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: RequestPayoutInput = req.body;

    const result = await payoutService.requestPayout(userId, data);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
