import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

type CardVariant = 'default' | 'financial' | 'alert' | 'status';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'default',
  accentColor,
  onPress,
  style,
}: CardProps) {
  const cardStyle = [
    styles.base,
    variant === 'financial' && styles.financial,
    variant === 'alert' && styles.alert,
    variant === 'status' && accentColor
      ? [styles.status, { borderLeftColor: accentColor }]
      : null,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    padding: spacing.lg,
  },
  financial: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    borderTopWidth: 2,
    borderTopColor: colors.copper,
    padding: spacing.lg,
  },
  alert: {
    backgroundColor: colors.redMuted,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 74, 0.2)',
    padding: spacing.lg,
  },
  status: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    borderLeftWidth: 3,
    padding: spacing.lg,
  },
});
