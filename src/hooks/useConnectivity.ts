import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useConnectivityStore } from '../stores';

export function useConnectivity() {
  const { isOnline, lastOnlineAt, setOnline, pendingSyncCount, isSyncing } = useConnectivityStore();

  useEffect(() => {
    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active') {
        // Check connectivity when app comes to foreground
        fetch('https://clients3.google.com/generate_204', { method: 'HEAD', signal: AbortSignal.timeout(5000) })
          .then(() => setOnline(true))
          .catch(() => setOnline(false));
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);
    return () => subscription.remove();
  }, [setOnline]);

  const timeSinceOnline = lastOnlineAt
    ? Math.round((Date.now() - lastOnlineAt) / 60000)
    : null;

  return {
    isOnline,
    isOffline: !isOnline,
    timeSinceOnline,
    pendingSyncCount,
    isSyncing,
    formattedLastSync: timeSinceOnline !== null
      ? timeSinceOnline < 1 ? 'hace un momento'
        : timeSinceOnline < 60 ? `hace ${timeSinceOnline} min`
          : `hace ${Math.round(timeSinceOnline / 60)}h`
      : 'nunca',
  };
}
