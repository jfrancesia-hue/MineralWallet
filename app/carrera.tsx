import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text, Label, Card, Badge, Button, ProgressBar, SkeletonCard } from '../src/components/ui';
import { CourseCard } from '../src/components/cards';
import { useCareerStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function CarreraScreen() {
  const {
    level,
    nextLevel,
    xpCurrent,
    xpRequired,
    xpPercent,
    certificatesNeeded,
    certificates,
    courses,
    ranking,
    positionChange,
    completeModule,
    isLoading,
    fetchSummary,
  } = useCareerStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSummary(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

  const activeCert = certificates.find((c) => c.status === 'en_curso');
  const validCerts = certificates.filter((c) => c.status === 'vigente');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <Text variant="h1" color={colors.textPrimary}>Mi Carrera</Text>
        </View>

        {/* Level Card */}
        <Card variant="financial" style={styles.levelCard}>
          <Text variant="labelSm" color={colors.textMuted}>Nivel actual</Text>
          <Text variant="h1" color={colors.textPrimary}>{level}</Text>
          <View style={styles.xpRow}>
            <Text variant="moneySm" color={colors.copper}>{xpCurrent.toLocaleString('es-AR')}</Text>
            <Text variant="caption" color={colors.textMuted}> / {xpRequired.toLocaleString('es-AR')} XP</Text>
            <Text variant="caption" color={colors.copper} style={styles.xpPercent}> {xpPercent}%</Text>
          </View>
          <ProgressBar progress={xpPercent} color={colors.copper} height={6} style={styles.xpBar} />
          <View style={styles.upgradeNote}>
            <Text variant="caption" color={colors.textSecondary}>
              Te faltan {certificatesNeeded} certificaciones para ascender a {nextLevel}.
            </Text>
          </View>
        </Card>

        {/* Ranking */}
        <Card style={styles.rankingCard}>
          <View style={styles.rankingHeader}>
            <Text variant="h3" color={colors.textPrimary}>Ranking de tu mina</Text>
            {positionChange > 0 && (
              <Badge label={`+${positionChange} pos`} variant="emerald" />
            )}
          </View>
          {ranking.map((r) => (
            <View key={r.position} style={[styles.rankRow, r.isCurrentUser && styles.rankHighlight]}>
              <Text variant="moneySm" color={colors.textMuted}>{String(r.position).padStart(2, '0')}</Text>
              <Text variant="bodySm" color={r.isCurrentUser ? colors.copper : colors.textPrimary} style={styles.rankName}>
                {r.isCurrentUser ? 'TU' : r.name}
              </Text>
              <Text variant="moneySm" color={colors.copper}>
                {r.xp >= 1000 ? `${(r.xp / 1000).toFixed(1)}k` : r.xp} XP
              </Text>
            </View>
          ))}
        </Card>

        {/* Active Cert */}
        {activeCert && (
          <>
            <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Certificacion en Curso</Text>
            <Card variant="status" accentColor={colors.cyan} style={styles.activeCert}>
              <Text variant="h3" color={colors.textPrimary}>{activeCert.name}</Text>
              <View style={styles.certProgressRow}>
                <Text variant="labelSm" color={colors.textMuted}>Progreso actual</Text>
                <Text variant="moneyMd" color={colors.copper}>{activeCert.progress}%</Text>
              </View>
              <ProgressBar progress={activeCert.progress ?? 0} color={colors.cyan} height={6} />
              <Button title="Continuar curso" onPress={() => {
                if (activeCert) {
                  completeModule(activeCert.id);
                  Alert.alert('Modulo Completado', `Progreso actualizado a ${Math.min((activeCert.progress ?? 0) + 20, 100)}%`);
                }
              }} variant="primary" size="md" style={styles.certBtn} />
            </Card>
          </>
        )}

        {/* Catalog */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Catalogo de Capacitacion</Text>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

        {/* Certificates */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Billetera de Certificados</Text>
        {validCerts.map((cert) => (
          <Card key={cert.id} style={styles.certCard}>
            <Text variant="bodySm" color={colors.textPrimary}>{cert.name}</Text>
            <Text variant="labelSm" color={colors.textMuted}>{cert.issuedBy}</Text>
            <View style={styles.certFooter}>
              <Text variant="caption" color={colors.textMuted}>Emitido {cert.date}</Text>
              <TouchableOpacity onPress={() => Alert.alert('Certificado', `Descargando certificado: ${cert.name}`)}><Text variant="caption" color={colors.copper}>PDF</Text></TouchableOpacity>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing['2xl'] },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  levelCard: { marginBottom: spacing.lg },
  xpRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.md },
  xpPercent: { marginLeft: 'auto' },
  xpBar: { marginTop: spacing.sm },
  upgradeNote: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.elevated, borderRadius: layout.borderRadius.sm },
  rankingCard: { marginBottom: spacing.xl },
  rankingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.copperMuted },
  rankHighlight: { backgroundColor: `${colors.copper}08`, borderRadius: layout.borderRadius.sm, paddingHorizontal: spacing.sm },
  rankName: { flex: 1, marginLeft: spacing.md },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.lg },
  activeCert: { marginBottom: spacing.xl },
  certProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: spacing.sm },
  certBtn: { marginTop: spacing.md },
  certCard: { marginBottom: spacing.sm, gap: spacing.xs },
  certFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
});
