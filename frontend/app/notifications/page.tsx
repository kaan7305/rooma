'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useNotificationsStore, type Notification } from '@/lib/notifications-store';
import { Bell, Check, MessageCircle, Calendar, Star, ShieldCheck } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { notifications, loadNotifications, getUserNotifications, markAsRead, markAllAsRead } = useNotificationsStore();

  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to view notifications');
      router.push('/auth/login');
      return;
    }
    loadNotifications();
  }, [isAuthenticated, router, loadNotifications]);

  useEffect(() => {
    if (user) {
      const notifs = getUserNotifications(user.id);
      setUserNotifications(notifs);
    }
  }, [user, notifications, getUserNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-6 h-6 text-rose-600" />;
      case 'message':
        return <MessageCircle className="w-6 h-6 text-blue-600" />;
      case 'review':
        return <Star className="w-6 h-6 text-yellow-600" />;
      case 'verification':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
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

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Notifications
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-semibold text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {userNotifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600 mb-6">We'll notify you about bookings, messages, and more</p>
            <Link
              href="/search"
              className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden divide-y divide-gray-200">
            {userNotifications.map((notification) => {
              const NotificationContent = (
                <div
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-rose-50/50' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.read ? 'bg-gradient-to-br from-rose-100 to-pink-100' : 'bg-gray-100'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      {!notification.read && (
                        <span className="inline-block mt-2 w-2 h-2 bg-rose-600 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              );

              return notification.actionUrl ? (
                <Link key={notification.id} href={notification.actionUrl}>
                  {NotificationContent}
                </Link>
              ) : (
                <div key={notification.id}>
                  {NotificationContent}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
