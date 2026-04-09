import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { haptics } from '../src/utils/haptics';
import { Text, MoneyText, Card, Button } from '../src/components/ui';
import { SearchInput } from '../src/components/forms';
import { AmountInput } from '../src/components/forms';
import { ContactPicker } from '../src/components/forms';
import { useWalletStore } from '../src/stores';
import { useWallet } from '../src/hooks';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const quickAmounts = [10000, 25000, 50000, 80000];

export default function EnviarScreen() {
  const balance = useWalletStore((s) => s.balance);
  const familyContacts = useWalletStore((s) => s.familyContacts);
  const { sendTransfer } = useWallet();
  const [amount, setAmount] = useState('');
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleContinuar = async () => {
    if (!selectedContact || !amount) return;
    const parsed = parseInt(amount, 10);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Monto inválido', 'Ingresá un monto válido para continuar.');
      return;
    }
    try {
      await sendTransfer(selectedContact, parsed, 'Transferencia');
      haptics.success();
      Alert.alert('Transferencia enviada', `Se transfirieron $${parsed.toLocaleString('es-AR')} correctamente.`);
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo realizar la transferencia. Intentá de nuevo.');
    }
  };

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
          <Text variant="h2" color={colors.copper}>Enviar</Text>
        </View>

        {/* Search */}
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre, CVU o Alias..."
        />

        {/* Familia */}
        <Text variant="label" color={colors.copper} style={styles.sectionTitle}>Familia</Text>
        <ContactPicker
          contacts={familyContacts}
          selectedId={selectedContact ?? undefined}
          onSelect={(c) => setSelectedContact(c.id)}
          onAddPress={() => router.push('/enviar-familia')}
        />

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <AmountInput
            value={amount}
            onChangeText={setAmount}
            label="Monto a transferir"
            max={balance}
          />
          <Text variant="caption" color={colors.textMuted} style={styles.balanceLabel}>
            Saldo disponible: <Text variant="caption" color={colors.copper}>${balance.toLocaleString('es-AR')}</Text>
          </Text>
        </View>

        {/* Quick amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((q) => (
            <TouchableOpacity key={q} style={styles.quickPill} onPress={() => setAmount(String(q))}>
              <Text variant="buttonSm" color={colors.textPrimary}>${(q / 1000)}k</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.quickPill} onPress={() => setAmount(String(balance))}>
            <Text variant="buttonSm" color={colors.copper}>Max</Text>
          </TouchableOpacity>
        </View>

        <Button title="Continuar →" onPress={handleContinuar} variant="primary" size="lg" style={styles.continueBtn} disabled={!selectedContact || !amount} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing['2xl'] },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.md },
  amountSection: { marginTop: spacing.xl },
  balanceLabel: { marginTop: spacing.xs },
  quickAmounts: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, justifyContent: 'center' },
  quickPill: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.full,
    borderWidth: 1, borderColor: colors.copperMuted, minHeight: 36,
    justifyContent: 'center',
  },
  continueBtn: { marginBottom: spacing['4xl'] },
});
