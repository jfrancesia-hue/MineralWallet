import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { fontFamilies } from '../../theme/typography';
import { Svg, Path, Circle } from 'react-native-svg';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx={11} cy={11} r={8} stroke={focused ? colors.copper : colors.textMuted} strokeWidth={1.5} />
        <Path d="M21 21l-4.35-4.35" stroke={focused ? colors.copper : colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.copper}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: spacing.lg,
    minHeight: layout.touchTarget,
    gap: spacing.md,
  },
  focused: {
    borderColor: colors.copper,
  },
  input: {
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  clearBtn: {
    padding: spacing.xs,
  },
});
