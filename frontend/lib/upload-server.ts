// Server-only upload utilities — uses Cloudinary SDK
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getContentType(extension: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };
  return types[extension.toLowerCase()] || 'application/octet-stream';
}

export async function uploadImage(
  file: Buffer | Uint8Array,
  filename: string,
  options: { folder?: string; maxSizeMB?: number; allowedTypes?: string[] } = {}
): Promise<string> {
  const { folder = 'uploads', maxSizeMB = 10 } = options;

  if (file.length > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  const base64 = Buffer.from(file).toString('base64');
  const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = getContentType(extension);
  const dataUri = `data:${mimeType};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `rooma/${folder}`,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length < 2) return;
    const pathAfterUpload = urlParts[1];
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const publicId = withoutVersion.replace(/\.[^/.]+$/, '');
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}
