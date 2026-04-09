import { useCallback, useEffect } from 'react';
import { Vibration, Linking } from 'react-native';
import { useSafetyStore } from '../stores';
import * as Haptics from 'expo-haptics';

let locationStorage: { getNumber: (k: string) => number | undefined; set: (k: string, v: number) => void } | null = null;

function getLocationStorage() {
  if (!locationStorage) {
    try {
      const { MMKV } = require('react-native-mmkv');
      locationStorage = new MMKV({ id: 'mineral-location' });
    } catch {
      const mem = new Map<string, number>();
      locationStorage = {
        getNumber: (k: string) => mem.get(k),
        set: (k: string, v: number) => { mem.set(k, v); },
      };
    }
  }
  return locationStorage!;
}

const CACHE_KEY_LAT = 'last_lat';
const CACHE_KEY_LNG = 'last_lng';

const DEFAULT_LAT = -27.5;
const DEFAULT_LNG = -66.9;

export function getLastKnownLocation(): { lat: number; lng: number } | null {
  const s = getLocationStorage();
  const lat = s.getNumber(CACHE_KEY_LAT);
  const lng = s.getNumber(CACHE_KEY_LNG);
  if (lat !== undefined && lng !== undefined) {
    return { lat, lng };
  }
  return null;
}

function cacheLocation(lat: number, lng: number): void {
  const s = getLocationStorage();
  s.set(CACHE_KEY_LAT, lat);
  s.set(CACHE_KEY_LNG, lng);
}

async function getGpsLocation(timeoutMs: number): Promise<{ lat: number; lng: number } | null> {
  const Location = await import('expo-location');
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  return new Promise((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, timeoutMs);

    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      .then((location) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(null);
        }
      });
  });
}

export function useSOS() {
  const {
    sosActive, sosCountdown, emergencyContacts,
    activateSOS, cancelSOS, resetCountdown,
  } = useSafetyStore();

  useEffect(() => {
    if (sosActive) {
      Vibration.vibrate([0, 500, 200, 500, 200, 500], true);
      return () => Vibration.cancel();
    }
  }, [sosActive]);

  const triggerSOS = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    let lat: number;
    let lng: number;

    // 1. Try GPS with 3 second timeout
    try {
      const gps = await getGpsLocation(3000);
      if (gps) {
        lat = gps.lat;
        lng = gps.lng;
        cacheLocation(lat, lng);
      } else {
        throw new Error('GPS timeout');
      }
    } catch {
      // 2. Fall back to cached location
      const cached = getLastKnownLocation();
      if (cached) {
        lat = cached.lat;
        lng = cached.lng;
      } else {
        // 3. Fall back to hardcoded coords (Catamarca, Argentina)
        lat = DEFAULT_LAT;
        lng = DEFAULT_LNG;
      }
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
    getLastKnownLocation,
  };
}
