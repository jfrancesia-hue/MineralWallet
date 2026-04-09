import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MoneyText, Card } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Transaction } from '../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isPositive = transaction.amount > 0;
  const absAmount = Math.abs(transaction.amount);
  const prefix = isPositive ? '+$' : '-$';
  const amountColor = isPositive ? colors.emerald : colors.textPrimary;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: isPositive ? colors.emeraldMuted : colors.copperMuted }]}>
          <Text variant="bodySm" color={isPositive ? colors.emerald : colors.copper}>
            {isPositive ? '+' : '-'}
          </Text>
        </View>
        <View style={styles.content}>
          <Text variant="bodySm" color={colors.textPrimary} numberOfLines={1}>
            {transaction.title}
          </Text>
          {transaction.description ? (
            <Text variant="caption" color={colors.textMuted} numberOfLines={1}>
              {transaction.description}
            </Text>
          ) : (
            <Text variant="caption" color={colors.textMuted}>{transaction.date}</Text>
          )}
        </View>
        <MoneyText amount={absAmount} variant="moneySm" prefix={prefix} color={amountColor} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
