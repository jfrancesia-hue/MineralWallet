import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { useWalletStore } from '../src/stores';
import { useWallet } from '../src/hooks';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const faqs = [
  'Que es USDT?',
  'Es seguro operar?',
  'Respaldo y Auditorias',
];

const operations = [
  { type: 'Compra USDT', date: '24 Oct, 2023 14:26', amount: '+ 150.00 USDT', sub: '$150.000 ARS', positive: true },
  { type: 'Venta a Pesos', date: '18 Oct, 2023 09:12', amount: '- 50.00 USDT', sub: '$49.500 ARS', positive: false },
];

export default function ResguardoUSDTScreen() {
  const usdtBalance = useWalletStore((s) => s.usdtBalance);
  const usdtRate = useWalletStore((s) => s.usdtRate);
  const arsEquivalent = usdtBalance * usdtRate;
  const { buyUSDT, sellUSDT } = useWallet();
  const [arsAmount, setArsAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');

  const handleBuyUSDT = async () => {
    const parsed = parseFloat(arsAmount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Monto inválido', 'Ingresá un monto en ARS válido.');
      return;
    }
    try {
      await buyUSDT(parsed);
      Alert.alert('Compra exitosa', `Compraste USDT con $${parsed.toLocaleString('es-AR')} ARS.`);
      setArsAmount('');
    } catch {
      Alert.alert('Error', 'No se pudo completar la compra. Intentá de nuevo.');
    }
  };

  const handleSellUSDT = async () => {
    const parsed = parseFloat(usdtAmount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Monto inválido', 'Ingresá un monto en USDT válido.');
      return;
    }
    try {
      await sellUSDT(parsed);
      Alert.alert('Venta exitosa', `Vendiste ${parsed.toFixed(2)} USDT a pesos.`);
      setUsdtAmount('');
    } catch {
      Alert.alert('Error', 'No se pudo completar la venta. Intentá de nuevo.');
    }
  };
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
            <Text variant="labelSm" color={colors.textMuted}>Stablecoin Protocol</Text>
            <Text variant="h1" color={colors.copper}>Resguardo de Valor</Text>
          </View>
        </View>

        {/* Balance Hero */}
        <Card variant="financial" style={styles.balanceCard}>
          <Text variant="labelSm" color={colors.textMuted}>Balance protegido</Text>
          <View style={styles.balanceRow}>
            <Text variant="balance" color={colors.cyan}>{usdtBalance.toFixed(2)}</Text>
            <Text variant="h3" color={colors.cyan}> USDT</Text>
          </View>
          <Text variant="caption" color={colors.textMuted}>≈ ${arsEquivalent.toLocaleString('es-AR')} ARS</Text>
        </Card>

        {/* Chart placeholder */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text variant="h3" color={colors.textPrimary}>USDT / ARS</Text>
            <View style={styles.chartPeriods}>
              {['1D', '1M', '1A'].map((p, i) => (
                <TouchableOpacity key={p} style={[styles.periodPill, i === 1 && styles.periodActive]}>
                  <Text variant="labelSm" color={i === 1 ? colors.background : colors.textMuted}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text variant="bodySm" color={colors.emerald}>↗ +2.4% vs Mes anterior</Text>
          {/* Chart placeholder */}
          <View style={styles.chartPlaceholder}>
            <Svg width="100%" height={120} viewBox="0 0 300 120" fill="none">
              <Path d="M0 100 Q75 80 150 60 Q225 40 300 20" stroke={colors.cyan} strokeWidth={2} fill="none" />
            </Svg>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button title="Comprar USDT" onPress={handleBuyUSDT} variant="primary" size="lg" style={styles.actionBtn} />
          <Button title="Vender a Pesos" onPress={handleSellUSDT} variant="secondary" size="lg" style={styles.actionBtn} />
        </View>

        {/* Operations */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Historial de Operaciones</Text>
        {operations.map((op, i) => (
          <Card key={i} style={styles.opCard}>
            <View style={styles.opRow}>
              <View style={[styles.opIcon, { backgroundColor: op.positive ? colors.emeraldMuted : colors.redMuted }]}>
                <Text variant="caption" color={op.positive ? colors.emerald : colors.red}>
                  {op.positive ? '↙' : '↗'}
                </Text>
              </View>
              <View style={styles.opInfo}>
                <Text variant="bodySm" color={colors.textPrimary}>{op.type}</Text>
                <Text variant="micro" color={colors.textMuted}>{op.date}</Text>
              </View>
              <View style={styles.opAmount}>
                <Text variant="moneySm" color={op.positive ? colors.emerald : colors.red}>{op.amount}</Text>
                <Text variant="micro" color={colors.textMuted}>{op.sub}</Text>
              </View>
            </View>
          </Card>
        ))}

        {/* Calculator */}
        <Card style={styles.calcCard}>
          <Text variant="h3" color={colors.textPrimary}>Calculadora</Text>
          <View style={styles.calcRow}>
            <View style={styles.calcInput}>
              <Text variant="labelSm" color={colors.textMuted}>Tu entregas</Text>
              <View style={styles.calcField}>
                <TextInput style={styles.calcValue} placeholder="0.00" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={arsAmount} onChangeText={setArsAmount} />
                <Text variant="buttonSm" color={colors.textSecondary}>ARS</Text>
              </View>
            </View>
            <View style={styles.calcSwap}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
            </View>
            <View style={styles.calcInput}>
              <Text variant="labelSm" color={colors.textMuted}>Tu recibes</Text>
              <View style={styles.calcField}>
                <TextInput style={styles.calcValue} placeholder="0.00" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={usdtAmount} onChangeText={setUsdtAmount} />
                <Text variant="buttonSm" color={colors.textSecondary}>USDT</Text>
              </View>
            </View>
          </View>
          <Text variant="caption" color={colors.textMuted} align="center" style={styles.rate}>
            Tipo de cambio: 1 USDT = {usdtRate.toLocaleString('es-AR')} ARS
          </Text>
        </Card>

        {/* Education */}
        <Text variant="h3" color={colors.textPrimary} style={styles.sectionTitle}>Centro de Aprendizaje</Text>
        {faqs.map((faq) => (
          <TouchableOpacity key={faq} style={styles.faqItem}>
            <Text variant="bodySm" color={colors.textPrimary}>{faq}</Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9l6 6 6-6" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        ))}

        {/* Referral */}
        <Card style={styles.referralCard}>
          <Text variant="h3" color={colors.copper}>Referidos Mineral</Text>
          <Text variant="bodySm" color={colors.textSecondary}>
            Gana 5 USDT por cada minero que se sume a la red.
          </Text>
          <Text variant="buttonSm" color={colors.red} style={styles.referralCta}>Invitar ahora</Text>
        </Card>

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
  balanceCard: { marginBottom: spacing.lg },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: spacing.sm },
  chartCard: { marginBottom: spacing.lg },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  chartPeriods: { flexDirection: 'row', gap: spacing.xs },
  periodPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: layout.borderRadius.sm },
  periodActive: { backgroundColor: colors.cyan },
  chartPlaceholder: { marginTop: spacing.md },
  actionsRow: { gap: spacing.sm, marginBottom: spacing.xl },
  actionBtn: {},
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.lg },
  opCard: { marginBottom: spacing.sm },
  opRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  opIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  opInfo: { flex: 1, gap: 2 },
  opAmount: { alignItems: 'flex-end', gap: 2 },
  calcCard: { marginBottom: spacing.xl },
  calcRow: { flexDirection: 'column', gap: spacing.md, marginTop: spacing.md },
  calcInput: { gap: spacing.sm },
  calcField: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.elevated, borderRadius: layout.borderRadius.sm, paddingHorizontal: spacing.lg, height: layout.touchTarget },
  calcValue: { flex: 1, fontFamily: 'JetBrainsMono_400Regular', fontSize: 18, color: colors.textPrimary },
  calcSwap: { alignSelf: 'center' },
  rate: { marginTop: spacing.md },
  faqItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.lg, 
    minHeight: layout.touchTarget,
  },
  referralCard: { marginTop: spacing.lg, gap: spacing.sm },
  referralCta: { marginTop: spacing.sm },
});
