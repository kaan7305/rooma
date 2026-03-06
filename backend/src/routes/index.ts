import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import propertyRoutes from './property.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import wishlistRoutes from './wishlist.routes';
import universityRoutes from './university.routes';
import conversationRoutes from './conversation.routes';
import paymentRoutes from './payment.routes';
import payoutRoutes from './payout.routes';
import uploadRoutes from './upload.routes';
import testRoutes from './test.routes';

const router = Router();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window (login, register, etc.)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 write requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});

// Apply general rate limit to all API routes
router.use(apiLimiter);

// Authentication routes (stricter limits)
router.use('/auth', authLimiter, authRoutes);

// User routes
router.use('/users', userRoutes);

// Property routes
router.use('/properties', propertyRoutes);

// Booking routes (write-limited)
router.use('/bookings', writeLimiter, bookingRoutes);

// Review routes (write-limited)
router.use('/reviews', writeLimiter, reviewRoutes);

// Wishlist routes
router.use('/wishlists', wishlistRoutes);

// University routes
router.use('/universities', universityRoutes);

// Conversation/Message routes
router.use('/conversations', conversationRoutes);

// Payment routes (write-limited)
router.use('/payments', writeLimiter, paymentRoutes);

// Payout routes (write-limited)
router.use('/payouts', writeLimiter, payoutRoutes);

// Upload routes (write-limited)
router.use('/upload', writeLimiter, uploadRoutes);

// Test routes (development only)
if (process.env.NODE_ENV === 'development') {
  router.use('/test', testRoutes);
}

export default router;
