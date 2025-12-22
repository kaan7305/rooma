import { create } from 'zustand';

export interface Notification {
  id: string;
  userId: number;
  type: 'booking' | 'message' | 'review' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationsState {
  notifications: Notification[];
  loadNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: number) => void;
  getUserNotifications: (userId: number) => Notification[];
  getUnreadCount: (userId: number) => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],

  loadNotifications: () => {
    const notificationsJson = localStorage.getItem('nestquarter_notifications');
    if (notificationsJson) {
      try {
        const notifications = JSON.parse(notificationsJson);
        set({ notifications });
      } catch (error) {
        console.error('Failed to load notifications', error);
        set({ notifications: [] });
      }
    }
  },

  addNotification: (notificationData) => {
    const { notifications } = get();
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updatedNotifications = [newNotification, ...notifications];
    set({ notifications: updatedNotifications });
    localStorage.setItem('nestquarter_notifications', JSON.stringify(updatedNotifications));
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    set({ notifications: updatedNotifications });
    localStorage.setItem('nestquarter_notifications', JSON.stringify(updatedNotifications));
  },

  markAllAsRead: (userId) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notif =>
      notif.userId === userId ? { ...notif, read: true } : notif
    );
    set({ notifications: updatedNotifications });
    localStorage.setItem('nestquarter_notifications', JSON.stringify(updatedNotifications));
  },

  getUserNotifications: (userId) => {
    const { notifications } = get();
    return notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getUnreadCount: (userId) => {
    const { notifications } = get();
    return notifications.filter(notif => notif.userId === userId && !notif.read).length;
  },
}));
