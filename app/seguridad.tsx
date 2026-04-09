import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Label, Card, Badge, Button, StatusDot } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const eppItems = [
  { name: 'Casco de Seguridad', status: 'Vigente', date: 'Rev 05/24', color: colors.emerald },
  { name: 'Botas Dielectricas', status: 'Vigente', date: 'Rev 01/24', color: colors.emerald },
  { name: 'Guantes de Cuero', status: 'Vence pronto', date: '', color: colors.amber },
  { name: 'Respirador N95', status: 'No requerido', date: '', color: colors.textMuted },
];

const courses = [
  { name: 'Primeros Auxilios en Socavon', progress: 60, status: 'En curso' },
];

export default function SeguridadScreen() {
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
          <View style={styles.headerText}>
            <Text variant="labelSm" color={colors.textMuted}>Protocolo de Seguridad v4.2</Text>
            <Text variant="h1" color={colors.textPrimary}>Mi Seguridad</Text>
          </View>
          <View style={styles.scoreHeader}>
            <Text variant="labelSm" color={colors.textMuted}>Safety Score</Text>
            <Text variant="moneyMd" color={colors.emerald}>94<Text variant="caption" color={colors.textMuted}>/100</Text></Text>
          </View>
        </View>

        {/* SOS Quick Access */}
        <Card variant="alert" style={styles.sosCard}>
          <Text variant="h3" color={colors.textPrimary}>SOS Acceso Rapido</Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Active este protocolo solo en caso de riesgo inminente. El equipo de rescate sera notificado de su posicion GPS exacta.
          </Text>
          <Button
            title="⚠ Emergencia - SOS"
            onPress={() => router.push('/(tabs)/sos')}
            variant="danger"
            size="lg"
            style={styles.sosBtn}
          />
        </Card>

        {/* Safety Score Gauge */}
        <Card style={styles.gaugeCard}>
          <View style={styles.gaugeCenter}>
            <View style={styles.gaugeCircle}>
              <Text variant="balance" color={colors.emerald}>94</Text>
              <Text variant="caption" color={colors.textMuted}>%</Text>
            </View>
            <Text variant="labelSm" color={colors.emerald}>Nivel Optimo</Text>
          </View>
          <Text variant="caption" color={colors.textMuted} align="center" style={styles.gaugeSubtitle}>
            Historial libre de incidentes
          </Text>
          <Text variant="micro" color={colors.textMuted} align="center">
            Ultima actualizacion: hace 4h
          </Text>
        </Card>

        {/* EPP */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" color={colors.textPrimary}>Mi EPP</Text>
          <Badge label="Vigente" variant="emerald" />
        </View>
        {eppItems.map((item) => (
          <Card key={item.name} style={styles.eppCard}>
            <View style={styles.eppRow}>
              <StatusDot status={item.color === colors.emerald ? 'online' : item.color === colors.amber ? 'warning' : 'rest'} size={8} pulse={item.color === colors.amber} />
              <View style={styles.eppText}>
                <Text variant="bodySm" color={colors.textPrimary}>{item.name}</Text>
                <Text variant="caption" color={item.color}>{item.status}</Text>
              </View>
              {item.date ? <Text variant="labelSm" color={colors.textMuted}>{item.date}</Text> : null}
            </View>
          </Card>
        ))}

        {/* Capacitaciones */}
        <View style={styles.sectionHeader}>
          <Text variant="h3" color={colors.textPrimary}>Capacitaciones</Text>
          <Text variant="moneyMd" color={colors.textPrimary}>12<Text variant="caption" color={colors.textMuted}>/15</Text></Text>
        </View>
        <View style={styles.capProgress}>
          <View style={styles.capProgressBar}>
            <View style={[styles.capProgressFill, { width: '80%' }]} />
          </View>
          <Text variant="caption" color={colors.textMuted}>80% del programa anual completado</Text>
        </View>

        {courses.map((c) => (
          <Card key={c.name} style={styles.courseCard}>
            <Badge label={c.status} variant="cyan" />
            <Text variant="h3" color={colors.textPrimary} style={styles.courseTitle}>{c.name}</Text>
            <View style={styles.courseProgress}>
              <Text variant="labelSm" color={colors.textMuted}>Progreso actual</Text>
              <Text variant="moneyMd" color={colors.copper}>{c.progress}%</Text>
            </View>
            <Button title="Continuar curso" onPress={() => {}} variant="primary" size="md" />
          </Card>
        ))}

        {/* Charla del dia */}
        <Card style={styles.charlaCard}>
          <Text variant="labelSm" color={colors.textMuted}>Contenido del dia</Text>
          <Text variant="h3" color={colors.textPrimary} style={styles.charlaTitle}>
            Charla de 5 Minutos: Riesgos electricos
          </Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Obligatorio visualizar antes de iniciar el turno de la tarde.
          </Text>
          <Button title="▶ Ver charla" onPress={() => {}} variant="secondary" size="md" style={styles.charlaBtn} />
        </Card>

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
    width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.emerald,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 2,
  },
  gaugeSubtitle: { marginTop: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.lg },
  eppCard: { marginBottom: spacing.sm },
  eppRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  eppText: { flex: 1, gap: 2 },
  capProgress: { marginBottom: spacing.lg },
  capProgressBar: { height: 6, backgroundColor: colors.elevated, borderRadius: 3, overflow: 'hidden', marginBottom: spacing.sm },
  capProgressFill: { height: '100%', backgroundColor: colors.copper, borderRadius: 3 },
  courseCard: { marginBottom: spacing.lg },
  courseTitle: { marginTop: spacing.sm, marginBottom: spacing.md },
  courseProgress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  charlaCard: { marginBottom: spacing.lg },
  charlaTitle: { marginVertical: spacing.sm },
  charlaBtn: { marginTop: spacing.md },
});
