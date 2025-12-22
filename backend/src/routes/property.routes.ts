import { Router } from 'express';
import * as propertyController from '../controllers/property.controller';
import { validate } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  createPropertySchema,
  updatePropertySchema,
  searchPropertiesSchema,
  addPhotoSchema,
} from '../validators/property.validator';

const router = Router();

/**
 * @route   GET /api/properties
 * @desc    Search properties with filters
 * @access  Public
 */
router.get('/', validate(searchPropertiesSchema, 'query'), propertyController.searchProperties);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property details by ID
 * @access  Public
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @route   POST /api/properties
 * @desc    Create new property listing
 * @access  Private (Hosts only)
 */
router.post('/', requireAuth, validate(createPropertySchema), propertyController.createProperty);

/**
 * @route   PATCH /api/properties/:id
 * @desc    Update property
 * @access  Private (Owner only)
 */
router.patch('/:id', requireAuth, validate(updatePropertySchema), propertyController.updateProperty);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property (soft delete)
 * @access  Private (Owner only)
 */
router.delete('/:id', requireAuth, propertyController.deleteProperty);

/**
 * @route   POST /api/properties/:id/photos
 * @desc    Add photo to property
 * @access  Private (Owner only)
 */
router.post('/:id/photos', requireAuth, validate(addPhotoSchema), propertyController.addPhoto);

/**
 * @route   DELETE /api/properties/:id/photos/:photoId
 * @desc    Delete photo from property
 * @access  Private (Owner only)
 */
router.delete('/:id/photos/:photoId', requireAuth, propertyController.deletePhoto);

/**
 * @route   GET /api/properties/:id/availability
 * @desc    Get property availability calendar
 * @access  Public
 */
router.get('/:id/availability', propertyController.getAvailability);

/**
 * @route   GET /api/properties/:id/reviews
 * @desc    Get property reviews
 * @access  Public
 */
router.get('/:id/reviews', propertyController.getPropertyReviews);

export default router;
