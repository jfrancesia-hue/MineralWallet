import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

// Obsidian Foundry Button
// Primary: copper gradient, 4px corners, industrial stamp feel.
// Secondary: surfaceContainer (NO border), text copper.
// Danger: solid red.
// Ghost: transparent, text copper, underline on press.

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<ButtonSize, { height: number; paddingHorizontal: number }> = {
  sm: { height: 44, paddingHorizontal: spacing.lg },
  md: { height: layout.touchTarget, paddingHorizontal: spacing['2xl'] },
  lg: { height: 56, paddingHorizontal: spacing['3xl'] },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const sizeStyle = sizeMap[size];

  const getTextColor = () => {
    if (variant === 'primary') return colors.background;
    if (variant === 'danger') return colors.textPrimary;
    return colors.copper;
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.background : colors.copper} />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            variant={size === 'sm' ? 'buttonSm' : 'button'}
            color={getTextColor()}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.88}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={colors.copperGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.8 }}
          style={[
            styles.base,
            { height: sizeStyle.height, paddingHorizontal: sizeStyle.paddingHorizontal },
            isDisabled && styles.disabled,
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.borderRadius.sm, // 4px industrial default
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.touchTarget,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  secondary: {
    backgroundColor: colors.surfaceContainer,
  },
  danger: {
    backgroundColor: colors.red,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  disabled: {
    opacity: 0.38,
  },
  fullWidth: {
    width: '100%',
  },
});
