import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text, Label, Card, Badge, Button, StatusDot, ProgressBar, SkeletonCard } from '../src/components/ui';
import { EPPCard } from '../src/components/cards';
import { useSafetyStore, useWorkStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function SeguridadScreen() {
  const {
    safetyScore,
    incidentCount,
    consecutiveTalks,
    eppCompliancePercent,
    completedCourses,
    totalCourses,
    todayTalk,
    completeTalk,
    isLoading,
    fetchSummary,
  } = useSafetyStore();
  const eppItems = useWorkStore((s) => s.eppItems);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSummary(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  const coursesPercent = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

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
          <View style={styles.headerText}>
            <Text variant="labelSm" color={colors.textMuted}>Protocolo de Seguridad v4.2</Text>
            <Text variant="h1" color={colors.textPrimary}>Mi Seguridad</Text>
          </View>
          <View style={styles.scoreHeader}>
            <Text variant="labelSm" color={colors.textMuted}>Safety Score</Text>
            <Text variant="moneyMd" color={safetyScore >= 80 ? colors.emerald : colors.amber}>
              {safetyScore}<Text variant="caption" color={colors.textMuted}>/100</Text>
            </Text>
          </View>
        </View>

        {/* SOS Quick Access */}
        <Card variant="alert" style={styles.sosCard}>
          <Text variant="h3" color={colors.textPrimary}>SOS Acceso Rapido</Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Active este protocolo solo en caso de riesgo inminente.
          </Text>
          <Button
            title="Emergencia - SOS"
            onPress={() => router.push('/(tabs)/sos')}
            variant="danger"
            size="lg"
            style={styles.sosBtn}
          />
        </Card>

        {/* Safety Score Gauge */}
        <Card style={styles.gaugeCard}>
          <View style={styles.gaugeCenter}>
            <View style={[styles.gaugeCircle, { borderColor: safetyScore >= 80 ? colors.emerald : colors.amber }]}>
              <Text variant="balance" color={safetyScore >= 80 ? colors.emerald : colors.amber}>{safetyScore}</Text>
              <Text variant="caption" color={colors.textMuted}>%</Text>
            </View>
            <Text variant="labelSm" color={safetyScore >= 80 ? colors.emerald : colors.amber}>
              {safetyScore >= 90 ? 'Nivel Optimo' : safetyScore >= 70 ? 'Nivel Bueno' : 'Atencion'}
            </Text>
          </View>
          <Text variant="caption" color={colors.textMuted} align="center" style={styles.gaugeSubtitle}>
            {incidentCount === 0 ? 'Historial libre de incidentes' : `${incidentCount} incidente(s) registrado(s)`}
          </Text>
          <Text variant="micro" color={colors.textMuted} align="center">
            {consecutiveTalks} charlas consecutivas completadas
          </Text>
        </Card>

        {/* EPP */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" color={colors.textPrimary}>Mi EPP</Text>
          <Badge
            label={`${eppCompliancePercent}% cumplimiento`}
            variant={eppCompliancePercent >= 80 ? 'emerald' : 'amber'}
          />
        </View>
        {eppItems.map((item) => (
          <EPPCard key={item.id} item={item} />
        ))}

        {/* Capacitaciones */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" color={colors.textPrimary}>Capacitaciones</Text>
          <Text variant="moneyMd" color={colors.textPrimary}>
            {completedCourses}<Text variant="caption" color={colors.textMuted}>/{totalCourses}</Text>
          </Text>
        </View>
        <View style={styles.capProgress}>
          <ProgressBar progress={coursesPercent} color={colors.copper} height={6} />
          <Text variant="caption" color={colors.textMuted}>
            {coursesPercent}% del programa anual completado
          </Text>
        </View>

        {/* Charla del dia */}
        {todayTalk && (
          <Card style={styles.charlaCard}>
            <Badge label={todayTalk.completed ? 'Completada' : 'Pendiente'} variant={todayTalk.completed ? 'emerald' : 'amber'} />
            <Text variant="h3" color={colors.textPrimary} style={styles.charlaTitle}>
              Charla de {todayTalk.duration}: {todayTalk.title}
            </Text>
            {!todayTalk.completed && (
              <Button
                title="Completar charla"
                onPress={() => completeTalk(todayTalk.id)}
                variant="primary"
                size="md"
              />
            )}
          </Card>
        )}

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing['2xl'] },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  headerText: { flex: 1, gap: 2 },
  scoreHeader: { alignItems: 'flex-end' },
  sosCard: { marginBottom: spacing.lg },
  sosBtn: { marginTop: spacing.md },
  gaugeCard: { marginBottom: spacing.xl, alignItems: 'center', paddingVertical: spacing['2xl'] },
  gaugeCenter: { alignItems: 'center', gap: spacing.sm },
  gaugeCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 2,
  },
  gaugeSubtitle: { marginTop: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.lg },
  capProgress: { marginBottom: spacing.lg, gap: spacing.sm },
  charlaCard: { marginBottom: spacing.lg },
  charlaTitle: { marginVertical: spacing.sm },
});
