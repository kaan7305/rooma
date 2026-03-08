'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import { validateImageFile, compressImage } from '@/lib/upload';

interface ImageUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  folder?: string;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
}

export default function ImageUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  folder = 'uploads',
  existingImages = [],
  onRemoveExisting,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuthStore();
  const toast = useToast();

  const totalImages = existingImages.length + files.length;

  const handleFileSelect = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const newFiles: File[] = [];
      const newPreviews: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Validate
        const error = validateImageFile(file, {
          maxSizeMB: 10,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        });

        if (error) {
          toast.error(error);
          continue;
        }

        // Check max files
        if (totalImages + newFiles.length >= maxFiles) {
          toast.warning(`Maximum ${maxFiles} images allowed`);
          break;
        }

        newFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === newFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [maxFiles, totalImages, toast]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!accessToken) {
      toast.error('Please log in to upload images');
      return;
    }

    if (files.length === 0) {
      toast.warning('Please select images to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Compress images before upload
      const compressedFiles: Blob[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], 1920, 0.85);
        compressedFiles.push(compressed);
        setUploadProgress(((i + 1) / files.length) * 50); // 0-50% for compression
      }

      // Create form data
      const formData = new FormData();
      compressedFiles.forEach((blob, index) => {
        formData.append('files', blob, files[index].name);
      });
      formData.append('folder', folder);

      // Upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(100);

      // Clear files
      setFiles([]);
      setPreviews([]);

      if (data.urls && data.urls.length > 0) {
        toast.success(`Successfully uploaded ${data.urls.length} image${data.urls.length > 1 ? 's' : ''}`);
        onUploadComplete?.(data.urls);
      }

      if (data.errors && data.errors.length > 0) {
        toast.warning(`Some uploads failed: ${data.errors.join(', ')}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
      onUploadError?.(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingImages.map((url, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              {onRemoveExisting && (
                <button
                  onClick={() => onRemoveExisting(url)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {(files[index].size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {totalImages < maxFiles && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${dragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Drop images here or click to browse
              </p>
              <p className="text-sm text-gray-600">
                JPEG, PNG, WebP or GIF (max {maxFiles} files, 10MB each)
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {totalImages} / {maxFiles} images selected
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload {files.length} Image{files.length > 1 ? 's' : ''}
              </>
            )}
          </button>

          {!uploading && (
            <button
              onClick={() => {
                setFiles([]);
                setPreviews([]);
              }}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
