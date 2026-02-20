'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import { validatePropertyImage } from '@/lib/image-validator';
import { CheckCircle, XCircle, Clock, Upload, FileText, GraduationCap, AlertCircle } from 'lucide-react';

export default function StudentVerificationPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Form data
  const [universityName, setUniversityName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [studentIdDocument, setStudentIdDocument] = useState('');
  const [enrollmentLetter, setEnrollmentLetter] = useState('');

  // File previews
  const [studentIdPreview, setStudentIdPreview] = useState('');
  const [enrollmentLetterPreview, setEnrollmentLetterPreview] = useState('');

  // SheerID state
  const [sheerIdLoading, setSheerIdLoading] = useState(false);
  const [sheerIdError, setSheerIdError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // User verification data will be loaded from separate verification API
    // if needed in the future
  }, [isAuthenticated, router, user]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const base64ToImageElement = (base64: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = base64;
    });
  };

  const handleStudentIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid document file (JPG, PNG, WebP, or PDF)');
      return;
    }

    // Validate file size (10MB for documents)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const base64 = await convertToBase64(file);
    setStudentIdDocument(base64);
    setStudentIdPreview(base64);
  };

  const handleEnrollmentLetterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid document file (JPG, PNG, WebP, or PDF)');
      return;
    }

    // Validate file size (10MB for documents)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const base64 = await convertToBase64(file);
    setEnrollmentLetter(base64);
    setEnrollmentLetterPreview(base64);
  };

  const handleSheerIdVerification = async () => {
    setSheerIdLoading(true);
    setSheerIdError('');

    try {
      // TODO: Replace with actual SheerID API integration
      // This is a placeholder structure for SheerID integration
      const sheerIdResponse = await fetch('/api/sheerid/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          universityName,
          organization: universityName,
        }),
      });

      if (!sheerIdResponse.ok) {
        throw new Error('SheerID verification failed. Please use manual verification.');
      }

      const sheerIdData = await sheerIdResponse.json();

      // Update user with SheerID verification
      updateUser({
        studentVerified: true,
      });

      toast.success('Student status verified instantly via SheerID!');
      router.push('/');
    } catch (error: any) {
      console.error('SheerID error:', error);
      setSheerIdError(error.message || 'SheerID verification unavailable. Please use manual verification below.');
    } finally {
      setSheerIdLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!universityName || !studentIdNumber || !graduationYear || !major) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (!studentIdDocument || !enrollmentLetter) {
      toast.warning('Please upload both Student ID and Enrollment Letter');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit verification data to API instead of localStorage
      // This data should be sent to a dedicated verification API endpoint
      const verificationData = {
        universityName,
        studentIdNumber,
        graduationYear,
        major,
        studentIdDocument,
        enrollmentLetter,
      };

      console.log('Verification data would be submitted to API:', verificationData);

      toast.success('Verification documents submitted successfully! Your student status is now under review. You will receive a notification once verified.');
      router.push('/');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show status if already verified
  if (user.studentVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Status Verified</h1>
              <p className="text-gray-600 mb-6">Your student verification has been approved!</p>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-6">
                <p className="text-gray-700">
                  Your student status has been verified. You now have access to all student-exclusive features!
                </p>
              </div>

              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending and rejected status views removed - not implemented in current auth system

  // Main verification form
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <GraduationCap className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Student Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Verify your student status to access ROOMA
          </p>
        </div>

        {/* SheerID Instant Verification */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Option 1: Instant Verification (Recommended)</h2>
              <p className="text-gray-600 mb-4">
                Get verified instantly using SheerID - the fastest way to confirm your student status.
              </p>

              {sheerIdError && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{sheerIdError}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSheerIdVerification}
                disabled={sheerIdLoading || !universityName}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sheerIdLoading ? 'Verifying with SheerID...' : 'Verify Instantly with SheerID'}
              </button>

              {!universityName && (
                <p className="text-xs text-gray-500 mt-2">
                  Please enter your university name below first
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Manual Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <FileText className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Option 2: Manual Verification</h2>
              <p className="text-gray-600">
                Upload your student documents for manual review (24-48 hour processing)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* University Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  University Name *
                </label>
                <input
                  type="text"
                  id="university"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., Stanford University"
                  required
                />
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Number *
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., 20230001"
                  required
                />
              </div>

              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation Year *
                </label>
                <select
                  id="graduationYear"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900"
                  required
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                  Major/Program *
                </label>
                <input
                  type="text"
                  id="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition text-gray-900 placeholder:text-gray-500"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student ID Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Card *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition">
                  {studentIdPreview ? (
                    <div className="space-y-3">
                      <img src={studentIdPreview} alt="Student ID" className="max-h-40 mx-auto rounded" />
                      <p className="text-sm text-emerald-600 font-medium">✅ Uploaded</p>
                      <button
                        type="button"
                        onClick={() => {
                          setStudentIdDocument('');
                          setStudentIdPreview('');
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Upload Student ID</p>
                      <p className="text-xs text-gray-500">JPG, PNG, or PDF (max 10MB)</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleStudentIdUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Enrollment Letter Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Letter *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-500 transition">
                  {enrollmentLetterPreview ? (
                    <div className="space-y-3">
                      <img src={enrollmentLetterPreview} alt="Enrollment Letter" className="max-h-40 mx-auto rounded" />
                      <p className="text-sm text-emerald-600 font-medium">✅ Uploaded</p>
                      <button
                        type="button"
                        onClick={() => {
                          setEnrollmentLetter('');
                          setEnrollmentLetterPreview('');
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Upload Enrollment Letter</p>
                      <p className="text-xs text-gray-500">JPG, PNG, or PDF (max 10MB)</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleEnrollmentLetterUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Required Documents:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Valid student ID card showing your name and university</li>
                    <li>Official enrollment letter or transcript from current semester</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    Documents will be reviewed by our admin team within 24-48 hours. All information is kept confidential.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !studentIdDocument || !enrollmentLetter}
              className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting Verification...' : 'Submit for Manual Review'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
