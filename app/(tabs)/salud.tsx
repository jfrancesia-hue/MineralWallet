import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, MoneyText, Label, Card, Badge, Button, ProgressBar, SkeletonCard } from '../../src/components/ui';
import { useHealthStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle } from 'react-native-svg';

const fatigueConfig = {
  optimo: { color: colors.emerald, label: 'OPTIMO' },
  precaucion: { color: colors.amber, label: 'PRECAUCION' },
  riesgo: { color: colors.red, label: 'RIESGO' },
} as const;

const moodEmojis = [
  { value: 1, label: 'Mal' },
  { value: 2, label: 'Regular' },
  { value: 3, label: 'Bien' },
  { value: 4, label: 'Muy bien' },
  { value: 5, label: 'Excelente' },
];

export default function SaludScreen() {
  const {
    fatigueLevel,
    readinessScore,
    sleepHours,
    shiftLoad,
    hydrationCurrent,
    hydrationGoal,
    hydrationPercent,
    temperature,
    medicalExams,
    metrics,
    moodToday,
    daysAwayFromHome,
    daysUntilReturn,
    addWater,
    setMood,
    fetchSummary,
    isLoading,
  } = useHealthStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSummary(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  const fatigue = fatigueConfig[fatigueLevel];
  const nextExam = medicalExams.find((e) => e.status === 'pendiente');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        {/* Header */}
        <View style={styles.header}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text variant="h1" color={colors.textPrimary}>Mi Salud</Text>
        </View>

        {/* Away from home banner */}
        <Card variant="status" accentColor={colors.purple} style={styles.awayCard}>
          <View style={styles.awayRow}>
            <View>
              <Text variant="bodySm" color={colors.textPrimary}>
                {daysAwayFromHome} dias en mina
              </Text>
              <Text variant="caption" color={colors.textSecondary}>
                Faltan {daysUntilReturn} dias para volver a casa
              </Text>
            </View>
            <Badge label={`${daysUntilReturn}d`} variant="purple" />
          </View>
        </Card>

        {/* Fatigue Monitor */}
        <Card variant="financial" style={styles.fatigueCard}>
          <View style={styles.fatigueHeader}>
            <Label color={colors.textMuted}>Fatigue Monitor</Label>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={fatigue.color} strokeWidth={1.5} />
            </Svg>
          </View>
          <Text variant="h1" color={fatigue.color} style={styles.fatigueStatus}>
            {fatigue.label}
          </Text>

          {/* Gauge */}
          <View style={styles.gaugeContainer}>
            <View style={[styles.gaugeBox, { borderColor: fatigue.color, backgroundColor: `${fatigue.color}08` }]}>
              <Text variant="balance" color={fatigue.color} align="center">{readinessScore}</Text>
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
              <Text variant="moneySm" color={colors.textPrimary}>{sleepHours.toFixed(2)}h</Text>
            </View>
            <View style={styles.fatigueMetric}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={colors.copper} strokeWidth={1.5} />
                <Circle cx={9} cy={7} r={4} stroke={colors.copper} strokeWidth={1.5} />
              </Svg>
              <Text variant="labelSm" color={colors.textMuted}>Shift Load</Text>
              <Text variant="moneySm" color={colors.textPrimary}>{shiftLoad}</Text>
            </View>
          </View>
        </Card>

        {/* Mood Picker */}
        <Card style={styles.moodCard}>
          <Text variant="h3" color={colors.textPrimary}>Como te sentis hoy?</Text>
          <View style={styles.moodRow}>
            {moodEmojis.map((emoji) => (
              <TouchableOpacity
                key={emoji.value}
                onPress={() => setMood(emoji.value)}
                style={[styles.moodItem, moodToday === emoji.value && styles.moodSelected]}
              >
                <Text variant="moneyMd" color={moodToday === emoji.value ? colors.copper : colors.textMuted}>
                  {emoji.value}
                </Text>
                <Text variant="micro" color={moodToday === emoji.value ? colors.copper : colors.textMuted}>
                  {emoji.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Hydration */}
        <Card style={styles.hydrationCard}>
          <View style={styles.hydrationHeader}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" stroke={colors.cyan} strokeWidth={1.5} />
            </Svg>
            <Badge label={`${hydrationPercent}%`} variant="cyan" />
          </View>
          <Text variant="h3" color={colors.textPrimary}>Hydration</Text>
          <Text variant="caption" color={colors.textSecondary}>Daily goal: {(hydrationGoal / 1000).toFixed(1)}L</Text>

          <View style={styles.hydrationProgress}>
            <ProgressBar progress={hydrationPercent} color={colors.cyan} height={8} />
          </View>
          <Text variant="moneySm" color={colors.textPrimary}>
            {(hydrationCurrent / 1000).toFixed(1)}L{' '}
            <Text variant="caption" color={colors.textMuted}>/ {(hydrationGoal / 1000).toFixed(1)}L</Text>
          </Text>

          <View style={styles.waterButtons}>
            <Button title="+ Vaso (250ml)" onPress={() => addWater(250)} variant="secondary" size="sm" fullWidth={false} />
            <Button title="+ Botella (500ml)" onPress={() => addWater(500)} variant="secondary" size="sm" fullWidth={false} />
          </View>
        </Card>

        {/* Temp + Body */}
        {temperature > 37.5 && (
          <Card variant="alert" style={styles.tempAlert}>
            <Text variant="bodySm" color={colors.red}>
              Temperatura elevada: {temperature}°C — Consultar con medico de turno
            </Text>
          </Card>
        )}

        {/* Medical Exams */}
        {nextExam && (
          <Card style={styles.examCard}>
            <View style={styles.examHeader}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" stroke={colors.copper} strokeWidth={1.5} />
                <Path d="M15 2H9a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke={colors.copper} strokeWidth={1.5} />
              </Svg>
              <Badge label="Proximo" variant="amber" />
            </View>
            <Text variant="h3" color={colors.textPrimary}>Examenes Medicos</Text>
            <Text variant="h2" color={colors.copper} style={styles.examDate}>
              {new Date(nextExam.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
            </Text>
            <Text variant="caption" color={colors.textSecondary} style={styles.examLocation}>
              {nextExam.location}
            </Text>

            {nextExam.preparation.length > 0 && (
              <>
                <Label color={colors.textMuted} style={styles.checklistTitle}>Checklist Previo</Label>
                <View style={styles.checklist}>
                  {nextExam.preparation.map((item, idx) => (
                    <View key={idx} style={styles.checkRow}>
                      <View style={styles.checkbox}>
                        <View style={styles.checkDot} />
                      </View>
                      <Text variant="bodySm" color={colors.textSecondary}>{item}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card>
        )}

        {/* Core Metrics */}
        <Label color={colors.textMuted} style={styles.sectionLabel}>Core Metrics</Label>
        <Card style={styles.metricsCard}>
          <MetricRow label="Heart Rate" value={`${metrics.heartRate}`} unit="BPM" color={colors.red} />
          <MetricRow label="Steps" value={`${(metrics.steps / 1000).toFixed(1)}k`} unit="Steps" color={colors.emerald} />
          <MetricRow label="Deep Sleep" value={`${metrics.deepSleep}h`} unit="Cycles" color={colors.purple} />
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

function MetricRow({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
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
  awayCard: {
    marginBottom: spacing.lg,
  },
  awayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  moodCard: {
    marginBottom: spacing.lg,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  moodItem: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.borderRadius.sm,
    minWidth: 52,
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  moodSelected: {
    backgroundColor: colors.copperMuted,
    borderWidth: 1,
    borderColor: colors.copper,
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
  waterButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  tempAlert: {
    marginBottom: spacing.lg,
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
    marginBottom: spacing.xs,
  },
  examLocation: {
    marginBottom: spacing.lg,
  },
  checklistTitle: {
    marginBottom: spacing.sm,
  },
  checklist: {
    gap: spacing.xs,
  },
  checkRow: {
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
  checkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
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
