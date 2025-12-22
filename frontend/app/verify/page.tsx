'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useNotificationsStore } from '@/lib/notifications-store';
import { ShieldCheck, Upload, Camera, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState('');
  const [selfiePreview, setSelfiePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to verify your identity');
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setIdDocument(file);
      const base64 = await convertToBase64(file);
      setIdPreview(base64);
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelfiePhoto(file);
      const base64 = await convertToBase64(file);
      setSelfiePreview(base64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !idDocument || !selfiePhoto) {
      alert('Please upload both ID document and selfie photo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user with verification data
      updateUser({
        verification_status: 'pending',
        is_verified: false,
        id_document: idPreview,
        selfie_photo: selfiePreview,
      });

      // Send notification
      addNotification({
        userId: user.id,
        type: 'verification',
        title: 'Verification Submitted',
        message: 'Your ID verification has been submitted and is under review. We\'ll notify you once it\'s approved.',
        actionUrl: '/profile',
      });

      alert('Verification submitted successfully! We\'ll review your documents and notify you within 24-48 hours.');
      router.push('/profile');
    } catch (error) {
      alert('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerificationStatusBadge = () => {
    if (!user?.verification_status || user.verification_status === 'none') {
      return null;
    }

    const statusConfig = {
      pending: {
        icon: Clock,
        text: 'Verification Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600',
      },
      verified: {
        icon: CheckCircle,
        text: 'Verified',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        iconColor: 'text-emerald-600',
      },
      rejected: {
        icon: XCircle,
        text: 'Verification Rejected',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
      },
    };

    const config = statusConfig[user.verification_status];
    const Icon = config.icon;

    return (
      <div className={`${config.bgColor} ${config.textColor} rounded-2xl p-6 mb-8`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
          <div>
            <h3 className="font-bold">{config.text}</h3>
            {user.verification_status === 'pending' && (
              <p className="text-sm mt-1">We're reviewing your documents. This usually takes 24-48 hours.</p>
            )}
            {user.verification_status === 'rejected' && (
              <p className="text-sm mt-1">Please submit new documents for review.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // If already verified, show success
  if (user.verification_status === 'verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <main className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Verified!</h1>
            <p className="text-gray-600 mb-8">Your identity has been successfully verified. You can now enjoy all the benefits of a verified user.</p>
            <button
              onClick={() => router.push('/profile')}
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Go to Profile
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-rose-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Verify Your Identity
              </h1>
            </div>
            <p className="text-gray-600">
              Get verified to build trust with hosts and guests. Verified users have higher booking acceptance rates.
            </p>
          </div>

          {getVerificationStatusBadge()}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ID Document Upload */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-rose-600" />
                Upload ID Document
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload a clear photo of your government-issued ID (Driver's License, Passport, or State ID)
              </p>

              {idPreview ? (
                <div className="relative">
                  <img
                    src={idPreview}
                    alt="ID preview"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIdDocument(null);
                      setIdPreview('');
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-rose-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdUpload}
                    className="hidden"
                    required
                  />
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Upload className="w-12 h-12 mb-3" />
                    <span className="text-sm font-medium">Click to upload ID document</span>
                    <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                  </div>
                </label>
              )}
            </div>

            {/* Selfie Upload */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-600" />
                Upload Selfie Photo
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Take a clear selfie holding your ID next to your face
              </p>

              {selfiePreview ? (
                <div className="relative">
                  <img
                    src={selfiePreview}
                    alt="Selfie preview"
                    className="w-full h-64 object-contain bg-gray-50 rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelfiePhoto(null);
                      setSelfiePreview('');
                    }}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-rose-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                    required
                  />
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Camera className="w-12 h-12 mb-3" />
                    <span className="text-sm font-medium">Click to upload selfie</span>
                    <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                  </div>
                </label>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Why we verify identities</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Build trust within the community</li>
                <li>• Protect against fraud and scams</li>
                <li>• Increase your booking acceptance rate</li>
                <li>• Your information is encrypted and secure</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!idDocument || !selfiePhoto || isSubmitting}
                className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-4 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
