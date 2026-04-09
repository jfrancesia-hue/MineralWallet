import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';

interface PinInputProps {
  length?: number;
  value: string;
  onChangeText: (value: string) => void;
  onComplete?: (pin: string) => void;
  label?: string;
  error?: string;
  secure?: boolean;
}

export function PinInput({
  length = 4,
  value,
  onChangeText,
  onComplete,
  label,
  error,
  secure = true,
}: PinInputProps) {
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChangeText(cleaned);
    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="labelSm" color={colors.copper} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.dotsRow}>
        {digits.map((digit, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              digit ? styles.dotFilled : null,
              i === value.length && styles.dotActive,
            ]}
          >
            {digit ? (
              <Text variant="moneyMd" color={colors.textPrimary}>
                {secure ? '\u2022' : digit}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        caretHidden
      />
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
    alignItems: 'center',
  },
  label: {
    marginBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  dot: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.copperMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    borderColor: colors.copper,
    backgroundColor: colors.elevated,
  },
  dotActive: {
    borderColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    marginTop: spacing.md,
  },
});
