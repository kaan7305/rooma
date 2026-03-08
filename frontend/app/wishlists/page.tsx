'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import WishlistCollections from '@/components/WishlistCollections';

export default function WishlistsPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please log in to view your wishlists');
      router.push('/auth/login');
    }
  }, [isAuthenticated, router, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <WishlistCollections />
      </main>
    </div>
  );
}
