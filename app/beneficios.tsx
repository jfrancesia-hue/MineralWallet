import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const categories = [
  { name: 'Farmacia', discount: '20%', color: colors.emerald },
  { name: 'Super', discount: '15%', color: colors.cyan },
  { name: 'Optica', discount: '10%', color: colors.copper },
  { name: 'Combustible', discount: '5%', color: colors.amber },
];

const nearbyBusinesses = [
  { name: 'Mercado Central Industrial', distance: '0.8 km', type: 'Alimentos' },
  { name: 'Viandas del Minero', distance: '1.2 km', type: 'Alimentos' },
  { name: 'Gimnasio El Risco', distance: '2.1 km', type: 'Deporte' },
];

const savingsHistory = [
  { store: 'Farmacity No...', amount: -1200, date: 'Oct 4' },
  { store: 'Shell Arroyo...', amount: -850, date: 'Oct 2' },
  { store: 'Carrefour Express', amount: -10520, date: 'Sep 30' },
];

export default function BeneficiosScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text variant="labelSm" color={colors.textMuted}>Programa de lealtad</Text>
            <Text variant="h1" color={colors.textPrimary}>Mis Beneficios</Text>
          </View>
        </View>

        {/* Savings Hero */}
        <Card variant="financial" style={styles.savingsHero}>
          <Text variant="labelSm" color={colors.textMuted}>Ahorro anual acumulado</Text>
          <MoneyText amount="47.800" variant="moneyLg" color={colors.copper} />
          <Text variant="caption" color={colors.textMuted}>ARS</Text>
        </Card>

        {/* Featured */}
        <Card style={styles.featuredCard}>
          <Badge label="Beneficio del mes" variant="copper" />
          <Text variant="h2" color={colors.textPrimary} style={styles.featuredTitle}>Turismo familiar</Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Beneficios hasta 35% en alojamientos de montana y excursiones exclusivas para trabajadores del sector.
          </Text>
          <Button title="Obtener cupon" onPress={() => {}} variant="primary" size="md" style={styles.featuredBtn} />
        </Card>

        {/* Categories */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Categorias Populares</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.name} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}15` }]}>
                <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              </View>
              <Text variant="bodySm" color={colors.textPrimary}>{cat.name}</Text>
              <Text variant="moneySm" color={cat.color}>{cat.discount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Comercios Cercanos</Text>
        {nearbyBusinesses.map((biz) => (
          <Card key={biz.name} style={styles.bizCard}>
            <View style={styles.bizRow}>
              <View style={styles.bizInfo}>
                <Text variant="bodySm" color={colors.textPrimary}>{biz.name}</Text>
                <Text variant="caption" color={colors.textMuted}>{biz.distance} · {biz.type}</Text>
              </View>
              <Badge label="Mostrar QR" variant="copper" />
            </View>
          </Card>
        ))}

        <View style={styles.activeBadge}>
          <Text variant="caption" color={colors.emerald}>→ 3 beneficios activos cerca de ti</Text>
        </View>

        {/* Savings History */}
        <View style={styles.historyHeader}>
          <Text variant="h3" color={colors.textPrimary}>Historial de Ahorros</Text>
          <TouchableOpacity><Text variant="caption" color={colors.copper}>Ver todo</Text></TouchableOpacity>
        </View>
        {savingsHistory.map((item, i) => (
          <Card key={i} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View>
                <Text variant="bodySm" color={colors.textPrimary}>{item.store}</Text>
                <Text variant="caption" color={colors.textMuted}>{item.date}</Text>
              </View>
              <MoneyText
                amount={Math.abs(item.amount).toLocaleString('es-AR')}
                variant="moneySm"
                prefix="-$"
                color={colors.textSecondary}
              />
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
  savingsHero: { marginBottom: spacing.lg, flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  featuredCard: { marginBottom: spacing.xl },
  featuredTitle: { marginVertical: spacing.sm },
  featuredBtn: { marginTop: spacing.md },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.lg },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  categoryCard: {
    width: '47%', backgroundColor: colors.surface, borderRadius: layout.borderRadius.md,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.copperMuted,
    alignItems: 'center', gap: spacing.sm,
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  categoryDot: { width: 12, height: 12, borderRadius: 6 },
  bizCard: { marginBottom: spacing.sm },
  bizRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bizInfo: { flex: 1, gap: 2 },
  activeBadge: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  historyCard: { marginBottom: spacing.sm },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
