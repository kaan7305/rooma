'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }

    if (!passwordRules.test(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to reset password');
      }

      setSuccess(data?.message || 'Password reset successful. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-teal-50 to-teal-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="mb-6 text-sm text-gray-600">Create a new password for your ROOMA account.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-600"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-600"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-4 py-3 font-semibold text-white transition hover:from-teal-700 hover:via-teal-700 hover:to-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="font-medium text-teal-700 hover:text-teal-800">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
