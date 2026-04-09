import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Label, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const ranking = [
  { pos: '05', name: 'Carlos R.', xp: '4.1k XP' },
  { pos: '06', name: 'Elena M.', xp: '3.8k XP' },
  { pos: '07', name: 'TU (USER)', xp: '2.4k XP', highlight: true },
  { pos: '08', name: 'Javier S.', xp: '2.2k XP' },
];

const catalogTabs = ['Obligatorios', 'Recomendados'];
const catalogCourses = [
  { name: 'Seguridad en Excavacion Profunda', hours: '8 horas', xp: '+400 XP', validity: '2 anos' },
  { name: 'Mantenimiento Predictivo 4.0', hours: '12 horas', xp: '+300 XP', validity: '1 ano' },
  { name: 'Protocolo de Primeros Auxilios', hours: '4 horas', xp: '+150 XP', validity: '3 anos' },
];

const certificates = [
  { name: 'Operacion de Dumper CAT 797', id: 'CERT-00521-2021', date: '12 Oct 2023' },
  { name: 'Induccion General de Mina', id: 'CERT-16291-2022', date: '05 Ene 2022' },
];

export default function CarreraScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
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
          <Text variant="h1" color={colors.textPrimary}>Operador Senior A</Text>
          <View style={styles.xpRow}>
            <Text variant="moneySm" color={colors.copper}>2400</Text>
            <Text variant="caption" color={colors.textMuted}> / 3000 XP</Text>
            <Text variant="caption" color={colors.copper} style={styles.xpPercent}> 80% completo</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: '80%' }]} />
          </View>
          <View style={styles.upgradeNote}>
            <Text variant="caption" color={colors.textSecondary}>
              Te faltan 2 certificaciones para ascender a Supervisor Junior.
            </Text>
          </View>
        </Card>

        {/* Ranking */}
        <Card style={styles.rankingCard}>
          <View style={styles.rankingHeader}>
            <Text variant="h3" color={colors.textPrimary}>Ranking de tu mina</Text>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M18 20V10M12 20V4M6 20v-6" stroke={colors.copper} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </View>
          {ranking.map((r) => (
            <View key={r.pos} style={[styles.rankRow, r.highlight && styles.rankHighlight]}>
              <Text variant="moneySm" color={colors.textMuted}>{r.pos}</Text>
              <Text variant="bodySm" color={r.highlight ? colors.copper : colors.textPrimary} style={styles.rankName}>
                {r.name}
              </Text>
              <Text variant="moneySm" color={colors.copper}>{r.xp}</Text>
            </View>
          ))}
        </Card>

        {/* Active Cert */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Certificacion en Curso</Text>
        <Card variant="status" accentColor={colors.cyan} style={styles.activeCert}>
          <Text variant="h3" color={colors.textPrimary}>Trabajo en Altura</Text>
          <Text variant="caption" color={colors.textSecondary}>Nivel Avanzado - Modulo 3 de 5</Text>
          <Button title="Continuar curso" onPress={() => {}} variant="primary" size="md" style={styles.certBtn} />
          <View style={styles.certProgress}>
            <Text variant="labelSm" color={colors.textMuted}>Progreso actual</Text>
            <Text variant="moneyMd" color={colors.copper}>60%</Text>
          </View>
        </Card>

        {/* Catalog */}
        <View style={styles.catalogHeader}>
          <Text variant="h3" color={colors.textPrimary}>Catalogo de Capacitacion</Text>
          <View style={styles.catalogTabs}>
            {catalogTabs.map((tab, i) => (
              <TouchableOpacity key={tab} style={[styles.catalogTab, i === 0 && styles.catalogTabActive]}>
                <Text variant="buttonSm" color={i === 0 ? colors.copper : colors.textMuted}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {catalogCourses.map((course) => (
          <Card key={course.name} style={styles.catalogCard} onPress={() => {}}>
            <View style={styles.catalogRow}>
              <View style={styles.catalogInfo}>
                <Text variant="bodySm" color={colors.textPrimary}>{course.name}</Text>
                <Text variant="caption" color={colors.textMuted}>
                  {course.hours} · Validez {course.validity}
                </Text>
              </View>
              <Badge label={course.xp} variant="copper" />
            </View>
          </Card>
        ))}

        {/* Certificates */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Billetera de Certificados</Text>
        {certificates.map((cert) => (
          <Card key={cert.id} style={styles.certCard}>
            <Text variant="bodySm" color={colors.textPrimary}>{cert.name}</Text>
            <Text variant="labelSm" color={colors.textMuted}>{cert.id}</Text>
            <View style={styles.certFooter}>
              <Text variant="caption" color={colors.textMuted}>Emitido {cert.date}</Text>
              <View style={styles.certActions}>
                <TouchableOpacity><Text variant="caption" color={colors.cyan}>↓</Text></TouchableOpacity>
                <TouchableOpacity><Text variant="caption" color={colors.copper}>PDF</Text></TouchableOpacity>
              </View>
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
  xpBar: { height: 6, backgroundColor: colors.elevated, borderRadius: 3, overflow: 'hidden', marginTop: spacing.sm },
  xpFill: { height: '100%', backgroundColor: colors.copper, borderRadius: 3 },
  upgradeNote: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.elevated, borderRadius: layout.borderRadius.sm },
  rankingCard: { marginBottom: spacing.xl },
  rankingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.copperMuted },
  rankHighlight: { backgroundColor: `${colors.copper}08`, borderRadius: layout.borderRadius.sm, paddingHorizontal: spacing.sm },
  rankName: { flex: 1, marginLeft: spacing.md },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.lg },
  activeCert: { marginBottom: spacing.xl },
  certBtn: { marginTop: spacing.md },
  certProgress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  catalogHeader: { marginBottom: spacing.md },
  catalogTabs: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  catalogTab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  catalogTabActive: { borderBottomWidth: 2, borderBottomColor: colors.copper },
  catalogCard: { marginBottom: spacing.sm },
  catalogRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catalogInfo: { flex: 1, gap: 2 },
  certCard: { marginBottom: spacing.sm, gap: spacing.xs },
  certFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  certActions: { flexDirection: 'row', gap: spacing.lg },
});
