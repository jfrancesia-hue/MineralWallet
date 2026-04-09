import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import type { NearbyBusiness } from '../../types';

interface BenefitCardProps {
  business: NearbyBusiness;
  onPress?: () => void;
}

export function BenefitCard({ business, onPress }: BenefitCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.discountCircle}>
          <Text variant="buttonSm" color={colors.copper}>{business.discount}</Text>
        </View>
        <View style={styles.content}>
          <Text variant="bodySm" color={colors.textPrimary} numberOfLines={1}>
            {business.name}
          </Text>
          <Text variant="caption" color={colors.textMuted}>
            {business.category} · {business.distance}
          </Text>
        </View>
        {business.hasQR && (
          <View style={styles.qrBadge}>
            <Text variant="micro" color={colors.cyan}>QR</Text>
          </View>
        )}
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
  discountCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.copperMuted,
    borderWidth: 1,
    borderColor: 'rgba(200, 117, 51, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  qrBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cyanMuted,
    borderRadius: layout.borderRadius.sm,
  },
});
