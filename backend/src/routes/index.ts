import { Router } from 'express';
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

// Authentication routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Property routes
router.use('/properties', propertyRoutes);

// Booking routes
router.use('/bookings', bookingRoutes);

// Review routes
router.use('/reviews', reviewRoutes);

// Wishlist routes
router.use('/wishlists', wishlistRoutes);

// University routes
router.use('/universities', universityRoutes);

// Conversation/Message routes
router.use('/conversations', conversationRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Payout routes
router.use('/payouts', payoutRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// Test routes (development only)
if (process.env.NODE_ENV === 'development') {
  router.use('/test', testRoutes);
}

export default router;
