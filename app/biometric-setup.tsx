import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { haptics } from '../src/utils/haptics';
import { Svg, Path } from 'react-native-svg';

export default function BiometricSetupScreen() {
  const [supported, setSupported] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      setSupported(has);
      setChecking(false);
    });
  }, []);

  const handleActivate = async () => {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert(
        'Sin biometria registrada',
        'No hay huellas digitales ni Face ID configurados en este dispositivo. Configuralos en los ajustes del sistema.'
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirma tu identidad para activar la biometria',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar contrasena',
      disableDeviceFallback: false,
    });

    if (result.success) {
      haptics.success();
      Alert.alert(
        'Biometria activada',
        'Ahora podes ingresar con tu huella o rostro.',
        [{ text: 'Listo', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert('No se pudo verificar', 'La autenticacion biometrica fallo. Intenta de nuevo.');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 10a2 2 0 012 2c0 1.02-.76 1.85-1.75 1.97"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <Path
              d="M7 12a5 5 0 019.33-2.5"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <Path
              d="M4.26 10.15A8 8 0 0120 12"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <Path
              d="M12 16a4 4 0 01-4-4"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <Path
              d="M17.6 13.4A7 7 0 0112 19"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* Title */}
        <Text variant="h1" color={colors.textPrimary} align="center" style={styles.title}>
          Acceso Biometrico
        </Text>

        {/* Description */}
        <Text variant="body" color={colors.textSecondary} align="center" style={styles.description}>
          Ingresa mas rapido con tu huella o rostro. Sin contrasena, sin demoras.
        </Text>

        {/* Benefits */}
        <View style={styles.benefits}>
          <BenefitRow icon="shield" text="Mas seguro que una contrasena" />
          <BenefitRow icon="zap" text="Acceso instantaneo a tu cuenta" />
          <BenefitRow icon="lock" text="Tus datos protegidos en todo momento" />
        </View>

        {/* Unsupported notice */}
        {!checking && !supported && (
          <View style={styles.unsupportedNotice}>
            <Text variant="caption" color={colors.amber} align="center">
              Tu dispositivo no soporta autenticacion biometrica.
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Activar Biometria"
          onPress={handleActivate}
          variant="primary"
          size="lg"
          disabled={!supported || checking}
        />
        <Button
          title="Ahora no"
          onPress={handleSkip}
          variant="ghost"
          size="lg"
        />
      </View>
    </View>
  );
}

function BenefitRow({ icon, text }: { icon: 'shield' | 'zap' | 'lock'; text: string }) {
  return (
    <View style={benefitStyles.row}>
      <View style={benefitStyles.iconWrapper}>
        {icon === 'shield' && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill={colors.copperMuted}
              stroke={colors.copper}
              strokeWidth={1.5}
            />
          </Svg>
        )}
        {icon === 'zap' && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
        {icon === 'lock' && (
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5 11V7a7 7 0 0114 0v4"
              stroke={colors.copper}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <Path
              d="M3 11h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11z"
              stroke={colors.copper}
              strokeWidth={1.5}
            />
          </Svg>
        )}
      </View>
      <Text variant="bodySm" color={colors.textSecondary} style={benefitStyles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['4xl'],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.lg,
  },
  benefits: {
    width: '100%',
    gap: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  unsupportedNotice: {
    backgroundColor: `${colors.amber}15`,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: `${colors.amber}40`,
    padding: spacing.lg,
    width: '100%',
  },
  actions: {
    gap: spacing.md,
  },
});

const benefitStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.lg,
    minHeight: layout.touchTarget,
    },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
