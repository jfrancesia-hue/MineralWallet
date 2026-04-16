import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Linking, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../../src/components/ui';
import { useSafetyStore, useConnectivityStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle } from 'react-native-svg';
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
  const pulseOuter = useRef(new Animated.Value(1)).current;
  const pulseInner = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, toValue: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
        ])
      );
    const outer = loop(pulseOuter, 1.25, 1200);
    const inner = loop(pulseInner, 1.08, 800);
    outer.start();
    inner.start();
    return () => { outer.stop(); inner.stop(); };
  }, [pulseOuter, pulseInner]);

  useEffect(() => {
    if (activated || countdown <= 0) {
      if (countdown <= 0 && !activated) handleActivate();
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, activated]);

  const handleActivate = () => {
    haptics.heavy();
    setActivated(true);
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
      colors={[colors.red, colors.redDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status bar row */}
        <View style={styles.statusBar}>
          <View style={styles.offlineRow}>
            {!isOnline && (
              <>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
                </Svg>
                <Text variant="labelSm" color={colors.textPrimary}>Modo offline</Text>
              </>
            )}
          </View>
          <Text variant="labelSm" color="rgba(255,255,255,0.7)">
            {isOnline ? '◉ Conectado' : '◉ Senal satelital'}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text variant="labelSm" color="rgba(255,255,255,0.6)">Protocolo</Text>
          <Text variant="display" color={colors.textPrimary} align="left" style={styles.titleText}>
            EMERGENCIA
          </Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          {!activated ? (
            <>
              <View style={[styles.pulseDot, { backgroundColor: colors.amber }]} />
              <Text variant="moneySm" color={colors.textPrimary}>
                Se activa en {countdown}s
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.pulseDot, { backgroundColor: colors.textPrimary }]} />
              <Text variant="moneySm" color={colors.textPrimary}>
                ACTIVADO — Ayuda en camino
              </Text>
            </>
          )}
        </View>

        {/* Main SOS button */}
        <View style={styles.sosArena}>
          <Animated.View
            style={[
              styles.sosRingOuter,
              {
                transform: [{ scale: pulseOuter }],
                opacity: pulseOuter.interpolate({ inputRange: [1, 1.25], outputRange: [0.35, 0] }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.sosRingInner,
              { transform: [{ scale: pulseInner }] },
            ]}
          />
          <TouchableOpacity
            onPress={handleActivate}
            style={[styles.sosMain, activated && styles.sosActivated]}
            activeOpacity={0.92}
          >
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2L2 20h20L12 2z" stroke={colors.textPrimary} strokeWidth={2} strokeLinejoin="round" />
              <Path d="M12 9v5" stroke={colors.textPrimary} strokeWidth={2.4} strokeLinecap="round" />
              <Circle cx={12} cy={17.5} r={1.2} fill={colors.textPrimary} />
            </Svg>
            <Text variant="h2" color={colors.textPrimary} align="center" style={styles.sosMainLabel}>
              {activated ? 'SOS ACTIVADO' : 'ACTIVAR SOS'}
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.8)" align="center">
              {activated ? 'Coordenadas enviadas al centro de control' : 'Envio de GPS + alerta inmediata'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report secondary */}
        {!activated && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              Alert.alert(
                'Reportar Condicion',
                'Selecciona el tipo de incidente:',
                [
                  { text: 'Lesion', onPress: () => activateSOS(-27.3855, -66.9456) },
                  { text: 'Derrumbe', onPress: () => activateSOS(-27.3855, -66.9456) },
                  { text: 'Falla Critica', onPress: () => activateSOS(-27.3855, -66.9456) },
                  { text: 'Cancelar', style: 'cancel' },
                ]
              );
            }}
            activeOpacity={0.85}
          >
            <Text variant="button" color={colors.textPrimary} align="center">
              REPORTAR CONDICION
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.65)" align="center">
              Lesion · Derrumbe · Falla critica
            </Text>
          </TouchableOpacity>
        )}

        {/* Emergency contacts */}
        <View style={styles.contactsSection}>
          <Text variant="labelSm" color="rgba(255,255,255,0.65)" style={styles.sectionLabel}>
            Contactos de emergencia
          </Text>
          {medicalContact && (
            <EmergencyContactRow
              label={medicalContact.label}
              title={medicalContact.phone}
              subtitle={medicalContact.name}
              buttonLabel="Llamar"
              onPress={() => handleCall(medicalContact.phone)}
              accentColor={colors.cyan}
            />
          )}
          {mineContact && (
            <EmergencyContactRow
              label={mineContact.label}
              title={mineContact.name}
              subtitle="Rescate en Mina"
              buttonLabel="Enlace"
              onPress={() => handleCall(mineContact.phone)}
              accentColor={colors.amber}
            />
          )}
          {familyContact && (
            <EmergencyContactRow
              label={familyContact.label}
              title={`${familyContact.name} (Familia)`}
              subtitle="Contacto de Enlace"
              buttonLabel="SMS"
              onPress={() => Linking.openURL(`sms:${familyContact.phone}`)}
              accentColor={colors.purple}
            />
          )}
        </View>

        {/* Cancel */}
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text variant="buttonSm" color="rgba(255,255,255,0.55)" align="center">
            Cancelar — estoy bien
          </Text>
        </TouchableOpacity>

        <Text variant="micro" color="rgba(255,255,255,0.35)" align="center" style={styles.disclaimer}>
          Si no cancelas, el protocolo de extraccion satelital se activara automaticamente al finalizar la cuenta regresiva.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

function EmergencyContactRow({
  label,
  title,
  subtitle,
  buttonLabel,
  onPress,
  accentColor,
}: {
  label: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPress: () => void;
  accentColor: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.contactCard, { borderLeftColor: accentColor }]}
      activeOpacity={0.85}
    >
      <View style={styles.contactContent}>
        <Text variant="labelSm" color="rgba(255,255,255,0.55)">{label}</Text>
        <Text variant="h3" color={colors.textPrimary}>{title}</Text>
        <Text variant="caption" color="rgba(255,255,255,0.7)">{subtitle}</Text>
      </View>
      <View style={[styles.contactButton, { backgroundColor: accentColor }]}>
        <Text variant="buttonSm" color={colors.background}>{buttonLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'] + spacing.md,
    paddingBottom: spacing['5xl'],
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  titleBlock: {
    marginBottom: spacing.xl,
  },
  titleText: {
    letterSpacing: -1,
    fontSize: 44,
    lineHeight: 48,
  },
  titleUnderline: {
    width: 48,
    height: 3,
    backgroundColor: colors.textPrimary,
    marginTop: spacing.sm,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius.sm,
    alignSelf: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sosArena: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    position: 'relative',
    height: 240,
  },
  sosRingOuter: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  sosRingInner: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sosMain: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(139, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  sosActivated: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sosMainLabel: {
    letterSpacing: 0.5,
  },
  reportButton: {
    backgroundColor: 'rgba(255,176,32,0.85)',
    borderRadius: layout.borderRadius.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 64,
    marginBottom: spacing.xl,
  },
  contactsSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  contactCard: {
    backgroundColor: 'rgba(10, 14, 26, 0.55)',
    borderRadius: layout.borderRadius.sm,
    padding: spacing.lg,
    borderLeftWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  contactContent: {
    flex: 1,
    gap: 2,
  },
  contactButton: {
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: layout.touchTarget,
    minWidth: 72,
    justifyContent: 'center',
  },
  cancelButton: {
    padding: spacing.lg,
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  disclaimer: {
    paddingHorizontal: spacing.lg,
  },
});
