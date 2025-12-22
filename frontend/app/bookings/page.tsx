'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBookingsStore } from '@/lib/bookings-store';
import { useAuthStore } from '@/lib/auth-store';
import { Calendar, MapPin, Users, Check, X } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();
  const { bookings, loadBookings, cancelBooking } = useBookingsStore();
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
    alert('Booking cancelled successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <Link
            href="/search"
            className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Browse Properties
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and book your perfect student home!
            </p>
            <Link
              href="/search"
              className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className="text-xl font-semibold text-gray-900 hover:text-rose-600 transition"
                      >
                        {booking.property.title}
                      </Link>
                      <p className="text-gray-600 mt-2 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.property.location}
                      </p>

                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-rose-600" />
                            <span className="text-sm font-medium text-gray-500">Check-in</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkIn).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-rose-600" />
                            <span className="text-sm font-medium text-gray-500">Check-out</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.checkOut).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-rose-600" />
                            <span className="text-sm font-medium text-gray-500">Guests</span>
                          </div>
                          <p className="font-semibold text-gray-900">{booking.guests}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500 block mb-2">Total Price</span>
                          <p className="font-bold text-gray-900 text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            ${booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 ml-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status === 'confirmed' && <Check className="w-4 h-4" />}
                        {booking.status === 'cancelled' && <X className="w-4 h-4" />}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-all"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })} at{' '}
                    {new Date(booking.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
