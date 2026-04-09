import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

type TextVariant = keyof typeof typography;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({
  variant = 'body',
  color = colors.textPrimary,
  align = 'left',
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

export function MoneyText({
  amount,
  variant = 'balance',
  color = colors.textPrimary,
  prefix = '$',
  style,
  ...props
}: {
  amount: number | string;
  variant?: 'balance' | 'moneyLg' | 'moneyMd' | 'moneySm';
  color?: string;
  prefix?: string;
} & Omit<RNTextProps, 'children'>) {
  const formatted = typeof amount === 'number'
    ? amount.toLocaleString('es-AR')
    : amount;

  return (
    <RNText
      style={[typography[variant], { color }, style]}
      {...props}
    >
      {prefix}{formatted}
    </RNText>
  );
}

export function Label({
  children,
  color = colors.copper,
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[typography.label, { color }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}
