import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button, SkeletonCard } from '../src/components/ui';
import { BenefitCard } from '../src/components/cards';
import { useBenefitsStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function BeneficiosScreen() {
  const {
    totalSavingsYear,
    categories,
    featuredBenefit,
    nearbyBusinesses,
    savingsHistory,
    activeBenefitsCount,
    isLoading,
    fetchSummary,
  } = useBenefitsStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchSummary(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, [fetchSummary]);

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
          <View>
            <Text variant="labelSm" color={colors.textMuted}>Programa de lealtad</Text>
            <Text variant="h1" color={colors.textPrimary}>Mis Beneficios</Text>
          </View>
        </View>

        {/* Savings Hero */}
        <Card variant="financial" style={styles.savingsHero}>
          <Text variant="labelSm" color={colors.textMuted}>Ahorro anual acumulado</Text>
          <MoneyText amount={totalSavingsYear} variant="moneyLg" color={colors.copper} />
        </Card>

        {/* Featured */}
        {featuredBenefit && (
          <Card style={styles.featuredCard}>
            <Badge label="Beneficio del mes" variant="copper" />
            <Text variant="h2" color={colors.textPrimary} style={styles.featuredTitle}>
              {featuredBenefit.title}
            </Text>
            <Text variant="bodySm" color={colors.textSecondary}>
              {featuredBenefit.description}
            </Text>
            <Text variant="caption" color={colors.copper} style={styles.featuredMax}>
              Hasta ${featuredBenefit.maxAmount.toLocaleString('es-AR')}
            </Text>
            <Button title="Obtener cupon" onPress={() => {
              Alert.alert(
                'Cupon Generado!',
                `Codigo: MW-${Date.now().toString(36).toUpperCase()}\n\nMostra este codigo en el comercio para obtener tu descuento.`,
                [{ text: 'Copiar y Cerrar' }]
              );
            }} variant="primary" size="md" style={styles.featuredBtn} />
          </Card>
        )}

        {/* Categories */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Categorias Populares</Text>
        <View style={styles.categoriesGrid}>
          {categories.slice(0, 4).map((cat) => (
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
          <BenefitCard key={biz.id} business={biz} />
        ))}
        <View style={styles.activeBadge}>
          <Text variant="caption" color={colors.emerald}>
            {activeBenefitsCount} beneficios activos cerca de ti
          </Text>
        </View>

        {/* Savings History */}
        <View style={styles.historyHeader}>
          <Text variant="h3" color={colors.textPrimary}>Historial de Ahorros</Text>
          <TouchableOpacity><Text variant="caption" color={colors.copper}>Ver todo</Text></TouchableOpacity>
        </View>
        {savingsHistory.map((item) => (
          <Card key={item.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View>
                <Text variant="bodySm" color={colors.textPrimary}>{item.store}</Text>
                <Text variant="caption" color={colors.textMuted}>{item.date} · {item.category}</Text>
              </View>
              <MoneyText amount={item.amount} variant="moneySm" prefix="-$" color={colors.textSecondary} />
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
  savingsHero: { marginBottom: spacing.lg },
  featuredCard: { marginBottom: spacing.xl },
  featuredTitle: { marginVertical: spacing.sm },
  featuredMax: { marginTop: spacing.xs },
  featuredBtn: { marginTop: spacing.md },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.lg },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  categoryCard: {
    width: '47%', backgroundColor: colors.surface, borderRadius: layout.borderRadius.md,
    padding: spacing.lg, 
    alignItems: 'center', gap: spacing.sm,
  },
  categoryIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  categoryDot: { width: 12, height: 12, borderRadius: 6 },
  activeBadge: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  historyCard: { marginBottom: spacing.sm },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
