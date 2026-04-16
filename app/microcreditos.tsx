import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button, ProgressBar } from '../src/components/ui';
import { SliderInput } from '../src/components/forms';
import { useWalletStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const plazos = [3, 6, 9, 12, 18, 24];

export default function MicrocreditosScreen() {
  const creditScore = useWalletStore((s) => s.creditScore);
  const activeLoans = useWalletStore((s) => s.activeLoans);
  const [monto, setMonto] = useState(150000);
  const [plazo, setPlazo] = useState(6);
  const [tab, setTab] = useState<'simular' | 'creditos'>('simular');

  const cuota = Math.round(monto * 1.42 / plazo);

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
            <Text variant="labelSm" color={colors.copper}>Credito Instantaneo</Text>
            <Text variant="h1" color={colors.textPrimary}>Microcreditos</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab === 'simular' && styles.tabActive]} onPress={() => setTab('simular')}>
            <Text variant="buttonSm" color={tab === 'simular' ? colors.copper : colors.textMuted}>Simular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'creditos' && styles.tabActive]} onPress={() => setTab('creditos')}>
            <Text variant="buttonSm" color={tab === 'creditos' ? colors.copper : colors.textMuted}>Mis Creditos</Text>
          </TouchableOpacity>
        </View>

        {tab === 'simular' ? (
          <>
            {/* Amount */}
            <Card variant="financial" style={styles.amountCard}>
              <Text variant="labelSm" color={colors.textMuted}>Monto a solicitar</Text>
              <SliderInput
                value={monto}
                min={10000}
                max={500000}
                step={10000}
                onValueChange={setMonto}
                accentColor={colors.copper}
              />
            </Card>

            {/* Plazo */}
            <Text variant="label" color={colors.textMuted} style={styles.plazoLabel}>Plazo de pago (meses)</Text>
            <View style={styles.plazoGrid}>
              {plazos.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.plazoPill, p === plazo && styles.plazoPillActive]}
                  onPress={() => setPlazo(p)}
                >
                  <Text variant="h3" color={p === plazo ? colors.background : colors.textSecondary}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Results */}
            <Card variant="financial" style={styles.resultsCard}>
              <View style={styles.resultRow}>
                <View>
                  <Text variant="label" color={colors.textMuted}>Cuota Mensual</Text>
                  <MoneyText amount={cuota.toLocaleString('es-AR')} variant="moneyLg" color={colors.textPrimary} />
                </View>
                <View style={styles.resultRight}>
                  <Text variant="label" color={colors.textMuted}>Tasa Efectiva</Text>
                  <Text variant="moneyMd" color={colors.textPrimary}>42<Text variant="caption" color={colors.textMuted}>%</Text></Text>
                </View>
              </View>

              <View style={styles.scoreSection}>
                <Text variant="labelSm" color={colors.textMuted}>Mining Credit Score</Text>
                <View style={styles.scoreRow}>
                  <Text variant="moneyMd" color={creditScore >= 80 ? colors.emerald : colors.amber}>{creditScore}</Text>
                  <Text variant="caption" color={colors.textMuted}> / 100</Text>
                </View>
                <ProgressBar progress={creditScore} color={creditScore >= 80 ? colors.emerald : colors.amber} height={6} style={styles.scoreBar} />
              </View>
            </Card>

            <Button title="Solicitar Credito" onPress={() => {}} variant="primary" size="lg" />
            <Text variant="micro" color={colors.textMuted} align="center" style={styles.disclaimer}>
              Sujeto a aprobacion crediticia. El otorgamiento del microcredito se basa en el volumen de extraccion y scoring de cumplimiento en la plataforma Mineral Wallet.
            </Text>
          </>
        ) : (
          <>
            {/* Active Loans */}
            <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>Prestamos Activos</Text>
            {activeLoans.length === 0 ? (
              <Card style={styles.loanCard}>
                <Text variant="body" color={colors.textMuted} align="center">Sin prestamos activos</Text>
              </Card>
            ) : (
              activeLoans.map((loan) => {
                const paidPercent = loan.total > 0 ? Math.round((loan.paid / loan.total) * 100) : 0;
                return (
                  <Card key={loan.id} variant="financial" style={styles.loanCard}>
                    <View style={styles.loanHeader}>
                      <Text variant="h3" color={colors.textPrimary}>{loan.name}</Text>
                      <Badge label="Al dia" variant="emerald" />
                    </View>
                    <Text variant="labelSm" color={colors.textMuted}>Cuota: ${loan.cuota.toLocaleString('es-AR')} · Prox: {loan.nextDate}</Text>
                    <View style={styles.loanProgress}>
                      <View style={styles.loanProgressRow}>
                        <Text variant="caption" color={colors.textMuted}>Pagado: ${loan.paid.toLocaleString('es-AR')}</Text>
                        <Text variant="caption" color={colors.textMuted}>Total: ${loan.total.toLocaleString('es-AR')}</Text>
                      </View>
                      <ProgressBar progress={paidPercent} color={colors.cyan} height={6} />
                    </View>
                  </Card>
                );
              })
            )}
          </>
        )}

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
  tabs: { flexDirection: 'row', marginBottom: spacing.xl },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.copperMuted },
  tabActive: { borderBottomColor: colors.copper },
  amountCard: { marginBottom: spacing.xl },
  plazoLabel: { marginBottom: spacing.md },
  plazoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  plazoPill: {
    width: '30%', paddingVertical: spacing.lg, alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.sm,
    minHeight: layout.touchTarget, justifyContent: 'center',
  },
  plazoPillActive: { backgroundColor: colors.copper, borderColor: colors.copper },
  resultsCard: { marginBottom: spacing.xl },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resultRight: { alignItems: 'flex-end' },
  scoreSection: { marginTop: spacing.xl, paddingTop: spacing.lg, },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: spacing.sm },
  scoreBar: { marginTop: spacing.sm },
  disclaimer: { marginTop: spacing.lg },
  sectionLabel: { marginBottom: spacing.md },
  loanCard: { marginBottom: spacing.lg },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  loanProgress: { marginTop: spacing.md },
  loanProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  loanBar: { height: 6, backgroundColor: colors.elevated, borderRadius: 3, overflow: 'hidden' },
  loanBarFill: { height: '100%', backgroundColor: colors.cyan, borderRadius: 3 },
});
