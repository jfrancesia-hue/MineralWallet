import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Text, MoneyText, Card, Button } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

const familyContacts = [
  { id: '1', name: 'Padre', initials: 'PA' },
  { id: '2', name: 'Sofia', initials: 'SO' },
  { id: '3', name: 'Hermano', initials: 'HE' },
  { id: '4', name: 'Elena', initials: 'EL' },
];

const frequentContacts = [
  { id: '5', name: 'Edmar S.A.', initials: 'EA', type: 'Empresa' },
  { id: '6', name: 'Marco Aurelio', initials: 'MA', type: 'Personal' },
];

const quickAmounts = ['$10k', '$25k', '$50k', '$80k'];

export default function EnviarScreen() {
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

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
        <View style={styles.searchContainer}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={colors.textMuted} strokeWidth={1.5} />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, CVU o Alias..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Familia */}
        <Text variant="label" color={colors.copper} style={styles.sectionTitle}>Familia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.contactsRow}>
            {familyContacts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.contactItem, selectedContact === c.id && styles.contactSelected]}
                onPress={() => setSelectedContact(c.id)}
              >
                <View style={styles.contactAvatar}>
                  <Text variant="bodySm" color={colors.copper}>{c.initials}</Text>
                </View>
                <Text variant="caption" color={colors.textSecondary}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Frecuentes */}
        <Text variant="label" color={colors.amber} style={styles.sectionTitle}>Frecuentes</Text>
        <View style={styles.frequentRow}>
          {frequentContacts.map((c) => (
            <TouchableOpacity key={c.id} style={styles.frequentCard} onPress={() => setSelectedContact(c.id)}>
              <View style={styles.frequentAvatar}>
                <Text variant="bodySm" color={colors.textPrimary}>{c.initials}</Text>
              </View>
              <View>
                <Text variant="bodySm" color={colors.textPrimary}>{c.name}</Text>
                <Text variant="micro" color={colors.textMuted}>{c.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Compañeros de obra */}
        <Text variant="label" color={colors.textMuted} style={styles.sectionTitle}>Companeros de obra</Text>
        <TouchableOpacity style={styles.addCompanero}>
          <Text variant="bodySm" color={colors.cyan}>+ Agregar companero</Text>
        </TouchableOpacity>

        {/* Amount Input */}
        <Card variant="financial" style={styles.amountCard}>
          <Text variant="labelSm" color={colors.textMuted}>Monto a transferir</Text>
          <View style={styles.amountRow}>
            <Text variant="balance" color={colors.textPrimary}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <Text variant="caption" color={colors.textMuted}>
            Saldo disponible: <Text variant="caption" color={colors.copper}>$847.250</Text>
          </Text>
        </Card>

        {/* Quick amounts */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((q) => (
            <TouchableOpacity key={q} style={styles.quickPill}>
              <Text variant="buttonSm" color={colors.textPrimary}>{q}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.quickPill}>
            <Text variant="buttonSm" color={colors.copper}>Max</Text>
          </TouchableOpacity>
        </View>

        {/* Numpad visual placeholder */}
        <View style={styles.numpad}>
          {[1,2,3,4,5,6,7,8,9].map((n) => (
            <TouchableOpacity key={n} style={styles.numKey} onPress={() => setAmount(amount + n)}>
              <Text variant="h2" color={colors.textPrimary}>{n}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.numKey} onPress={() => setAmount(amount + '.')}>
            <Text variant="h2" color={colors.textPrimary}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.numKey} onPress={() => setAmount(amount + '0')}>
            <Text variant="h2" color={colors.textPrimary}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.numKey} onPress={() => setAmount(amount.slice(0, -1))}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke={colors.textMuted} strokeWidth={1.5} />
              <Path d="M18 9l-6 6M12 9l6 6" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <Button title="Continuar →" onPress={() => {}} variant="primary" size="lg" style={styles.continueBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing['2xl'] },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.sm,
    paddingHorizontal: spacing.lg, height: layout.touchTarget,
    borderWidth: 1, borderColor: colors.copperMuted, marginBottom: spacing.xl,
  },
  searchInput: { flex: 1, color: colors.textPrimary, fontFamily: 'DMSans', fontSize: 14 },
  sectionTitle: { marginBottom: spacing.md, marginTop: spacing.md },
  contactsRow: { flexDirection: 'row', gap: spacing.lg, paddingBottom: spacing.md },
  contactItem: { alignItems: 'center', gap: spacing.sm },
  contactSelected: { opacity: 1 },
  contactAvatar: {
    width: layout.avatarLg, height: layout.avatarLg, borderRadius: layout.avatarLg / 2,
    backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.copper,
    alignItems: 'center', justifyContent: 'center',
  },
  frequentRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  frequentCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.copperMuted, flex: 1,
  },
  frequentAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.elevated,
    alignItems: 'center', justifyContent: 'center',
  },
  addCompanero: { marginBottom: spacing.xl, paddingVertical: spacing.sm },
  amountCard: { marginBottom: spacing.md, alignItems: 'center' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline' },
  amountInput: {
    fontFamily: 'JetBrainsMono-Bold', fontSize: 52, color: colors.textPrimary,
    minWidth: 100, textAlign: 'center',
  },
  quickAmounts: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, justifyContent: 'center' },
  quickPill: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderRadius: layout.borderRadius.full,
    borderWidth: 1, borderColor: colors.copperMuted, minHeight: 36,
    justifyContent: 'center',
  },
  numpad: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md,
    marginBottom: spacing.xl,
  },
  numKey: {
    width: 72, height: 56, borderRadius: layout.borderRadius.md,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  continueBtn: { marginBottom: spacing['4xl'] },
});
