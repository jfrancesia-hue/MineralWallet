import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type StatusType = 'online' | 'warning' | 'critical' | 'processing' | 'rest';

const statusColors: Record<StatusType, string> = {
  online: colors.emerald,
  warning: colors.amber,
  critical: colors.red,
  processing: colors.cyan,
  rest: colors.purple,
};

interface StatusDotProps {
  status: StatusType;
  size?: number;
  pulse?: boolean;
}

export function StatusDot({ status, size = 8, pulse = true }: StatusDotProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const color = statusColors[status];

  useEffect(() => {
    if (!pulse) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, pulseAnim]);

  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }]}>
      {pulse && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              width: size * 2.5,
              height: size * 2.5,
              borderRadius: size * 1.25,
              backgroundColor: color,
              opacity: 0.3,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
  },
  dot: {},
});
