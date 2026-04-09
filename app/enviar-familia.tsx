import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const familyMembers = [
  { id: '1', name: 'Maria', role: 'Esposa', lastSent: 'Hace 3 dias', totalYear: '$8.5k' },
  { id: '2', name: 'Mama', role: 'Mama', lastSent: 'Hace 14 dias', totalYear: '$4.2k' },
  { id: '3', name: 'Hermano', role: 'Hermano', lastSent: 'Hace 28 dias', totalYear: '$1.5k' },
];

const remittanceHistory = [
  { to: 'Maria', amount: 1200, date: '12 Oct, 2023', status: 'Exitoso' },
  { to: 'Mama', amount: 800, date: '01 Oct, 2023', status: 'Exitoso' },
];

export default function EnviarFamiliaScreen() {
  const [autoSend, setAutoSend] = useState(true);
  const [amount, setAmount] = useState('');

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
            <Text variant="labelSm" color={colors.red}>♥ Familia Unida</Text>
            <Text variant="h1" color={colors.textPrimary}>Enviar a Familia</Text>
          </View>
        </View>

        {/* Hero */}
        <Card variant="financial" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text variant="h3" color={colors.textPrimary}>Sos el sustento de 3 personas</Text>
              <Text variant="bodySm" color={colors.textSecondary}>
                Tus envios mensuales mantienen el hogar activo.
              </Text>
            </View>
            <View style={styles.heroStat}>
              <Text variant="moneyMd" color={colors.copper}>14.2</Text>
              <Text variant="labelSm" color={colors.textMuted}>ETH</Text>
              <Text variant="micro" color={colors.textMuted}>Total enviado 2024</Text>
            </View>
          </View>
        </Card>

        {/* Quick Amount */}
        <Card style={styles.amountCard}>
          <Text variant="labelSm" color={colors.textMuted}>Monto a enviar</Text>
          <View style={styles.amountInputRow}>
            <Text variant="h1" color={colors.textPrimary}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.quickAmounts}>
            {['$50', '$100', '$500', 'Max'].map((q) => (
              <TouchableOpacity key={q} style={styles.quickPill}>
                <Text variant="buttonSm" color={colors.textPrimary}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Auto send toggle */}
          <View style={styles.autoSendRow}>
            <Text variant="bodySm" color={colors.textSecondary}>
              Enviar automaticamente cada dia de cobro
            </Text>
            <Switch
              value={autoSend}
              onValueChange={setAutoSend}
              trackColor={{ false: colors.elevated, true: colors.copper }}
              thumbColor={colors.textPrimary}
            />
          </View>
        </Card>

        {/* Family Members */}
        {familyMembers.map((member) => (
          <Card key={member.id} style={styles.familyCard}>
            <View style={styles.familyHeader}>
              <View style={styles.familyAvatar}>
                <Text variant="bodySm" color={colors.copper}>{member.name[0]}</Text>
              </View>
              <Badge label={member.role} variant="copper" />
            </View>
            <Text variant="h3" color={colors.textPrimary}>{member.name}</Text>
            <Text variant="caption" color={colors.textMuted}>Ultimo: {member.lastSent}</Text>
            <Button title="Enviar" onPress={() => {}} variant="primary" size="md" style={styles.sendBtn} />
          </Card>
        ))}

        {/* History */}
        <Text variant="h3" color={colors.textPrimary} style={styles.historyTitle}>Historial de Remesas</Text>
        {remittanceHistory.map((item, i) => (
          <Card key={i} style={styles.historyCard}>
            <View style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" />
                  <Path d="M22 4L12 14.01l-3-3" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" />
                </Svg>
              </View>
              <View style={styles.historyInfo}>
                <Text variant="bodySm" color={colors.textPrimary}>Transferencia a {item.to}</Text>
                <Text variant="caption" color={colors.textMuted}>{item.status} · {item.date}</Text>
              </View>
              <MoneyText amount={item.amount.toLocaleString()} variant="moneySm" color={colors.textPrimary} />
            </View>
          </Card>
        ))}

        {/* Per-member totals */}
        <Text variant="label" color={colors.textMuted} style={styles.totalTitle}>Acumulado por miembro</Text>
        {familyMembers.map((m) => (
          <View key={m.id} style={styles.totalRow}>
            <Text variant="bodySm" color={colors.textPrimary}>{m.name}</Text>
            <View style={styles.totalBar}>
              <View style={[styles.totalBarFill, { width: m.id === '1' ? '70%' : m.id === '2' ? '40%' : '15%' }]} />
            </View>
            <Text variant="moneySm" color={colors.copper}>{m.totalYear}</Text>
          </View>
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
  heroCard: { marginBottom: spacing.lg },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroStat: { alignItems: 'flex-end' },
  amountCard: { marginBottom: spacing.xl },
  amountInputRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: spacing.md },
  amountInput: { fontFamily: 'JetBrainsMono-Bold', fontSize: 40, color: colors.textPrimary, flex: 1 },
  quickAmounts: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  quickPill: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.elevated, borderRadius: layout.borderRadius.full },
  autoSendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.copperMuted },
  familyCard: { marginBottom: spacing.md },
  familyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  familyAvatar: { width: layout.avatarLg, height: layout.avatarLg, borderRadius: layout.avatarLg / 2, backgroundColor: colors.elevated, borderWidth: 2, borderColor: colors.copper, alignItems: 'center', justifyContent: 'center' },
  sendBtn: { marginTop: spacing.md },
  historyTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  historyCard: { marginBottom: spacing.sm },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  historyIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.emeraldMuted, alignItems: 'center', justifyContent: 'center' },
  historyInfo: { flex: 1, gap: 2 },
  totalTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  totalBar: { flex: 1, height: 6, backgroundColor: colors.elevated, borderRadius: 3, overflow: 'hidden' },
  totalBarFill: { height: '100%', backgroundColor: colors.copper, borderRadius: 3 },
});
