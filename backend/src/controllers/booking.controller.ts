import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreateBookingInput,
  GetBookingsInput,
  CancelBookingInput,
  DeclineBookingInput,
} from '../validators/booking.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/bookings
 * Create new booking request
 */
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const guestId: string = getAuthUserId(req);
    const data: CreateBookingInput = req.body;

    const booking = await bookingService.createBooking(guestId, data);

    res.status(201).json({
      message: 'Booking request created successfully. Waiting for host confirmation.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings
 * Get user's bookings (as guest or host)
 */
export const getBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const filters = req.query as unknown as GetBookingsInput;

    const result = await bookingService.getBookings(userId, filters);

    res.status(200).json({
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:id
 * Get booking details
 */
export const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const booking = await bookingService.getBookingById(id, userId);

    res.status(200).json({
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id/accept
 * Accept booking (host only)
 */
export const acceptBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const booking = await bookingService.acceptBooking(id, hostId);

    res.status(200).json({
      message: 'Booking accepted successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id/decline
 * Decline booking (host only)
 */
export const declineBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: DeclineBookingInput = req.body;

    const booking = await bookingService.declineBooking(id, hostId, data);

    res.status(200).json({
      message: 'Booking declined',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/bookings/:id/cancel
 * Cancel booking (guest or host)
 */
export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;
    const data: CancelBookingInput = req.body;

    const booking = await bookingService.cancelBooking(id, userId, data);

    res.status(200).json({
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:id/invoice
 * Get booking invoice/receipt
 */
export const getBookingInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const id = req.params.id as string;

    const invoice = await bookingService.getBookingInvoice(id, userId);

    res.status(200).json({
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
