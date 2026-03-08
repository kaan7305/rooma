'use client';

import { TrendingUp, Heart, Eye, Calendar, DollarSign, MapPin, Star, Users } from 'lucide-react';
import { useBookingsStore } from '@/lib/bookings-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store';
import { useMessagesStore } from '@/lib/messages-store';
import { useEffect } from 'react';

export default function DashboardStats() {
  const { bookings, loadBookings } = useBookingsStore();
  const { favorites, loadFavorites } = useFavoritesStore();
  const { recentlyViewed } = useRecentlyViewedStore();
  const { conversations, loadMessages } = useMessagesStore();

  useEffect(() => {
    loadBookings();
    loadFavorites();
    loadMessages();
  }, [loadBookings, loadFavorites, loadMessages]);

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
  const totalSpent = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0);
  const upcomingBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn);
    return checkIn > new Date() && b.status === 'confirmed';
  }).length;

  const stats = [
    {
      name: 'Active Bookings',
      value: activeBookings.toString(),
      change: upcomingBookings > 0 ? `${upcomingBookings} upcoming` : 'No upcoming',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-600',
    },
    {
      name: 'Saved Favorites',
      value: favorites.length.toString(),
      change: favorites.length > 0 ? 'View all' : 'Start exploring',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'from-rose-50 to-pink-50',
      textColor: 'text-rose-600',
    },
    {
      name: 'Recently Viewed',
      value: recentlyViewed.length.toString(),
      change: recentlyViewed.length > 0 ? 'Continue browsing' : 'Start searching',
      icon: Eye,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      textColor: 'text-purple-600',
    },
    {
      name: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      change: bookings.length > 0 ? `${bookings.length} bookings` : 'No bookings yet',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className={`w-5 h-5 ${stat.textColor} opacity-50`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
              <p className={`text-3xl font-bold ${stat.textColor} mb-2`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
