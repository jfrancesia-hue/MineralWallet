import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';

interface AmountInputProps {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  currency?: string;
  max?: number;
  error?: string;
  placeholder?: string;
}

export function AmountInput({
  value,
  onChangeText,
  label,
  currency = '$',
  max,
  error,
  placeholder = '0',
}: AmountInputProps) {
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    if (max && Number(cleaned) > max) return;
    onChangeText(cleaned);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="labelSm" color={focused ? colors.cyan : colors.copper} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[styles.inputContainer, focused && styles.focused, error ? styles.error : null]}>
        <Text variant="moneyMd" color={colors.textMuted} style={styles.currency}>
          {currency}
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          selectionColor={colors.copper}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {max && (
        <Text variant="micro" color={colors.textMuted} style={styles.maxLabel}>
          Maximo: ${max.toLocaleString('es-AR')}
        </Text>
      )}
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
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 64,
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
  currency: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.monoBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  maxLabel: {
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  errorText: {
    marginTop: spacing.xs,
  },
});
