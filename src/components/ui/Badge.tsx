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
  solid?: boolean;
}

const variantTokens: Record<BadgeVariant, { muted: string; solid: string; text: string }> = {
  copper: { muted: colors.copperMuted, solid: colors.copper, text: colors.copper },
  cyan: { muted: colors.cyanMuted, solid: colors.cyan, text: colors.cyan },
  emerald: { muted: colors.emeraldMuted, solid: colors.emerald, text: colors.emerald },
  red: { muted: colors.redMuted, solid: colors.red, text: colors.red },
  amber: { muted: colors.amberMuted, solid: colors.amber, text: colors.amber },
  purple: { muted: colors.purpleMuted, solid: colors.purple, text: colors.purple },
  default: { muted: colors.surfaceHigh, solid: colors.surfaceHighest, text: colors.textSecondary },
};

export function Badge({ label, variant = 'default', icon, style, solid = false }: BadgeProps) {
  const tokens = variantTokens[variant];
  const bg = solid ? tokens.solid : tokens.muted;
  const textColor = solid ? colors.background : tokens.text;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant="labelSm" color={textColor}>
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
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
