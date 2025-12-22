import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { requireAuth } from '../middleware/auth';
import {
  uploadProfilePhoto,
  uploadPropertyPhotos,
  uploadDocument,
} from '../middleware/upload';

const router = Router();

/**
 * @route   POST /api/upload/profile-photo
 * @desc    Upload user profile photo
 * @access  Private
 */
router.post('/profile-photo', requireAuth, uploadProfilePhoto, uploadController.uploadProfilePhoto);

/**
 * @route   POST /api/upload/property-photos
 * @desc    Upload property photos (max 20)
 * @access  Private (Host only)
 */
router.post('/property-photos', requireAuth, uploadPropertyPhotos, uploadController.uploadPropertyPhotos);

/**
 * @route   POST /api/upload/verification-document
 * @desc    Upload verification document (ID, student ID)
 * @access  Private
 */
router.post(
  '/verification-document',
  requireAuth,
  uploadDocument,
  uploadController.uploadVerificationDocument
);

/**
 * @route   DELETE /api/upload/property-photo/:id
 * @desc    Delete property photo
 * @access  Private (Host only)
 */
router.delete('/property-photo/:id', requireAuth, uploadController.deletePropertyPhoto);

export default router;
