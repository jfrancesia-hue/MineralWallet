import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

// Obsidian Foundry OreGauge
// Progress bar con feel "instrumento minero" - tonal surfaceHigh track +
// fill con gradient, inner glow, markers de tick opcionales.

interface OreGaugeProps {
  value: number; // 0-100
  label?: string;
  rightLabel?: string;
  color?: 'copper' | 'cyan' | 'emerald' | 'amber' | 'red';
  height?: number;
  showTicks?: boolean;
  style?: ViewStyle;
}

const colorMap = {
  copper: colors.copperGradient,
  cyan: colors.cyanGradient,
  emerald: colors.emeraldGradient,
  amber: ['#FFB020', '#D68810'] as const,
  red: colors.redGradient,
};

export function OreGauge({
  value,
  label,
  rightLabel,
  color = 'copper',
  height = 8,
  showTicks = false,
  style,
}: OreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const gradient = colorMap[color];

  return (
    <View style={[styles.container, style]}>
      {(label || rightLabel) && (
        <View style={styles.labelRow}>
          {label && <Text variant="labelSm" color={colors.textMuted}>{label}</Text>}
          {rightLabel && <Text variant="labelSm" color={colors[color] ?? colors.copper}>{rightLabel}</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        {showTicks && (
          <View style={styles.ticksLayer} pointerEvents="none">
            {[25, 50, 75].map((t) => (
              <View key={t} style={[styles.tick, { left: `${t}%` }]} />
            ))}
          </View>
        )}
        <LinearGradient
          colors={gradient as unknown as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${clamped}%`,
            height,
            borderRadius: height / 2,
          }}
        />
        {/* Inner glow subtle */}
        <View
          style={[
            styles.glow,
            {
              width: `${clamped}%`,
              height: height,
              borderRadius: height / 2,
              shadowColor: colors[color] ?? colors.copper,
            },
          ]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
    position: 'relative',
  },
  ticksLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.surfaceHighest,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});
