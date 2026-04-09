import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useConnectivityStore } from '../../stores';
import { Svg, Path } from 'react-native-svg';

export function OfflineBanner() {
  const { isOnline, isSyncing, pendingSyncCount } = useConnectivityStore();

  if (isOnline && !isSyncing) return null;

  return (
    <View style={[styles.banner, isSyncing ? styles.syncing : styles.offline]}>
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d={isOnline
            ? 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15'
            : 'M1 1l22 22M16.72 11.06c.27.37.52.75.73 1.15M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01'
          }
          stroke={colors.textPrimary}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
      <Text variant="micro" color={colors.textPrimary}>
        {isSyncing
          ? `Sincronizando ${pendingSyncCount} cambios...`
          : 'Sin conexion — datos guardados localmente'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  offline: {
    backgroundColor: colors.amberMuted,
  },
  syncing: {
    backgroundColor: colors.cyanMuted,
  },
});
