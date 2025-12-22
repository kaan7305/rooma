import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/upload.service';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import prisma from '../config/database';

// Extend Request type to include file and files from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * POST /api/upload/profile-photo
 * Upload user profile photo
 */
export const uploadProfilePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const file = (req as MulterRequest).file;

    if (!file) {
      throw new BadRequestError('No file uploaded');
    }

    // Upload to Cloudinary
    const uploadResult = await uploadService.uploadImage(file, 'profile-photos', {
      maxWidth: 800,
      maxHeight: 800,
      quality: 85,
    });

    // Update user's profile photo in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profile_photo_url: uploadResult.url },
      select: {
        id: true,
        profile_photo_url: true,
      },
    });

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      data: {
        url: uploadResult.url,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload/property-photos
 * Upload property photos
 */
export const uploadPropertyPhotos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const files = (req as MulterRequest).files;
    const { property_id } = req.body;

    if (!files || files.length === 0) {
      throw new BadRequestError('No files uploaded');
    }

    if (!property_id) {
      throw new BadRequestError('Property ID is required');
    }

    // Verify property ownership
    const property = await prisma.property.findUnique({
      where: { id: property_id },
      select: { host_id: true },
    });

    if (!property) {
      throw new BadRequestError('Property not found');
    }

    if (property.host_id !== userId) {
      throw new BadRequestError('You can only upload photos for your own properties');
    }

    // Upload all photos to Cloudinary
    const uploadResults = await uploadService.uploadMultipleImages(files, 'property-photos', {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 80,
    });

    // Get current max display order
    const existingPhotos = await prisma.propertyPhoto.findMany({
      where: { property_id },
      select: { display_order: true },
      orderBy: { display_order: 'desc' },
      take: 1,
    });

    const startOrder = existingPhotos.length > 0 && existingPhotos[0] ? existingPhotos[0].display_order + 1 : 0;

    // Create photo records in database
    const photoRecords = await Promise.all(
      uploadResults.map((result, index) =>
        prisma.propertyPhoto.create({
          data: {
            property_id,
            photo_url: result.url,
            display_order: startOrder + index,
          },
        })
      )
    );

    res.status(200).json({
      message: `${photoRecords.length} photo(s) uploaded successfully`,
      data: photoRecords,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload/verification-document
 * Upload verification document (ID, student ID)
 */
export const uploadVerificationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    getAuthUserId(req); // Verify authentication
    const file = (req as MulterRequest).file;
    const { document_type } = req.body; // 'government_id' or 'student_id'

    if (!file) {
      throw new BadRequestError('No file uploaded');
    }

    if (!document_type || !['government_id', 'student_id'].includes(document_type)) {
      throw new BadRequestError('Invalid document type');
    }

    // Upload to Cloudinary
    const uploadResult = await uploadService.uploadDocument(file, `verification/${document_type}`);

    res.status(200).json({
      message: 'Document uploaded successfully',
      data: {
        url: uploadResult.url,
        document_type,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/upload/property-photo/:id
 * Delete property photo
 */
export const deletePropertyPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params;

    // Get photo and verify ownership
    const photo = await prisma.propertyPhoto.findUnique({
      where: { id },
      include: {
        property: {
          select: { host_id: true },
        },
      },
    });

    if (!photo) {
      throw new BadRequestError('Photo not found');
    }

    if (photo.property.host_id !== userId) {
      throw new BadRequestError('You can only delete photos from your own properties');
    }

    // Extract public ID from Cloudinary URL
    // URL format: https://res.cloudinary.com/.../nestquarter/property-photos/xyz.jpg
    const urlParts = photo.photo_url.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remove extension

    // Delete from Cloudinary
    await uploadService.deleteImage(publicId);

    // Delete from database
    await prisma.propertyPhoto.delete({
      where: { id },
    });

    res.status(200).json({
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
