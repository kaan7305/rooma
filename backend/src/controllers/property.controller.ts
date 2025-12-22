import { Request, Response, NextFunction } from 'express';
import * as propertyService from '../services/property.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
  SearchPropertiesInput,
  AddPhotoInput,
} from '../validators/property.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/properties
 * Create new property listing
 */
export const createProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId: string = getAuthUserId(req);
    const data: CreatePropertyInput = req.body;

    const property = await propertyService.createProperty(hostId, data);

    res.status(201).json({
      message: 'Property created successfully. Pending admin verification.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/properties/:id
 * Get property details by ID
 */
export const getPropertyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).userId as string | undefined; // Optional - may be undefined for non-authenticated users

    const property = await propertyService.getPropertyById(id, userId);

    res.status(200).json({
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/properties
 * Search properties with filters
 */
export const searchProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as unknown as SearchPropertiesInput;

    const result = await propertyService.searchProperties(filters);

    res.status(200).json({
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/properties/:id
 * Update property
 */
export const updateProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const hostId: string = getAuthUserId(req);
    const data: UpdatePropertyInput = req.body;

    const property = await propertyService.updateProperty(id, hostId, data);

    res.status(200).json({
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/properties/:id
 * Delete property (soft delete)
 */
export const deleteProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const hostId: string = getAuthUserId(req);

    const result = await propertyService.deleteProperty(id, hostId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/properties/:id/photos
 * Add photo to property
 */
export const addPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const hostId: string = getAuthUserId(req);
    const data: AddPhotoInput = req.body;

    const photo = await propertyService.addPhoto(id, hostId, data);

    res.status(201).json({
      message: 'Photo added successfully',
      data: photo,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/properties/:id/photos/:photoId
 * Delete photo from property
 */
export const deletePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const photoId = req.params.photoId as string;
    const hostId: string = getAuthUserId(req);

    const result = await propertyService.deletePhoto(id, photoId, hostId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/properties/:id/availability
 * Get property availability (booked dates)
 */
export const getAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    const availability = await propertyService.getAvailability(id);

    res.status(200).json({
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/properties/:id/reviews
 * Get property reviews with pagination
 */
export const getPropertyReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await propertyService.getPropertyReviews(id, page, limit);

    res.status(200).json({
      data: result.reviews,
      average_ratings: result.average_ratings,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
