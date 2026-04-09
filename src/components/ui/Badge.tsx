import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';

type BadgeVariant = 'copper' | 'cyan' | 'emerald' | 'red' | 'amber' | 'purple' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  copper: { bg: 'rgba(200, 117, 51, 0.15)', text: colors.copper },
  cyan: { bg: colors.cyanMuted, text: colors.cyan },
  emerald: { bg: colors.emeraldMuted, text: colors.emerald },
  red: { bg: colors.redMuted, text: colors.red },
  amber: { bg: colors.amberMuted, text: colors.amber },
  purple: { bg: colors.purpleMuted, text: colors.purple },
  default: { bg: 'rgba(255,255,255,0.06)', text: colors.textSecondary },
};

export function Badge({ label, variant = 'default', icon, style }: BadgeProps) {
  const { bg, text } = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant="caption" color={text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
