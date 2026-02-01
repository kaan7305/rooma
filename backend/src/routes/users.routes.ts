import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  updateProfileSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  uploadStudentIdSchema,
  uploadGovernmentIdSchema,
} from '../validators/user.validator';

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', requireAuth, userController.getMyProfile);

/**
 * @route   PATCH /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.patch('/me', requireAuth, validate(updateProfileSchema), userController.updateProfile);

/**
 * @route   POST /api/users/verify-email
 * @desc    Verify email address
 * @access  Private
 */
router.post('/verify-email', requireAuth, validate(verifyEmailSchema), userController.verifyEmail);

/**
 * @route   POST /api/users/verify-phone
 * @desc    Verify phone number
 * @access  Private
 */
router.post('/verify-phone', requireAuth, validate(verifyPhoneSchema), userController.verifyPhone);

/**
 * @route   POST /api/users/upload-student-id
 * @desc    Upload student ID for verification
 * @access  Private
 */
router.post(
  '/upload-student-id',
  requireAuth,
  validate(uploadStudentIdSchema),
  userController.uploadStudentId
);

/**
 * @route   POST /api/users/upload-government-id
 * @desc    Upload government ID for verification
 * @access  Private
 */
router.post(
  '/upload-government-id',
  requireAuth,
  validate(uploadGovernmentIdSchema),
  userController.uploadGovernmentId
);

/**
 * @route   GET /api/users/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/settings', requireAuth, userController.getUserSettings);

/**
 * @route   PATCH /api/users/settings
 * @desc    Update user settings
 * @access  Private
 */
router.patch('/settings', requireAuth, userController.updateUserSettings);

/**
 * @route   GET /api/users/:id/profile
 * @desc    Get public user profile
 * @access  Public
 */
router.get('/:id/profile', userController.getUserProfile);

export default router;
