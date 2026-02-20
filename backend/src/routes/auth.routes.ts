import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address (token + code)
 * @access  Public
 */
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', requireAuth, authController.getMe);

export default router;
