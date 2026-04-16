import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

// Obsidian Foundry ActionCircle
// Sin bordes. Fondo tonal con glow sutil del color activo.
// La accion principal (copper) usa gradiente; las demas usan tint subtle.

interface ActionCircleProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onPress: () => void;
  size?: number;
  primary?: boolean;
}

export function ActionCircle({
  icon,
  label,
  color = colors.copper,
  onPress,
  size = layout.touchTarget,
  primary = false,
}: ActionCircleProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.container}>
      {primary ? (
        <LinearGradient
          colors={colors.copperGradient}
          style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: withAlpha(color, 0.14),
            },
          ]}
        >
          <View
            style={[
              styles.inner,
              {
                width: size * 0.72,
                height: size * 0.72,
                borderRadius: (size * 0.72) / 2,
                backgroundColor: withAlpha(color, 0.1),
              },
            ]}
          />
          <View style={styles.iconWrap}>{icon}</View>
        </View>
      )}
      <Text variant="caption" color={colors.textSecondary} align="center" style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16);
  const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16);
  const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  inner: {
    position: 'absolute',
  },
  iconWrap: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    maxWidth: 72,
  },
});
