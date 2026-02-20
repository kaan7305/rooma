import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration (S3-compatible)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || 'rooma-images';
const PUBLIC_URL = process.env.CLOUDFLARE_PUBLIC_URL || 'https://images.rooma.com';

export interface UploadOptions {
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export async function uploadImage(
  file: Buffer | Uint8Array,
  filename: string,
  options: UploadOptions = {}
): Promise<string> {
  const { folder = 'uploads', maxSizeMB = 10 } = options;

  // Check file size
  if (file.length > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  const key = `${folder}/${timestamp}-${randomString}.${extension}`;

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: getContentType(extension || ''),
  });

  try {
    await s3Client.send(command);
    return `${PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const key = imageUrl.replace(`${PUBLIC_URL}/`, '');

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete image');
  }
}

export async function getPresignedUploadUrl(
  filename: string,
  folder: string = 'uploads',
  expiresIn: number = 3600
): Promise<{ url: string; key: string }> {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  const key = `${folder}/${timestamp}-${randomString}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: getContentType(extension || ''),
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return { url, key };
}

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

export function validateImageFile(file: File, options: UploadOptions = {}): string | null {
  const { maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } = options;

  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF).';
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeMB}MB limit.`;
  }

  return null;
}

export async function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
