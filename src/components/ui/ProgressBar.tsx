import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  gradient?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color = colors.copper,
  backgroundColor = colors.surfaceHigh,
  height = 6,
  gradient = false,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.track, { backgroundColor, height, borderRadius: height / 2 }, style]}>
      {gradient ? (
        <LinearGradient
          colors={colors.copperGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${clampedProgress}%`,
            height,
            borderRadius: height / 2,
          }}
        />
      ) : (
        <View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: `${clampedProgress}%`,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fill: {},
});
