import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

// Obsidian Foundry signature - textura topografica minera
// Contour lines + radial glow al 3-5% opacity. Da "alma terrosa" al fondo.

interface TopographicBackgroundProps {
  style?: ViewStyle;
  opacity?: number;
  glowPosition?: 'top-right' | 'top-left' | 'center' | 'bottom-right';
  children?: React.ReactNode;
}

export function TopographicBackground({
  style,
  opacity = 0.05,
  glowPosition = 'top-right',
  children,
}: TopographicBackgroundProps) {
  const glowCoords = {
    'top-right': { cx: '85%', cy: '15%' },
    'top-left': { cx: '15%', cy: '15%' },
    'center': { cx: '50%', cy: '50%' },
    'bottom-right': { cx: '85%', cy: '85%' },
  }[glowPosition];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.layer} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <RadialGradient id="copperGlow" cx={glowCoords.cx} cy={glowCoords.cy} r="60%">
              <Stop offset="0%" stopColor={colors.copper} stopOpacity="0.18" />
              <Stop offset="45%" stopColor={colors.copper} stopOpacity="0.04" />
              <Stop offset="100%" stopColor={colors.copper} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Copper radial glow */}
          <Circle cx={glowCoords.cx} cy={glowCoords.cy} r="60%" fill="url(#copperGlow)" />

          {/* Contour lines (topographic feel) */}
          <Path
            d="M -50 80 Q 100 40 250 90 T 500 70"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity * 3}
          />
          <Path
            d="M -50 160 Q 120 110 280 170 T 500 145"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity * 2.5}
          />
          <Path
            d="M -50 260 Q 150 210 310 270 T 500 240"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity * 2}
          />
          <Path
            d="M -50 380 Q 180 330 340 390 T 500 360"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity * 1.5}
          />
          <Path
            d="M -50 520 Q 200 470 360 530 T 500 500"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity}
          />
          <Path
            d="M -50 680 Q 220 630 380 690 T 500 660"
            stroke={colors.copper}
            strokeWidth="0.8"
            fill="none"
            opacity={opacity * 0.8}
          />
        </Svg>
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});
