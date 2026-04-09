import React from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { Text, MoneyText } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface SliderInputProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
  accentColor?: string;
}

export function SliderInput({
  value,
  min,
  max,
  step = 1000,
  onValueChange,
  label,
  formatValue,
  accentColor = colors.copper,
}: SliderInputProps) {
  const trackWidth = React.useRef(0);
  const percent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const snap = (raw: number) => {
    const clamped = Math.max(min, Math.min(max, raw));
    return Math.round(clamped / step) * step;
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        const ratio = Math.max(0, Math.min(1, gestureState.x0 / trackWidth.current));
        onValueChange(snap(min + ratio * (max - min)));
      },
      onPanResponderMove: (_, gestureState) => {
        const ratio = Math.max(0, Math.min(1, (gestureState.x0 + gestureState.dx) / trackWidth.current));
        onValueChange(snap(min + ratio * (max - min)));
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const displayValue = formatValue
    ? formatValue(value)
    : `$${value.toLocaleString('es-AR')}`;

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="labelSm" color={colors.textMuted} style={styles.label}>
          {label}
        </Text>
      )}

      <View style={styles.trackContainer} onLayout={onLayout} {...panResponder.panHandlers}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%`, backgroundColor: accentColor }]} />
          <View style={[styles.thumb, { left: `${percent}%`, borderColor: accentColor }]} />
        </View>
      </View>

      <View style={styles.labels}>
        <Text variant="micro" color={colors.textMuted}>
          ${min.toLocaleString('es-AR')}
        </Text>
        <Text variant="moneySm" color={accentColor}>{displayValue}</Text>
        <Text variant="micro" color={colors.textMuted}>
          ${max.toLocaleString('es-AR')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.md,
  },
  trackContainer: {
    paddingVertical: spacing.lg,
  },
  track: {
    height: 6,
    backgroundColor: colors.elevated,
    borderRadius: 3,
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textPrimary,
    marginLeft: -10,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
