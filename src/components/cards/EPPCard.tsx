import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Badge } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import type { EPPItem } from '../../types';

interface EPPCardProps {
  item: EPPItem;
  onPress?: () => void;
}

const statusConfig: Record<string, { variant: 'emerald' | 'amber' | 'red' | 'default'; label: string }> = {
  vigente: { variant: 'emerald', label: 'Vigente' },
  por_vencer: { variant: 'amber', label: 'Por vencer' },
  vencido: { variant: 'red', label: 'Vencido' },
  no_requerido: { variant: 'default', label: 'No requerido' },
};

export function EPPCard({ item, onPress }: EPPCardProps) {
  const config = statusConfig[item.status] ?? statusConfig.no_requerido;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: config.variant === 'emerald' ? colors.emerald : config.variant === 'amber' ? colors.amber : config.variant === 'red' ? colors.red : colors.textMuted }]} />
        <View style={styles.content}>
          <Text variant="bodySm" color={colors.textPrimary}>{item.name}</Text>
          {item.expiresAt && (
            <Text variant="caption" color={colors.textMuted}>Vence: {item.expiresAt}</Text>
          )}
          {item.reviewDate && !item.expiresAt && (
            <Text variant="caption" color={colors.textMuted}>Revision: {item.reviewDate}</Text>
          )}
        </View>
        <Badge label={config.label} variant={config.variant} />
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
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
