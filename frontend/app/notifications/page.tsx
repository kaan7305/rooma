'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import NotificationCenter from '@/components/NotificationCenter';

export default function NotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please log in to view notifications');
      router.push('/auth/login');
    }
  }, [isAuthenticated, router, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <NotificationCenter />
      </div>
    </div>
  );
}
