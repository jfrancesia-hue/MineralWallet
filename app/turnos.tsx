import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const calendarDays = [
  { day: 28, type: 'off' }, { day: 29, type: 'off' }, { day: 30, type: 'off' },
  { day: 1, type: 'manana' }, { day: 2, type: 'manana' }, { day: 3, type: 'manana' }, { day: 4, type: 'manana' },
  { day: 5, type: 'manana' }, { day: 6, type: 'manana' }, { day: 7, type: 'manana' },
  { day: 8, type: 'tarde' }, { day: 9, type: 'tarde' }, { day: 10, type: 'tarde' }, { day: 11, type: 'tarde' },
  { day: 12, type: 'rest' }, { day: 13, type: 'rest' }, { day: 14, type: 'rest' },
  { day: 15, type: 'manana' }, { day: 16, type: 'manana' }, { day: 17, type: 'manana' }, { day: 18, type: 'manana' },
];

const shiftColors: Record<string, string> = {
  manana: colors.cyan, tarde: colors.copper, noche: colors.purple, rest: colors.emerald, off: 'transparent',
};

const upcomingShifts = [
  { day: 'Lunes 06 Jun', shift: 'Manana', time: '06:00 - 14:00' },
  { day: 'Martes 07 Jun', shift: 'Manana', time: '06:00 - 14:00' },
  { day: 'Miercoles 08 Jun', shift: 'Descanso', time: 'Libre' },
  { day: 'Jueves 09 Jun', shift: 'Descanso', time: 'Libre' },
  { day: 'Viernes 10 Jun', shift: 'Tarde', time: '14:00 - 22:00' },
];

export default function TurnosScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text variant="labelSm" color={colors.textMuted}>Sector: Extraccion B-4</Text>
            <Text variant="h1" color={colors.textPrimary}>Mis Turnos</Text>
          </View>
        </View>

        {/* Current Shift */}
        <Card variant="financial" style={styles.currentShift}>
          <View style={styles.shiftHeader}>
            <Badge label="Estado: Activo" variant="emerald" />
            <View style={styles.rotationBadge}>
              <Text variant="labelSm" color={colors.textMuted}>Rotacion</Text>
              <Text variant="moneyMd" color={colors.textPrimary}>Dia 5</Text>
              <Text variant="caption" color={colors.textMuted}>/ 7</Text>
            </View>
          </View>
          <Text variant="h1" color={colors.textPrimary} style={styles.shiftName}>Turno Manana</Text>
          <Text variant="moneySm" color={colors.cyan}>06:00 - 14:00</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text variant="labelSm" color={colors.textMuted}>Progreso de rotacion</Text>
              <Text variant="labelSm" color={colors.copper}>71% completado</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '71%' }]} />
            </View>
          </View>
        </Card>

        {/* Monthly Summary */}
        <Card style={styles.summaryCard}>
          <Text variant="h3" color={colors.textPrimary} style={styles.summaryTitle}>Resumen Mensual</Text>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.textSecondary}>Horas este mes</Text>
            <Text variant="moneyMd" color={colors.textPrimary}>168h</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.copper}>Extras</Text>
            <Text variant="moneyMd" color={colors.copper}>24h</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodySm" color={colors.textSecondary}>Extra Pay</Text>
            <MoneyText amount="45.600" variant="moneyMd" prefix="+$" color={colors.emerald} />
          </View>

          <Button title="Solicitar cambio de turno" onPress={() => {}} variant="secondary" size="md" style={styles.swapBtn} />
        </Card>

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Text variant="h3" color={colors.textPrimary} style={styles.calendarTitle}>Calendario Operativo</Text>
          <View style={styles.calendarLegend}>
            <LegendItem color={colors.cyan} label="Manana" />
            <LegendItem color={colors.copper} label="Tarde" />
            <LegendItem color={colors.purple} label="Noche" />
          </View>
          <View style={styles.calendarHeader}>
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((d) => (
              <Text key={d} variant="labelSm" color={colors.textMuted} style={styles.calendarHeaderDay}>{d}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.calendarDay,
                  d.type !== 'off' && d.type !== 'rest' && { backgroundColor: `${shiftColors[d.type]}25`, borderColor: shiftColors[d.type] },
                  d.type === 'rest' && { borderColor: colors.emerald, borderWidth: 1, backgroundColor: 'transparent' },
                  d.day === 5 && { borderWidth: 2, borderColor: colors.textPrimary },
                ]}
              >
                <Text variant="bodySm" color={d.type === 'off' ? colors.textMuted : colors.textPrimary}>
                  {d.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming */}
        <Text variant="h3" color={colors.textPrimary} style={styles.upcomingTitle}>Proximas Jornadas</Text>
        {upcomingShifts.map((s, i) => (
          <Card
            key={i}
            variant="status"
            accentColor={s.shift === 'Descanso' ? colors.emerald : s.shift === 'Tarde' ? colors.copper : colors.cyan}
            style={styles.upcomingCard}
          >
            <View style={styles.upcomingRow}>
              <View>
                <Badge label={s.shift} variant={s.shift === 'Descanso' ? 'emerald' : s.shift === 'Tarde' ? 'copper' : 'cyan'} />
                <Text variant="h3" color={colors.textPrimary} style={styles.upcomingDay}>{s.day}</Text>
              </View>
              <Text variant="moneySm" color={s.time === 'Libre' ? colors.emerald : colors.textSecondary}>
                {s.time}
              </Text>
            </View>
          </Card>
        ))}

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
  progressSection: { marginTop: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.elevated, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.cyan, borderRadius: 3 },
  summaryCard: { marginBottom: spacing.xl },
  summaryTitle: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.copperMuted },
  swapBtn: { marginTop: spacing.lg },
  calendarSection: { marginBottom: spacing.xl },
  calendarTitle: { marginBottom: spacing.md },
  calendarLegend: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  calendarHeader: { flexDirection: 'row', marginBottom: spacing.sm },
  calendarHeaderDay: { flex: 1, textAlign: 'center' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: {
    width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: layout.borderRadius.sm, borderWidth: 0.5, borderColor: 'transparent',
  },
  upcomingTitle: { marginBottom: spacing.md },
  upcomingCard: { marginBottom: spacing.sm },
  upcomingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upcomingDay: { marginTop: spacing.xs },
});
