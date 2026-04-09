import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { haptics } from '../../src/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text, Button, Input } from '../../src/components/ui';
import { useAuthStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Rect, Circle } from 'react-native-svg';

export default function LoginScreen() {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const loginBiometric = useAuthStore((s) => s.loginBiometric);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!legajo.trim() || !password.trim()) {
      Alert.alert('Datos requeridos', 'Ingresa tu legajo y contrasena.');
      return;
    }
    await login(legajo.trim(), password);
  };

  const handleBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('No disponible', 'Tu dispositivo no soporta autenticacion biometrica.');
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert('Sin configurar', 'No hay huellas o Face ID registrados en este dispositivo.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Ingresa con tu huella o rostro',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar contrasena',
      disableDeviceFallback: false,
    });

    if (result.success) {
      haptics.success();
      await loginBiometric();
    }
  };

  const handleEmergency = () => {
    router.push('/(tabs)/sos');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[colors.copper, colors.copperLight]}
            style={styles.logo}
          >
            <Text variant="h2" color={colors.background} align="center">
              MW
            </Text>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text variant="h1" color={colors.textPrimary} align="center" style={styles.title}>
          Bienvenido, minero
        </Text>
        <Text variant="body" color={colors.textMuted} align="center" style={styles.subtitle}>
          Ingresa con tu legajo o DNI
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            placeholder="Legajo o DNI"
            value={legajo}
            onChangeText={setLegajo}
            keyboardType="number-pad"
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Rect x={3} y={4} width={18} height={16} rx={2} stroke={colors.copper} strokeWidth={1.5} />
                <Circle cx={12} cy={11} r={3} stroke={colors.copper} strokeWidth={1.5} />
                <Path d="M7 17c0-2 2.5-3 5-3s5 1 5 3" stroke={colors.copper} strokeWidth={1.5} />
              </Svg>
            }
          />

          <Input
            placeholder="Contrasena"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Rect x={5} y={11} width={14} height={10} rx={2} stroke={colors.copper} strokeWidth={1.5} />
                <Path d="M8 11V7a4 4 0 018 0v4" stroke={colors.copper} strokeWidth={1.5} />
              </Svg>
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={showPassword
                      ? 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'
                      : 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24'
                    }
                    stroke={colors.textMuted}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                  {showPassword && <Circle cx={12} cy={12} r={3} stroke={colors.textMuted} strokeWidth={1.5} />}
                  {!showPassword && <Path d="M1 1l22 22" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />}
                </Svg>
              </TouchableOpacity>
            }
          />

          <Button
            title="Ingresar"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={!legajo.trim() || !password.trim()}
          />
        </View>

        {/* Biometric */}
        <View style={styles.biometricSection}>
          <Text variant="label" color={colors.textMuted} align="center" style={styles.biometricLabel}>
            Identidad biometrica
          </Text>
          <TouchableOpacity onPress={handleBiometric} style={styles.biometricButton}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path d="M12 10a2 2 0 012 2c0 1.02-.76 1.85-1.75 1.97" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M7 12a5 5 0 019.33-2.5" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M4.26 10.15A8 8 0 0120 12" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M12 16a4 4 0 01-4-4" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M17.6 13.4A7 7 0 0112 19" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              <Rect x={2} y={2} width={20} height={20} rx={4} stroke={colors.copperMuted} strokeWidth={1} />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Emergency without login */}
        <TouchableOpacity style={styles.emergencyLink} onPress={handleEmergency}>
          <Text variant="bodySm" color={colors.red} align="center">
            * Emergencia sin login
          </Text>
        </TouchableOpacity>

        {/* Security badge */}
        <View style={styles.securityBadge}>
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.textMuted} strokeWidth={1.5} />
          </Svg>
          <Text variant="micro" color={colors.textMuted}>
            {' '}Protocolo de encriptacion Obsidian v4.2
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['4xl'],
  },
  logoContainer: {
    marginBottom: spacing['3xl'],
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing['3xl'],
  },
  form: {
    width: '100%',
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  biometricSection: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  biometricLabel: {
    marginBottom: spacing.lg,
  },
  biometricButton: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyLink: {
    marginBottom: spacing['2xl'],
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
  },
});
