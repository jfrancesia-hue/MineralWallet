import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Label, Card, Badge, Button, ProgressBar } from '../src/components/ui';
import { FamilyContactCard } from '../src/components/cards';
import { AmountInput } from '../src/components/forms';
import { useWalletStore } from '../src/stores';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

export default function EnviarFamiliaScreen() {
  const familyContacts = useWalletStore((s) => s.familyContacts);
  const balance = useWalletStore((s) => s.balance);
  const [autoSend, setAutoSend] = useState(true);
  const [amount, setAmount] = useState('');

  const totalSentYear = familyContacts.reduce((sum, c) => sum + c.totalSentYear, 0);

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
            <View style={styles.heroText}>
              <Text variant="h3" color={colors.textPrimary}>
                Sos el sustento de {familyContacts.length} personas
              </Text>
              <Text variant="bodySm" color={colors.textSecondary}>
                Tus envios mensuales mantienen el hogar activo.
              </Text>
            </View>
            <View style={styles.heroStat}>
              <MoneyText amount={totalSentYear} variant="moneyMd" color={colors.copper} />
              <Text variant="micro" color={colors.textMuted}>Total enviado</Text>
            </View>
          </View>
        </Card>

        {/* Quick Amount */}
        <Card style={styles.amountCard}>
          <AmountInput
            value={amount}
            onChangeText={setAmount}
            label="Monto a enviar"
            max={balance}
          />

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
        {familyContacts.map((contact) => (
          <FamilyContactCard key={contact.id} contact={contact} onPress={() => {}} />
        ))}

        {/* Per-member totals */}
        <Text variant="label" color={colors.textMuted} style={styles.totalTitle}>Acumulado por miembro</Text>
        {familyContacts.map((c) => {
          const percent = totalSentYear > 0 ? Math.round((c.totalSentYear / totalSentYear) * 100) : 0;
          return (
            <View key={c.id} style={styles.totalRow}>
              <Text variant="bodySm" color={colors.textPrimary}>{c.name}</Text>
              <View style={styles.totalBarContainer}>
                <ProgressBar progress={percent} color={colors.copper} height={6} />
              </View>
              <MoneyText amount={c.totalSentYear} variant="moneySm" color={colors.copper} />
            </View>
          );
        })}

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
  heroText: { flex: 1, gap: spacing.xs },
  heroStat: { alignItems: 'flex-end' },
  amountCard: { marginBottom: spacing.xl },
  autoSendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, },
  totalTitle: { marginTop: spacing.xl, marginBottom: spacing.md },
  totalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  totalBarContainer: { flex: 1 },
});
