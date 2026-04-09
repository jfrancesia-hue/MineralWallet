import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Topographic background pattern */}
      <View style={styles.patternOverlay} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.copper, colors.copperLight]}
          style={styles.logoGradient}
        >
          <Text variant="h1" color={colors.background} align="center">
            MW
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Brand name */}
      <Animated.View style={[styles.brandContainer, { opacity: textOpacity }]}>
        <Text variant="label" color={colors.copper} align="center" style={styles.brandName}>
          {'M I N E R A L W A L L E T'}
        </Text>
        <Text variant="bodyLg" color={colors.textPrimary} align="center" style={styles.tagline}>
          Todo lo que necesitas.{'\n'}Donde sea que estes.
        </Text>
        <Text variant="caption" color={colors.textMuted} align="center" style={styles.subtitle}>
          Para el trabajador minero argentino
        </Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.ctaContainer, { opacity: buttonOpacity }]}>
        <Button
          title="Empezar"
          onPress={() => router.replace('/(auth)/login')}
          variant="primary"
          size="lg"
        />
        <View style={styles.loginLink}>
          <Text variant="bodySm" color={colors.textMuted}>
            Ya sos parte de la mina?{' '}
          </Text>
          <Text
            variant="bodySm"
            color={colors.cyan}
            onPress={() => router.replace('/(auth)/login')}
          >
            Ingresar →
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  logoContainer: {
    marginBottom: spacing['3xl'],
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  brandName: {
    marginBottom: spacing.lg,
    letterSpacing: 6,
  },
  tagline: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  ctaContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: spacing.xl,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});
