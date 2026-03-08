'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBookingsStore } from '@/lib/bookings-store';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import { BookingCardSkeleton } from '@/components/ui/Skeleton';
import BookingsManager from '@/components/BookingsManager';
import { Calendar } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const { bookings, loadBookings, cancelBooking } = useBookingsStore();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadBookings();
    setLoading(false);
  }, [loadUser, loadBookings]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleCancel = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    cancelBooking(bookingId);
    toast.success('Booking cancelled successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-teal-800 bg-clip-text text-transparent mb-2">
              My Bookings
            </h1>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            My Bookings
          </h1>
          <Link
            href="/search"
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Browse Properties
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-teal-700 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No bookings yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start exploring properties and book your perfect student home!
            </p>
            <Link
              href="/search"
              className="inline-block bg-teal-700 hover:bg-teal-800 text-white rounded-xl px-8 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <BookingsManager bookings={bookings} onCancelBooking={handleCancel} />
        )}
      </div>
    </div>
  );
}
