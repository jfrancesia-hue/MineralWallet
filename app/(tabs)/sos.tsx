import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Button } from '../../src/components/ui';
import { OfflineBanner } from '../../src/components/shared/OfflineBanner';
import { useSafetyStore, useConnectivityStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';
import { haptics } from '../../src/utils/haptics';

export default function SOSScreen() {
  const {
    sosActive,
    sosCountdown,
    emergencyContacts,
    activateSOS,
    cancelSOS,
    resetCountdown,
    fetchSummary,
  } = useSafetyStore();

  useEffect(() => { fetchSummary(); }, []);
  const isOnline = useConnectivityStore((s) => s.isOnline);

  const [countdown, setCountdown] = useState(sosCountdown);
  const [activated, setActivated] = useState(sosActive);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (activated || countdown <= 0) {
      if (countdown <= 0 && !activated) {
        handleActivate();
      }
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, activated]);

  const handleActivate = () => {
    haptics.heavy();
    setActivated(true);
    // TODO: Obtener coordenadas reales con expo-location
    activateSOS(-27.3855, -66.9456);
  };

  const handleCancel = () => {
    haptics.medium();
    setCountdown(30);
    setActivated(false);
    cancelSOS();
    resetCountdown();
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const medicalContact = emergencyContacts.find((c) => c.role === 'medical');
  const mineContact = emergencyContacts.find((c) => c.role === 'mine');
  const familyContact = emergencyContacts.find((c) => c.role === 'family');

  return (
    <LinearGradient
      colors={colors.redGradient}
      style={styles.container}
    >
      {/* Offline indicator */}
      <View style={styles.offlineBar}>
        {!isOnline && (
          <>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
            <Text variant="labelSm" color={colors.textPrimary}>Modo offline activo</Text>
          </>
        )}
        <View style={styles.signalBars}>
          <Text variant="labelSm" color={colors.textPrimary}>
            {isOnline ? 'Conectado' : 'Senal satelital'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text variant="h1" color={colors.textPrimary} align="center" style={styles.title}>
        EMERGENCIA
      </Text>

      {/* Countdown */}
      {!activated && (
        <View style={styles.countdownContainer}>
          <View style={styles.countdownDot} />
          <Text variant="moneySm" color={colors.textPrimary} align="center">
            SOS se activa en {countdown}s
          </Text>
        </View>
      )}

      {activated && (
        <View style={styles.countdownContainer}>
          <View style={[styles.countdownDot, { backgroundColor: colors.red }]} />
          <Text variant="moneySm" color={colors.textPrimary} align="center">
            SOS ACTIVADO — Ayuda en camino
          </Text>
        </View>
      )}

      {/* Main Buttons */}
      <Animated.View style={[styles.mainButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          onPress={handleActivate}
          style={[styles.sosMainButton, activated && styles.sosActivated]}
          activeOpacity={0.8}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" fill={colors.textPrimary} />
          </Svg>
          <Text variant="h2" color={colors.textPrimary} align="center">
            {activated ? 'SOS ACTIVADO' : 'SI - ACTIVAR SOS'}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.7)" align="center">
            {activated ? 'Coordenadas enviadas al centro de control' : 'Enviar coordenadas y alerta inmediata'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {!activated && (
        <TouchableOpacity style={styles.reportButton} onPress={() => {
          Alert.alert(
            'Reportar Condicion',
            'Selecciona el tipo de incidente:',
            [
              { text: 'Lesion', onPress: () => { activateSOS(-27.3855, -66.9456); } },
              { text: 'Derrumbe', onPress: () => { activateSOS(-27.3855, -66.9456); } },
              { text: 'Falla Critica', onPress: () => { activateSOS(-27.3855, -66.9456); } },
              { text: 'Cancelar', style: 'cancel' },
            ]
          );
        }} activeOpacity={0.8}>
          <Text variant="h3" color={colors.textPrimary} align="center">
            REPORTAR CONDICION
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.7)" align="center">
            Lesion, derrumbe o falla critica
          </Text>
        </TouchableOpacity>
      )}

      {/* Emergency Contacts */}
      <View style={styles.contactsSection}>
        {medicalContact && (
          <EmergencyContactRow
            label={medicalContact.label}
            title={medicalContact.phone}
            subtitle={medicalContact.name}
            buttonLabel="Llamar Ahora"
            onPress={() => handleCall(medicalContact.phone)}
            borderColor={colors.cyan}
          />
        )}
        {mineContact && (
          <EmergencyContactRow
            label={mineContact.label}
            title={mineContact.name}
            subtitle="Rescate en Mina"
            buttonLabel="Enlace Directo"
            onPress={() => handleCall(mineContact.phone)}
            borderColor={colors.amber}
          />
        )}
        {familyContact && (
          <EmergencyContactRow
            label={familyContact.label}
            title={`${familyContact.name} (Family)`}
            subtitle="Contacto de Enlace"
            buttonLabel="Enviar SMS Panico"
            onPress={() => Linking.openURL(`sms:${familyContact.phone}`)}
            borderColor={colors.purple}
          />
        )}
      </View>

      {/* Cancel */}
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
        <Text variant="buttonSm" color="rgba(255,255,255,0.5)" align="center">
          Cancelar - Estoy bien
        </Text>
      </TouchableOpacity>

      <Text variant="micro" color="rgba(255,255,255,0.3)" align="center" style={styles.disclaimer}>
        Si no cancela, el protocolo de extraccion satelital se activara automaticamente al finalizar la cuenta regresiva.
      </Text>
    </LinearGradient>
  );
}

function EmergencyContactRow({
  label,
  title,
  subtitle,
  buttonLabel,
  onPress,
  borderColor,
}: {
  label: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPress: () => void;
  borderColor: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.contactCard, { borderLeftColor: borderColor }]}
      activeOpacity={0.7}
    >
      <View style={styles.contactContent}>
        <Text variant="labelSm" color={colors.textMuted}>{label}</Text>
        <Text variant="h3" color={colors.textPrimary}>{title}</Text>
        <Text variant="caption" color={colors.textSecondary}>{subtitle}</Text>
      </View>
      <View style={[styles.contactButton, { backgroundColor: `${borderColor}30` }]}>
        <Text variant="buttonSm" color={borderColor}>{buttonLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: spacing.sm,
    borderRadius: layout.borderRadius.full,
    alignSelf: 'center',
  },
  countdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  mainButtonContainer: {
    marginBottom: spacing.md,
  },
  sosMainButton: {
    backgroundColor: 'rgba(255,59,74,0.8)',
    borderRadius: layout.borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sosActivated: {
    backgroundColor: 'rgba(255,59,74,1)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  reportButton: {
    backgroundColor: 'rgba(255,176,32,0.6)',
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 60,
    marginBottom: spacing.xl,
  },
  contactsSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  contactCard: {
    backgroundColor: 'rgba(15,20,32,0.8)',
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
    borderLeftWidth: 3,
    gap: spacing.md,
  },
  contactContent: {
    gap: 2,
  },
  contactButton: {
    borderRadius: layout.borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  cancelButton: {
    padding: spacing.lg,
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  disclaimer: {
    paddingBottom: spacing['3xl'],
  },
});
