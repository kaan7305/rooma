'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  Calendar,
  MessageCircle,
  Star,
  ShieldCheck,
  CheckCircle,
  Filter
} from 'lucide-react';
import { useNotificationsStore, type Notification as StoreNotification } from '@/lib/notifications-store';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';

interface NotificationDisplay extends StoreNotification {
  icon: typeof Bell;
  color: string;
  actionLabel?: string;
}

export default function NotificationCenter() {
  const toast = useToast();
  const { user } = useAuthStore();
  const { notifications: storeNotifications, loadNotifications, markAsRead, markAllAsRead } = useNotificationsStore();
  const [notifications, setNotifications] = useState<NotificationDisplay[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (user) {
      const userNotifs = storeNotifications
        .filter(n => n.userId === user.id)
        .map(n => ({
          ...n,
          icon: getIcon(n.type),
          color: getColor(n.type),
          actionLabel: getActionLabel(n.type),
        }));
      setNotifications(userNotifs);
    }
  }, [storeNotifications, user]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'message':
        return MessageCircle;
      case 'review':
        return Star;
      case 'verification':
        return ShieldCheck;
      default:
        return Bell;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-blue-600';
      case 'message':
        return 'text-emerald-600';
      case 'review':
        return 'text-yellow-600';
      case 'verification':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'booking':
        return 'View Booking';
      case 'message':
        return 'Reply';
      case 'review':
        return 'Write Review';
      case 'verification':
        return 'Verify Now';
      default:
        return 'View';
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
      toast.success('All notifications marked as read');
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
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center relative">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all read
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={() => { setFilter('all'); setShowDropdown(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm first:rounded-t-xl ${filter === 'all' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    All Notifications
                  </button>
                  <button
                    onClick={() => { setFilter('unread'); setShowDropdown(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm last:rounded-b-xl ${filter === 'unread' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    Unread Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {filter === 'unread' ? 'All caught up!' : 'You\'ll see notifications here when you have activity'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;

            const content = (
              <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 shadow-md'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${notification.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(notification.timestamp)}
                      </span>

                      <div className="flex items-center gap-2">
                        {notification.actionLabel && notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                          >
                            {notification.actionLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="w-8 h-8 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg flex items-center justify-center transition"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );

            if (notification.actionUrl) {
              return (
                <Link key={notification.id} href={notification.actionUrl} className="block">
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })
        )}
      </div>
    </div>
  );
}
