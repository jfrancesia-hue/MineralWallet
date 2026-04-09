import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useNotificationsStore, useAuthStore } from '../stores';
import { notificationsService } from '../services/notifications.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const expoPushTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let receivedSubscription: Notifications.Subscription;
    let responseSubscription: Notifications.Subscription;

    async function registerForPushNotifications() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      expoPushTokenRef.current = tokenData.data;

      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      await notificationsService.registerPushToken(tokenData.data, platform);
    }

    registerForPushNotifications();

    receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data } = notification.request.content;
      addNotification({
        title: title ?? 'Notificación',
        description: body ?? '',
        category: (data?.category as import('../types').NotifCategory) ?? 'plata',
        timestamp: Date.now(),
        actionRoute: data?.actionRoute as string | undefined,
      });
    });

    responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.actionRoute && typeof data.actionRoute === 'string') {
        router.push(data.actionRoute as never);
      }
    });

    return () => {
      receivedSubscription?.remove();
      responseSubscription?.remove();
    };
  }, [isAuthenticated, addNotification]);

  return { expoPushToken: expoPushTokenRef.current };
}
