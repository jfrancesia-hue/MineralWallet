import { api } from './apiClient';
import type { Notification } from '../types';

export const notificationsService = {
  getAll: (page = 1) =>
    api.get<Notification[]>('/notifications', { page: String(page) }),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count'),

  markAsRead: (notificationId: string) =>
    api.patch<Notification>(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    api.post<void>('/notifications/read-all'),

  registerPushToken: (token: string, platform: 'ios' | 'android') =>
    api.post<void>('/notifications/push-token', { token, platform }),
};
