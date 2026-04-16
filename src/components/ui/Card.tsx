import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

// Obsidian Foundry Card
// Profundidad via surface tiers (NO bordes solidos).
// Variants: default (surfaceLow), elevated (surfaceContainer), hero (gradient + copper hairline),
// alert (red tint), status (accent bar).

type CardVariant = 'default' | 'elevated' | 'hero' | 'financial' | 'alert' | 'status';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  glow?: boolean;
}

export function Card({
  children,
  variant = 'default',
  accentColor,
  onPress,
  style,
  glow = false,
}: CardProps) {
  const isPressable = !!onPress;

  // Hero: gradiente diagonal + hairline copper superior
  if (variant === 'hero' || variant === 'financial') {
    const Wrapper: any = isPressable ? Pressable : View;
    return (
      <Wrapper
        {...(isPressable ? { onPress } : {})}
        style={({ pressed }: any) => [
          styles.base,
          styles.heroWrapper,
          style,
          pressed && styles.pressed,
        ]}
      >
        <LinearGradient
          colors={colors.surfaceDiagonal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.hairline} />
          {glow && <View style={styles.glow} />}
          <View style={styles.content}>{children}</View>
        </LinearGradient>
      </Wrapper>
    );
  }

  const cardStyle: any[] = [
    styles.base,
    variant === 'default' && styles.default,
    variant === 'elevated' && styles.elevated,
    variant === 'alert' && styles.alert,
    variant === 'status' && accentColor
      ? [styles.status, { borderLeftColor: accentColor }]
      : null,
    style,
  ];

  if (isPressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
        android_ripple={{ color: colors.copperSubtle }}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: layout.borderRadius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.surfaceLow,
  },
  elevated: {
    backgroundColor: colors.surfaceContainer,
  },
  alert: {
    backgroundColor: colors.redMuted,
  },
  status: {
    backgroundColor: colors.surfaceLow,
    borderLeftWidth: layout.accentBarWidth,
    paddingLeft: spacing.xl - layout.accentBarWidth,
  },
  heroWrapper: {
    padding: 0,
    borderRadius: layout.borderRadius.xl,
    backgroundColor: colors.surfaceLow,
  },
  heroGradient: {
    borderRadius: layout.borderRadius.xl,
    padding: spacing.xl,
    position: 'relative',
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: layout.hairlineWidth,
    backgroundColor: colors.copper,
    opacity: 0.8,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.copperGlow,
    opacity: 0.4,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
