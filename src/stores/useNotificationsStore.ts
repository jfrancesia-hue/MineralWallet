import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';
import { notificationsService } from '../services/notifications.service';
import type { Notification } from '../types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationsActions {
  fetchAll: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notif: Omit<Notification, 'id' | 'read'>) => void;
  registerPushToken: (token: string, platform: 'ios' | 'android') => Promise<void>;
  clearAll: () => void;
  clearError: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchAll: async () => {
        set({ isLoading: true, error: null });
        const response = await notificationsService.getAll();
        if (response.success && response.data) {
          const notifications = response.data;
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
            isLoading: false,
          });
        } else {
          set({ isLoading: false, error: response.error?.message ?? 'Error al obtener notificaciones' });
        }
      },

      fetchUnreadCount: async () => {
        const response = await notificationsService.getUnreadCount();
        if (response.success && response.data) {
          set({ unreadCount: response.data.count });
        }
      },

      markAsRead: async (id) => {
        // Optimistic update
        set((state) => {
          const updated = state.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
          return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
        });

        const prevNotifications = get().notifications;
        const response = await notificationsService.markAsRead(id);
        if (response.success && response.data) {
          set((state) => ({
            notifications: state.notifications.map((n) => n.id === id ? response.data! : n),
          }));
        } else {
          // Roll back optimistic update
          set({
            notifications: prevNotifications,
            unreadCount: prevNotifications.filter((n) => !n.read).length,
            error: response.error?.message ?? 'Error al marcar como leida',
          });
        }
      },

      markAllAsRead: async () => {
        // Optimistic update
        const prevNotifications = get().notifications;
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));

        const response = await notificationsService.markAllAsRead();
        if (!response.success) {
          // Roll back optimistic update
          set({
            notifications: prevNotifications,
            unreadCount: prevNotifications.filter((n) => !n.read).length,
            error: response.error?.message ?? 'Error al marcar todas como leidas',
          });
        }
      },

      addNotification: (notif) =>
        set((state) => ({
          notifications: [{ ...notif, id: `n-${Date.now()}`, read: false }, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      registerPushToken: async (token, platform) => {
        const response = await notificationsService.registerPushToken(token, platform);
        if (!response.success) {
          set({ error: response.error?.message ?? 'Error al registrar token de notificaciones' });
        }
      },

      clearAll: () => set({ notifications: [], unreadCount: 0 }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mineral-notifications',
      storage: mmkvStorage,
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);
