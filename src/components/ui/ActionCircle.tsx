import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

interface ActionCircleProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onPress: () => void;
  size?: number;
}

export function ActionCircle({
  icon,
  label,
  color = colors.copper,
  onPress,
  size = layout.touchTarget,
}: ActionCircleProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `${color}20`,
            borderColor: `${color}40`,
          },
        ]}
      >
        {icon}
      </View>
      <Text variant="caption" color={colors.textSecondary} align="center" style={styles.label}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    maxWidth: 64,
  },
});
