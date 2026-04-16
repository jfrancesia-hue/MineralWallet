import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View, GestureResponderEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

// Obsidian Foundry SOS tab button
// Gradient rojo + doble anillo pulsante concentrico. Elevado sobre la tab bar.

interface SOSTabButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
}

export function SOSTabButton({ onPress }: SOSTabButtonProps) {
  const pulseOuter = useRef(new Animated.Value(1)).current;
  const pulseInner = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const makeLoop = (val: Animated.Value, toValue: number, duration: number, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
        ])
      );

    const outer = makeLoop(pulseOuter, 1.35, 1400);
    const inner = makeLoop(pulseInner, 1.12, 1000, 300);
    outer.start();
    inner.start();
    return () => {
      outer.stop();
      inner.stop();
    };
  }, [pulseOuter, pulseInner]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseRingOuter,
          { transform: [{ scale: pulseOuter }], opacity: pulseOuter.interpolate({ inputRange: [1, 1.35], outputRange: [0.4, 0] }) },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRingInner,
          { transform: [{ scale: pulseInner }] },
        ]}
      />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.touchable}
      >
        <LinearGradient
          colors={[colors.red, colors.redDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 20h20L12 2z"
              stroke={colors.textPrimary}
              strokeWidth={2}
              strokeLinejoin="round"
              fill="none"
            />
            <Path d="M12 9v4" stroke={colors.textPrimary} strokeWidth={2.2} strokeLinecap="round" />
            <Path d="M12 17h.01" stroke={colors.textPrimary} strokeWidth={2.4} strokeLinecap="round" />
          </Svg>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const size = layout.sosButtonSize;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    top: -22,
    width: size + 40,
    height: size + 40,
  },
  pulseRingOuter: {
    position: 'absolute',
    width: size + 24,
    height: size + 24,
    borderRadius: (size + 24) / 2,
    backgroundColor: colors.redGlow,
  },
  pulseRingInner: {
    position: 'absolute',
    width: size + 10,
    height: size + 10,
    borderRadius: (size + 10) / 2,
    backgroundColor: 'rgba(255, 85, 85, 0.35)',
  },
  touchable: {
    borderRadius: size / 2,
  },
  button: {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
});
