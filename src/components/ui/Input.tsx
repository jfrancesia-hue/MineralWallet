import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export function Input({
  label,
  icon,
  rightIcon,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="labelSm" color={focused ? colors.cyan : colors.copper} style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error ? styles.error : null,
        ]}
      >
        {icon && (
          <View style={styles.icon}>
            {icon}
          </View>
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.copper}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text variant="caption" color={colors.red} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    borderRadius: layout.borderRadius.sm,
    minHeight: layout.touchTarget,
    paddingHorizontal: spacing.lg,
  },
  focused: {
    borderColor: colors.copper,
    shadowColor: colors.copper,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  error: {
    borderColor: colors.red,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});
