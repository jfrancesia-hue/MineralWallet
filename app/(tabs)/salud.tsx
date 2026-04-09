import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, MoneyText, Label, Card, Badge, Button } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle } from 'react-native-svg';

export default function SaludScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text variant="h1" color={colors.textPrimary}>Mi Salud</Text>
        </View>

        {/* Fatigue Monitor */}
        <Card variant="financial" style={styles.fatigueCard}>
          <View style={styles.fatigueHeader}>
            <Label color={colors.textMuted}>Fatigue Monitor</Label>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={colors.emerald} strokeWidth={1.5} />
            </Svg>
          </View>
          <Text variant="h1" color={colors.emerald} style={styles.fatigueStatus}>
            OPTIMO
          </Text>

          {/* Gauge visualization */}
          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeBox}>
              <Text variant="balance" color={colors.emerald} align="center">94</Text>
              <Text variant="labelSm" color={colors.textMuted} align="center">%</Text>
              <Text variant="labelSm" color={colors.textMuted} align="center">Readiness Score</Text>
            </View>
          </View>

          <View style={styles.fatigueMetrics}>
            <View style={styles.fatigueMetric}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={colors.cyan} strokeWidth={1.5} />
              </Svg>
              <Text variant="labelSm" color={colors.textMuted}>Sleep Quality</Text>
              <Text variant="moneySm" color={colors.textPrimary}>07:45h</Text>
            </View>
            <View style={styles.fatigueMetric}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={colors.copper} strokeWidth={1.5} />
                <Circle cx={9} cy={7} r={4} stroke={colors.copper} strokeWidth={1.5} />
              </Svg>
              <Text variant="labelSm" color={colors.textMuted}>Shift Load</Text>
              <Text variant="moneySm" color={colors.textPrimary}>Normal</Text>
            </View>
          </View>
        </Card>

        {/* Hydration */}
        <Card style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" stroke={colors.cyan} strokeWidth={1.5} />
            </Svg>
            <Badge label="62%" variant="cyan" />
          </View>
          <Text variant="h3" color={colors.textPrimary}>Hydration</Text>
          <Text variant="caption" color={colors.textSecondary}>Daily goal: 4.0L</Text>

          {/* Progress bar */}
          <View style={styles.hydrationProgress}>
            <View style={styles.hydrationBar}>
              <View style={[styles.hydrationFill, { width: '62%' }]} />
            </View>
          </View>
          <Text variant="moneySm" color={colors.textPrimary}>2.5L <Text variant="caption" color={colors.textMuted}>/ 4.0L</Text></Text>

          <Button title="+ + Vaso" onPress={() => {}} variant="secondary" size="md" style={styles.vasoButton} />
        </Card>

        {/* Medical Exams */}
        <Card style={styles.examCard}>
          <View style={styles.examHeader}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke={colors.copper} strokeWidth={1.5} />
              <Path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke={colors.copper} strokeWidth={1.5} />
            </Svg>
            <Badge label="Proximo" variant="amber" />
          </View>
          <Text variant="h3" color={colors.textPrimary}>Examenes Medicos</Text>
          <Text variant="h2" color={colors.copper} style={styles.examDate}>15 de Mayo</Text>

          <Label color={colors.textMuted} style={styles.checklistTitle}>Checklist Previo</Label>
          <View style={styles.checklist}>
            <ChecklistItem label="Ayuno de 12 horas" checked />
            <ChecklistItem label="Documento de Identidad" checked={false} />
            <ChecklistItem label="Uniforme de Faena" checked={false} />
          </View>
        </Card>

        {/* Core Metrics */}
        <Label color={colors.textMuted} style={styles.sectionLabel}>Core Metrics</Label>
        <Card style={styles.metricsCard}>
          <MetricRow icon="heart" label="Heart Rate" value="72" unit="BPM" color={colors.red} />
          <MetricRow icon="steps" label="Steps" value="8.4k" unit="Steps" color={colors.emerald} />
          <MetricRow icon="sleep" label="Deep Sleep" value="2.1h" unit="Cycles" color={colors.purple} />
        </Card>

        {/* Mental Health */}
        <Card style={styles.mentalCard}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.purple} strokeWidth={1.5} />
          </Svg>
          <Text variant="h3" color={colors.textPrimary} style={styles.mentalTitle}>
            Soporte Mental
          </Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Porque tu bienestar emocional es el motor de tu seguridad.
          </Text>
          <TouchableOpacity style={styles.mentalButton}>
            <View style={styles.mentalButtonContent}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke={colors.purple} strokeWidth={1.5} />
              </Svg>
              <View>
                <Text variant="labelSm" color={colors.purple}>Linea confidencial 24/7</Text>
                <Text variant="buttonSm" color={colors.textPrimary}>Conectate ahora</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View style={checkStyles.row}>
      <View style={[checkStyles.checkbox, checked && checkStyles.checked]}>
        {checked && (
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
            <Path d="M20 6L9 17l-5-5" stroke={colors.textPrimary} strokeWidth={3} strokeLinecap="round" />
          </Svg>
        )}
      </View>
      <Text variant="bodySm" color={checked ? colors.textPrimary : colors.textMuted}>
        {label}
      </Text>
    </View>
  );
}

function MetricRow({ icon, label, value, unit, color }: { icon: string; label: string; value: string; unit: string; color: string }) {
  return (
    <View style={metricStyles.row}>
      <View style={[metricStyles.icon, { backgroundColor: `${color}15` }]}>
        <View style={[metricStyles.dot, { backgroundColor: color }]} />
      </View>
      <Text variant="bodySm" color={colors.textSecondary} style={metricStyles.label}>{label}</Text>
      <Text variant="moneyMd" color={colors.textPrimary}>{value}</Text>
      <Text variant="labelSm" color={colors.textMuted}>{unit}</Text>
    </View>
  );
}

const checkStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
});

const metricStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.copperMuted,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    flex: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  fatigueCard: {
    marginBottom: spacing.lg,
  },
  fatigueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  fatigueStatus: {
    marginBottom: spacing.lg,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  gaugeBox: {
    width: 160,
    height: 120,
    borderRadius: layout.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.emerald,
    backgroundColor: `${colors.emerald}08`,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  fatigueMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  fatigueMetric: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  hydrationCard: {
    marginBottom: spacing.lg,
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hydrationProgress: {
    marginVertical: spacing.md,
  },
  hydrationBar: {
    height: 8,
    backgroundColor: colors.elevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hydrationFill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: 4,
  },
  vasoButton: {
    marginTop: spacing.md,
  },
  examCard: {
    marginBottom: spacing.lg,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  examDate: {
    marginBottom: spacing.lg,
  },
  checklistTitle: {
    marginBottom: spacing.sm,
  },
  checklist: {
    gap: spacing.xs,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  metricsCard: {
    marginBottom: spacing.lg,
  },
  mentalCard: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  mentalTitle: {
    marginTop: spacing.sm,
  },
  mentalButton: {
    backgroundColor: `${colors.purple}15`,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.lg,
    marginTop: spacing.sm,
    minHeight: layout.touchTarget,
  },
  mentalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
