import { useCallback, useEffect, useRef } from 'react';
import { Vibration, Linking } from 'react-native';
import { useSafetyStore } from '../stores';
import * as Haptics from 'expo-haptics';

export function useSOS() {
  const {
    sosActive, sosCountdown, emergencyContacts,
    activateSOS, cancelSOS, resetCountdown,
  } = useSafetyStore();

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (sosActive) {
      Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
      return () => Vibration.cancel();
    }
  }, [sosActive]);

  const triggerSOS = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Try to get location
    let lat = -27.5;
    let lng = -66.9;

    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      }
    } catch {
      // Use cached/default location
    }

    activateSOS(lat, lng);
  }, [activateSOS]);

  const cancelSOSAction = useCallback(() => {
    Vibration.cancel();
    cancelSOS();
  }, [cancelSOS]);

  const callEmergency = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const callContact = useCallback((contactId: string) => {
    const contact = emergencyContacts.find((c) => c.id === contactId);
    if (contact) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  }, [emergencyContacts]);

  return {
    sosActive,
    sosCountdown,
    emergencyContacts,
    triggerSOS,
    cancelSOS: cancelSOSAction,
    callEmergency,
    callContact,
    resetCountdown,
  };
}
