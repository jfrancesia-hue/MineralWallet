import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

// Obsidian Foundry PrecisionChip
// Badge compacto para coordenadas, IDs, valores tecnicos. Monospace.
// Alto contraste con surfaceHigh fill + secondary (cyan) text.

interface PrecisionChipProps {
  label?: string;
  value: string;
  variant?: 'cyan' | 'copper' | 'emerald' | 'amber' | 'default';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const variantTokens = {
  cyan: { bg: colors.surfaceHighest, labelColor: colors.textMuted, valueColor: colors.cyan },
  copper: { bg: colors.surfaceHighest, labelColor: colors.textMuted, valueColor: colors.copper },
  emerald: { bg: colors.surfaceHighest, labelColor: colors.textMuted, valueColor: colors.emerald },
  amber: { bg: colors.surfaceHighest, labelColor: colors.textMuted, valueColor: colors.amber },
  default: { bg: colors.surfaceHigh, labelColor: colors.textMuted, valueColor: colors.textPrimary },
};

export function PrecisionChip({
  label,
  value,
  variant = 'default',
  icon,
  style,
}: PrecisionChipProps) {
  const tokens = variantTokens[variant];

  return (
    <View style={[styles.chip, { backgroundColor: tokens.bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      {label && (
        <Text variant="labelSm" color={tokens.labelColor}>
          {label}
        </Text>
      )}
      <Text variant="moneySm" color={tokens.valueColor} style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 2,
  },
  value: {
    fontSize: 14,
    lineHeight: 18,
  },
});
