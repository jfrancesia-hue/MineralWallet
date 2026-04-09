import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const months = ['Enero', 'Febrero', 'Marzo'];
const haberes = [
  { label: 'Sueldo Basico', amount: 520000 },
  { label: 'Adicional Zona', amount: 104000 },
  { label: 'Horas Extras (15h)', amount: 45600 },
];
const descuentos = [
  { label: 'Aportes Jubilatorios', amount: 59215 },
  { label: 'Adelanto Quincena', amount: 150000 },
  { label: 'Microcredito Interno', amount: 45000 },
];
const previousMonths = [
  { month: 'Marzo 2026', neto: 369585 },
  { month: 'Febrero 2026', neto: 358120 },
  { month: 'Enero 2026', neto: 342900 },
];

export default function ReciboScreen() {
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
            <Text variant="h1" color={colors.textPrimary}>Mi Recibo</Text>
            <Text variant="labelSm" color={colors.textMuted}>Control de haberes</Text>
          </View>
        </View>

        {/* Month selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          <View style={styles.monthRow}>
            {months.map((m, i) => (
              <TouchableOpacity
                key={m}
                style={[styles.monthPill, i === 2 && styles.monthActive]}
              >
                <Text variant="buttonSm" color={i === 2 ? colors.background : colors.textSecondary}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Recibo Card */}
        <Card variant="financial" style={styles.reciboCard}>
          {/* Company Info */}
          <View style={styles.companyRow}>
            <View style={styles.companyLogo}>
              <Text variant="bodySm" color={colors.copper}>OM</Text>
            </View>
            <View>
              <Text variant="h3" color={colors.textPrimary}>Obsidian Mining Co.</Text>
              <Text variant="labelSm" color={colors.textMuted}>CUIT: 30-71234567-9</Text>
            </View>
          </View>

          {/* Worker */}
          <View style={styles.workerSection}>
            <Text variant="labelSm" color={colors.textMuted}>Empleado</Text>
            <Text variant="h3" color={colors.textPrimary}>Carlos Rodriguez</Text>
            <Text variant="caption" color={colors.textMuted}>Legajo: #MN-20948 · Cat: Oficial Especializado</Text>
          </View>

          <View style={styles.periodoSection}>
            <Text variant="labelSm" color={colors.textMuted}>Periodo de liquidacion</Text>
            <Text variant="h2" color={colors.copper}>Abril 2026</Text>
            <Text variant="caption" color={colors.textMuted}>Fecha de pago: 05/05/2026</Text>
          </View>

          {/* Haberes */}
          <Text variant="h3" color={colors.emerald} style={styles.sectionLabel}>↗ Haberes</Text>
          {haberes.map((h) => (
            <View key={h.label} style={styles.lineItem}>
              <Text variant="bodySm" color={colors.textSecondary}>{h.label}</Text>
              <MoneyText amount={h.amount.toLocaleString('es-AR')} variant="moneySm" color={colors.textPrimary} />
            </View>
          ))}
          <View style={[styles.lineItem, styles.totalLine]}>
            <Text variant="bodySm" color={colors.textMuted}>Total Haberes</Text>
            <MoneyText amount="669.600,00" variant="moneySm" color={colors.emerald} />
          </View>

          {/* Descuentos */}
          <Text variant="h3" color={colors.red} style={styles.sectionLabel}>↙ Descuentos</Text>
          {descuentos.map((d) => (
            <View key={d.label} style={styles.lineItem}>
              <Text variant="bodySm" color={colors.textSecondary}>{d.label}</Text>
              <MoneyText amount={d.amount.toLocaleString('es-AR')} variant="moneySm" color={colors.textPrimary} />
            </View>
          ))}
          <View style={[styles.lineItem, styles.totalLine]}>
            <Text variant="bodySm" color={colors.textMuted}>Total Descuentos</Text>
            <MoneyText amount="254.215,00" variant="moneySm" color={colors.red} />
          </View>

          {/* Neto */}
          <View style={styles.netoSection}>
            <Text variant="label" color={colors.copper}>Neto a Cobrar</Text>
            <MoneyText amount="415.385" variant="moneyLg" color={colors.copper} />
            <Text variant="caption" color={colors.textMuted}>,00</Text>
          </View>

          {/* Comparison */}
          <View style={styles.comparison}>
            <Text variant="caption" color={colors.textMuted}>vs. Mes anterior</Text>
            <Text variant="bodySm" color={colors.emerald}> +12.4% (+$45.8k)</Text>
          </View>
        </Card>

        {/* Actions */}
        <Button title="↓ Descargar PDF" onPress={() => {}} variant="primary" size="lg" />
        <Button title="↗ Compartir" onPress={() => {}} variant="secondary" size="lg" style={styles.shareBtn} />

        {/* Previous months */}
        <Text variant="label" color={colors.textMuted} style={styles.prevTitle}>Recibos anteriores</Text>
        {previousMonths.map((m) => (
          <Card key={m.month} style={styles.prevCard} onPress={() => {}}>
            <View style={styles.prevRow}>
              <View>
                <Text variant="labelSm" color={colors.copper}>{m.month}</Text>
                <MoneyText amount={m.neto.toLocaleString('es-AR')} variant="moneySm" color={colors.textPrimary} />
              </View>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
            </View>
          </Card>
        ))}

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  monthScroll: { marginBottom: spacing.xl },
  monthRow: { flexDirection: 'row', gap: spacing.sm },
  monthPill: {
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderRadius: layout.borderRadius.sm, borderWidth: 1, borderColor: colors.copperMuted,
    minHeight: 40, justifyContent: 'center',
  },
  monthActive: { backgroundColor: colors.copper, borderColor: colors.copper },
  reciboCard: { marginBottom: spacing.xl },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  companyLogo: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: colors.elevated,
    alignItems: 'center', justifyContent: 'center',
  },
  workerSection: { marginBottom: spacing.lg, gap: 2 },
  periodoSection: { marginBottom: spacing.xl, gap: 2 },
  sectionLabel: { marginTop: spacing.lg, marginBottom: spacing.md },
  lineItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.copperMuted,
  },
  totalLine: { borderBottomWidth: 0, paddingTop: spacing.md },
  netoSection: {
    marginTop: spacing.xl, padding: spacing.lg, backgroundColor: `${colors.copper}08`,
    borderRadius: layout.borderRadius.md, borderWidth: 1, borderColor: colors.copperMuted,
    flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, flexWrap: 'wrap',
  },
  comparison: { flexDirection: 'row', marginTop: spacing.md, justifyContent: 'center' },
  shareBtn: { marginTop: spacing.sm },
  prevTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  prevCard: { marginBottom: spacing.sm },
  prevRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
