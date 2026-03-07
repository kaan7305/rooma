import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { uploadImage } from '@/lib/upload-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/upload - Upload images
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Limit to 10 files per request
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed per upload' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        // Validate file (client-side validation for type safety)
        if (!(file instanceof File)) {
          errors.push('Invalid file object');
          continue;
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload
        const url = await uploadImage(buffer, file.name, {
          folder,
          maxSizeMB: 10,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        });

        uploadedUrls.push(url);
      } catch (error: any) {
        errors.push(error.message || 'Upload failed');
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'All uploads failed', errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
