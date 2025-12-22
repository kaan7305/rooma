import cloudinary from '../config/cloudinary';
import sharp from 'sharp';
import { BadRequestError } from '../utils/errors';

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<{ url: string; publicId: string }> => {
  try {
    const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options;

    // Optimize image with Sharp
    const optimizedImageBuffer = await sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality, progressive: true })
      .toBuffer();

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `nestquarter/${folder}`,
          resource_type: 'image',
          format: 'jpg',
        },
        (error, result) => {
          if (error) {
            reject(new BadRequestError('Image upload failed'));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      uploadStream.end(optimizedImageBuffer);
    });
  } catch (error) {
    throw new BadRequestError('Invalid image file');
  }
};

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string,
  options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<Array<{ url: string; publicId: string }>> => {
  const uploadPromises = files.map((file) => uploadImage(file, folder, options));
  return Promise.all(uploadPromises);
};

/**
 * Upload document (PDF, etc.) to Cloudinary
 */
export const uploadDocument = async (
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `nestquarter/${folder}`,
        resource_type: 'raw',
        format: file.mimetype.split('/')[1],
      },
      (error, result) => {
        if (error) {
          reject(new BadRequestError('Document upload failed'));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image:', error);
    // Don't throw error - deletion failure shouldn't break the flow
  }
};

/**
 * Delete multiple images
 */
export const deleteMultipleImages = async (publicIds: string[]): Promise<void> => {
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error('Failed to delete images:', error);
  }
};
