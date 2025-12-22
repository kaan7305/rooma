import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createBookingSchema,
  getBookingsSchema,
  cancelBookingSchema,
  declineBookingSchema,
} from '../validators/booking.validator';

const router = Router();

/**
 * @route   POST /api/bookings
 * @desc    Create new booking request
 * @access  Private (Guests)
 */
router.post('/', requireAuth, validate(createBookingSchema), bookingController.createBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings (as guest or host)
 * @access  Private
 */
router.get('/', requireAuth, validate(getBookingsSchema, 'query'), bookingController.getBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking details
 * @access  Private (Guest or Host only)
 */
router.get('/:id', requireAuth, bookingController.getBookingById);

/**
 * @route   PATCH /api/bookings/:id/accept
 * @desc    Accept booking request
 * @access  Private (Host only)
 */
router.patch('/:id/accept', requireAuth, bookingController.acceptBooking);

/**
 * @route   PATCH /api/bookings/:id/decline
 * @desc    Decline booking request
 * @access  Private (Host only)
 */
router.patch('/:id/decline', requireAuth, validate(declineBookingSchema), bookingController.declineBooking);

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private (Guest or Host)
 */
router.patch('/:id/cancel', requireAuth, validate(cancelBookingSchema), bookingController.cancelBooking);

/**
 * @route   GET /api/bookings/:id/invoice
 * @desc    Get booking invoice/receipt
 * @access  Private (Guest or Host only)
 */
router.get('/:id/invoice', requireAuth, bookingController.getBookingInvoice);

export default router;
