import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MoneyText, Card, Badge } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { PayStub } from '../../types';

interface PayStubCardProps {
  payStub: PayStub;
  onPress?: () => void;
}

export function PayStubCard({ payStub, onPress }: PayStubCardProps) {
  return (
    <Card variant="financial" onPress={onPress}>
      <View style={styles.header}>
        <Text variant="h3" color={colors.textPrimary}>{payStub.period}</Text>
        <Badge label={payStub.paidDate} variant="emerald" />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text variant="caption" color={colors.textMuted}>Haberes</Text>
          <MoneyText amount={payStub.totalHaberes} variant="moneySm" color={colors.emerald} prefix="+$" />
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color={colors.textMuted}>Descuentos</Text>
          <MoneyText amount={payStub.totalDescuentos} variant="moneySm" color={colors.red} prefix="-$" />
        </View>
      </View>

      <View style={styles.neto}>
        <Text variant="label" color={colors.copper}>Neto</Text>
        <MoneyText amount={payStub.neto} variant="moneyMd" color={colors.textPrimary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryItem: {
    gap: 2,
  },
  neto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.copperMuted,
    paddingTop: spacing.md,
  },
});
