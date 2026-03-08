'use client';

import { Calendar, Heart, Eye, MessageCircle, Home, Clock } from 'lucide-react';
import { useBookingsStore } from '@/lib/bookings-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store';
import { type Property } from '@/data/properties';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'booking' | 'favorite' | 'view' | 'message';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export default function ActivityTimeline() {
  const { bookings, loadBookings } = useBookingsStore();
  const { favorites, loadFavorites } = useFavoritesStore();
  const { recentlyViewed } = useRecentlyViewedStore();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadBookings();
    loadFavorites();
  }, [loadBookings, loadFavorites]);

  useEffect(() => {
    // Combine all activities
    const allActivities: Activity[] = [];

    // Add booking activities
    bookings.slice(0, 5).forEach((booking) => {
      allActivities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: 'Booking Created',
        description: `Booked ${booking.property.title}`,
        timestamp: booking.createdAt,
        link: `/bookings`,
      });
    });

    // Add favorite activities (simulate with current data)
    favorites.slice(0, 3).forEach((favId, index) => {
      allActivities.push({
        id: `favorite-${favId}`,
        type: 'favorite',
        title: 'Added to Favorites',
        description: `Saved a property to favorites`,
        timestamp: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
        link: `/favorites`,
      });
    });

    // Add recently viewed activities
    recentlyViewed.slice(0, 3).forEach((property: Property, index: number) => {
      allActivities.push({
        id: `view-${property.id}`,
        type: 'view',
        title: 'Viewed Property',
        description: property.title,
        timestamp: new Date(Date.now() - index * 30 * 60 * 1000).toISOString(),
        link: `/properties/${property.id}`,
      });
    });

    // Sort by timestamp (most recent first)
    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivities(allActivities.slice(0, 10));
  }, [bookings, favorites, recentlyViewed]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'booking':
        return { icon: Calendar, color: 'bg-blue-100 text-blue-600' };
      case 'favorite':
        return { icon: Heart, color: 'bg-rose-100 text-rose-600' };
      case 'view':
        return { icon: Eye, color: 'bg-purple-100 text-purple-600' };
      case 'message':
        return { icon: MessageCircle, color: 'bg-emerald-100 text-emerald-600' };
      default:
        return { icon: Home, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600 text-sm">Your activity will appear here</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
          <p className="text-gray-500 text-sm mt-2">Start exploring properties to see your activity here</p>
          <Link
            href="/search"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-gray-600 text-sm">Your latest actions and updates</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { icon: Icon, color } = getActivityIcon(activity.type);
          const content = (
            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < activities.length - 1 && (
                  <div className="flex-1 w-px bg-gray-200 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );

          if (activity.link) {
            return (
              <Link key={activity.id} href={activity.link} className="block">
                {content}
              </Link>
            );
          }

          return <div key={activity.id}>{content}</div>;
        })}
      </div>
    </div>
  );
}
