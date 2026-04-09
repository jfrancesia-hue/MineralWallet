import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mmkvStorage } from './middleware/mmkvPersist';

export type NotifCategory = 'plata' | 'turnos' | 'seguridad' | 'salud' | 'beneficios';

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotifCategory;
  timestamp: number;
  read: boolean;
  actionRoute?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'read'>) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: 'n-1', title: 'Adelanto acreditado', description: '$150.000 disponibles en tu cuenta',
          category: 'plata', timestamp: Date.now() - 3600000, read: false, actionRoute: '/plata',
        },
        {
          id: 'n-2', title: 'Recordatorio turno', description: 'Manana inicia tu descanso (7 dias)',
          category: 'turnos', timestamp: Date.now() - 10800000, read: false, actionRoute: '/turnos',
        },
        {
          id: 'n-3', title: 'Renovar proteccion auditiva', description: 'Vence el 20/04 — solicitar reposicion',
          category: 'seguridad', timestamp: Date.now() - 18000000, read: false, actionRoute: '/seguridad',
        },
        {
          id: 'n-4', title: 'Nuevo curso disponible', description: 'Operacion de Grua Puente (+500 XP)',
          category: 'turnos', timestamp: Date.now() - 28800000, read: true, actionRoute: '/carrera',
        },
        {
          id: 'n-5', title: 'Examen periodico 15/05', description: 'Preparacion necesaria — revisar checklist',
          category: 'salud', timestamp: Date.now() - 86400000, read: true, actionRoute: '/salud',
        },
        {
          id: 'n-6', title: 'Hidratate bien', description: 'Llevas 5 dias consecutivos en turno',
          category: 'salud', timestamp: Date.now() - 86400000, read: true,
        },
        {
          id: 'n-7', title: '25% dto Indumentaria', description: 'Nuevo descuento en Indumentaria Minera SRL',
          category: 'beneficios', timestamp: Date.now() - 259200000, read: true, actionRoute: '/beneficios',
        },
      ],
      unreadCount: 3,

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) => n.id === id ? { ...n, read: true } : n);
          return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      addNotification: (notif) =>
        set((state) => ({
          notifications: [{ ...notif, id: `n-${Date.now()}`, read: false }, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: 'mineral-notifications', storage: mmkvStorage }
  )
);
