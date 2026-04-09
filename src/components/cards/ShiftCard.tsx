import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Badge, StatusDot } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Shift } from '../../types';

interface ShiftCardProps {
  shift: Shift;
  isActive?: boolean;
  onPress?: () => void;
}

const shiftColors: Record<string, string> = {
  manana: colors.amber,
  tarde: colors.copper,
  noche: colors.purple,
};

const shiftLabels: Record<string, string> = {
  manana: 'Manana',
  tarde: 'Tarde',
  noche: 'Noche',
};

export function ShiftCard({ shift, isActive = false, onPress }: ShiftCardProps) {
  const accentColor = shiftColors[shift.type] ?? colors.copper;

  return (
    <Card variant="status" accentColor={accentColor} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {isActive && <StatusDot status="online" size={8} />}
          <Text variant="h3" color={colors.textPrimary}>
            Turno {shiftLabels[shift.type]}
          </Text>
        </View>
        <Badge label={`Dia ${shift.dayOfRotation}/${shift.totalDays}`} variant="default" />
      </View>
      <View style={styles.details}>
        <Text variant="moneySm" color={accentColor}>
          {shift.startTime} — {shift.endTime}
        </Text>
        <Text variant="caption" color={colors.textSecondary}>
          {shift.sector} · {shift.level}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  details: {
    gap: 2,
  },
});
