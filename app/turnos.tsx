import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { haptics } from '../src/utils/haptics';
import { Text, MoneyText, Label, Card, Badge, Button, ProgressBar, SkeletonCard } from '../src/components/ui';
import { ShiftCard } from '../src/components/cards';
import { useWorkStore, useAuthStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function TurnosScreen() {
  const currentShift = useWorkStore((s) => s.currentShift);
  const hoursThisMonth = useWorkStore((s) => s.hoursThisMonth);
  const overtimeHours = useWorkStore((s) => s.overtimeHours);
  const overtimePay = useWorkStore((s) => s.overtimePay);
  const isCheckedIn = useWorkStore((s) => s.isCheckedIn);
  const checkInTime = useWorkStore((s) => s.checkInTime);
  const supervisor = useWorkStore((s) => s.supervisor);
  const checkIn = useWorkStore((s) => s.performCheckIn);
  const checkOut = useWorkStore((s) => s.performCheckOut);
  const isLoading = useWorkStore((s) => s.isLoading);
  const fetchSummary = useWorkStore((s) => s.fetchSummary);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSummary(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  const rotationPercent = currentShift
    ? Math.round((currentShift.dayOfRotation / currentShift.totalDays) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text variant="labelSm" color={colors.textMuted}>Sector: {currentShift?.sector ?? 'Sin asignar'}</Text>
            <Text variant="h1" color={colors.textPrimary}>Mis Turnos</Text>
          </View>
        </View>

        {/* Current Shift */}
        {currentShift && (
          <Card variant="financial" style={styles.currentShift}>
            <View style={styles.shiftHeader}>
              <Badge label={isCheckedIn ? 'Fichado' : 'Sin fichar'} variant={isCheckedIn ? 'emerald' : 'amber'} />
              <View style={styles.rotationBadge}>
                <Text variant="labelSm" color={colors.textMuted}>Rotacion</Text>
                <Text variant="moneyMd" color={colors.textPrimary}>Dia {currentShift.dayOfRotation}</Text>
                <Text variant="caption" color={colors.textMuted}>/ {currentShift.totalDays}</Text>
              </View>
            </View>
            <Text variant="h1" color={colors.textPrimary} style={styles.shiftName}>
              Turno {currentShift.type === 'manana' ? 'Manana' : currentShift.type === 'tarde' ? 'Tarde' : 'Noche'}
            </Text>
            <Text variant="moneySm" color={colors.cyan}>
              {currentShift.startTime} — {currentShift.endTime}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {currentShift.sector} · {currentShift.level}
            </Text>

            {isCheckedIn && checkInTime && (
              <Text variant="caption" color={colors.emerald} style={styles.checkInLabel}>
                Fichaste a las {checkInTime}
              </Text>
            )}

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text variant="labelSm" color={colors.textMuted}>Progreso de rotacion</Text>
                <Text variant="labelSm" color={colors.copper}>{rotationPercent}% completado</Text>
              </View>
              <ProgressBar progress={rotationPercent} color={colors.cyan} height={6} />
            </View>

            {/* Check in/out */}
            <Button
              title={isCheckedIn ? 'Fichar Salida' : 'Fichar Entrada'}
              onPress={() => { haptics.medium(); isCheckedIn ? checkOut() : checkIn(); }}
              variant={isCheckedIn ? 'secondary' : 'primary'}
              size="lg"
            />
          </Card>
        )}

        {/* Supervisor */}
        <Card style={styles.supervisorCard}>
          <Text variant="labelSm" color={colors.textMuted}>Supervisor de turno</Text>
          <Text variant="h3" color={colors.textPrimary}>{supervisor.name}</Text>
          <Text variant="caption" color={colors.textSecondary}>{supervisor.role}</Text>
        </Card>

        {/* Monthly Summary */}
        <Card style={styles.summaryCard}>
          <Text variant="h3" color={colors.textPrimary} style={styles.summaryTitle}>Resumen Mensual</Text>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.textSecondary}>Horas este mes</Text>
            <Text variant="moneyMd" color={colors.textPrimary}>{hoursThisMonth}h</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.copper}>Extras</Text>
            <Text variant="moneyMd" color={colors.copper}>{overtimeHours}h</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.textSecondary}>Extra Pay</Text>
            <MoneyText amount={overtimePay} variant="moneyMd" prefix="+$" color={colors.emerald} />
          </View>

          <Button title="Solicitar cambio de turno" onPress={() => {
            Alert.alert(
              'Solicitar Cambio',
              'Se enviara una solicitud de cambio de turno a tu supervisor. Confirmas?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => Alert.alert('Solicitud Enviada', 'Tu supervisor recibira la solicitud.') },
              ]
            );
          }} variant="secondary" size="md" style={styles.swapBtn} />
        </Card>

        {/* Calendar Legend */}
        <View style={styles.calendarSection}>
          <Text variant="h3" color={colors.textPrimary} style={styles.calendarTitle}>Calendario Operativo</Text>
          <View style={styles.calendarLegend}>
            <LegendItem color={colors.cyan} label="Manana" />
            <LegendItem color={colors.copper} label="Tarde" />
            <LegendItem color={colors.purple} label="Noche" />
            <LegendItem color={colors.emerald} label="Descanso" />
          </View>
        </View>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text variant="caption" color={colors.textSecondary}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing['2xl'] },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  currentShift: { marginBottom: spacing.lg },
  shiftHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  rotationBadge: { alignItems: 'flex-end' },
  shiftName: { marginBottom: spacing.xs },
  checkInLabel: { marginTop: spacing.sm },
  progressSection: { marginTop: spacing.lg, marginBottom: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  supervisorCard: { marginBottom: spacing.lg, gap: 2 },
  summaryCard: { marginBottom: spacing.xl },
  summaryTitle: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, },
  swapBtn: { marginTop: spacing.lg },
  calendarSection: { marginBottom: spacing.xl },
  calendarTitle: { marginBottom: spacing.md },
  calendarLegend: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
});
