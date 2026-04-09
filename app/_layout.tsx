import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../src/theme/colors';
import { useAuthStore } from '../src/stores';
import { useOfflineSync } from '../src/hooks/useOfflineSync';
import { usePushNotifications } from '../src/hooks/usePushNotifications';
import { useRealtimeNotifications } from '../src/hooks/useRealtimeNotifications';
import { ErrorBoundary } from '../src/components/shared/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useOfflineSync();
  usePushNotifications();
  useRealtimeNotifications();

  const [fontsLoaded] = useFonts({
    'JetBrainsMono': require('../src/assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('../src/assets/fonts/JetBrainsMono-Bold.ttf'),
    'Outfit': require('../src/assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../src/assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold': require('../src/assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Bold': require('../src/assets/fonts/Outfit-Bold.ttf'),
    'DMSans': require('../src/assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../src/assets/fonts/DMSans-Medium.ttf'),
    'DMSans-Bold': require('../src/assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      hydrate().finally(() => SplashScreen.hideAsync());
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.copper} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
