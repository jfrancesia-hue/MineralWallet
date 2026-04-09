import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore, useNotificationsStore } from '../stores';

export function useRealtimeNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          useNotificationsStore.getState().addNotification({
            title: row.title as string,
            description: row.description as string,
            category: row.category as 'plata' | 'turnos' | 'seguridad' | 'salud' | 'beneficios',
            timestamp: new Date(row.created_at as string).getTime(),
            actionRoute: row.action_route as string | undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, userId]);
}
