import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { haptics } from '../../src/utils/haptics';
import { Text, MoneyText, Label, Card, Badge, Button, ActionCircle, SkeletonCard } from '../../src/components/ui';
import { TransactionCard } from '../../src/components/cards';
import { SliderInput } from '../../src/components/forms';
import { ContactPicker } from '../../src/components/forms';
import { useWalletStore } from '../../src/stores';
import { useWallet } from '../../src/hooks';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Rect } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';

const actionButtons = [
  { id: 'transferir', label: 'Transferir', color: colors.copper, route: '/enviar' },
  { id: 'cobrar', label: 'Cobrar', color: colors.emerald, route: '/pagar-qr' },
  { id: 'pagarqr', label: 'Pagar QR', color: colors.cyan, route: '/pagar-qr' },
  { id: 'adelanto', label: 'Adelanto', color: colors.amber, route: null },
  { id: 'recargar', label: 'Recargar', color: colors.purple, route: null },
];

const services = [
  { id: '1', name: 'Internet', color: colors.cyan },
  { id: '2', name: 'Electricidad', color: colors.amber },
  { id: '3', name: 'Agua', color: colors.cyan },
  { id: '4', name: 'Recargas', color: colors.purple },
];

export default function PlataScreen() {
  const balance = useWalletStore((s) => s.balance);
  const cvu = useWalletStore((s) => s.cvu);
  const alias = useWalletStore((s) => s.alias);
  const adelantoDisponible = useWalletStore((s) => s.adelantoDisponible);
  const transactions = useWalletStore((s) => s.transactions);
  const familyContacts = useWalletStore((s) => s.familyContacts);
  const isLoading = useWalletStore((s) => s.isLoading);
  const { requestAdvance, fetchAll } = useWallet();
  const [adelantoAmount, setAdelantoAmount] = useState(Math.round(adelantoDisponible / 2));
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const handleAdelanto = async () => {
    const success = await requestAdvance(adelantoAmount);
    if (success) {
      Alert.alert('Adelanto solicitado', `Adelanto de $${adelantoAmount.toLocaleString('es-AR')} solicitado con éxito.`);
    } else {
      Alert.alert('Error', 'No se pudo solicitar el adelanto. Intentá de nuevo.');
    }
  };

  const handleCopy = async (text: string, field: string) => {
    haptics.light();
    await Clipboard.setStringAsync(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        {/* Header */}
        <View style={styles.header}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect x={2} y={5} width={20} height={14} rx={3} stroke={colors.copper} strokeWidth={1.5} />
            <Path d="M2 10h20" stroke={colors.copper} strokeWidth={1.5} />
          </Svg>
          <Text variant="h1" color={colors.textPrimary}>Mi Plata</Text>
        </View>

        {/* Balance Hero */}
        <Card variant="financial" style={styles.balanceCard}>
          <Label color={colors.copper}>Balance disponible</Label>
          <MoneyText amount={balance} variant="balance" color={colors.textPrimary} style={styles.balanceAmount} />

          {/* CVU */}
          <View style={styles.cvuRow}>
            <View style={styles.cvuBox}>
              <Text variant="labelSm" color={colors.textMuted}>CVU</Text>
              <Text variant="moneySm" color={colors.textSecondary} numberOfLines={1}>
                {cvu}
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopy(cvu, 'cvu')}>
              <Text variant="micro" color={copiedField === 'cvu' ? colors.emerald : colors.cyan}>
                {copiedField === 'cvu' ? 'Copiado' : 'Copiar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alias */}
          <View style={styles.cvuRow}>
            <View style={styles.cvuBox}>
              <Text variant="labelSm" color={colors.textMuted}>Alias</Text>
              <Text variant="moneySm" color={colors.textSecondary}>{alias}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={() => handleCopy(alias, 'alias')}>
              <Text variant="micro" color={copiedField === 'alias' ? colors.emerald : colors.cyan}>
                {copiedField === 'alias' ? 'Copiado' : 'Copiar'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Action Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll}>
          <View style={styles.actionsRow}>
            {actionButtons.map((action) => (
              <ActionCircle
                key={action.id}
                icon={<View style={[styles.actionDot, { backgroundColor: action.color }]} />}
                label={action.label}
                color={action.color}
                onPress={() => action.route && router.push(action.route as any)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Adelanto de Sueldo */}
        <Card variant="financial" style={styles.adelantoCard}>
          <View style={styles.adelantoHeader}>
            <View>
              <Text variant="h3" color={colors.textPrimary}>Adelanto de Sueldo</Text>
              <Text variant="bodySm" color={colors.textSecondary}>
                Solicita hasta <Text variant="bodySm" color={colors.copper}>${adelantoDisponible.toLocaleString('es-AR')}</Text>
              </Text>
            </View>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>

          <SliderInput
            value={adelantoAmount}
            min={10000}
            max={adelantoDisponible}
            step={5000}
            onValueChange={setAdelantoAmount}
            accentColor={colors.copper}
          />

          <Button title="Solicitar Adelanto" onPress={handleAdelanto} variant="primary" size="lg" />
        </Card>

        {/* Protege tu sueldo (USDT) */}
        <Card style={styles.usdtCard} onPress={() => router.push('/resguardo-usdt')}>
          <View style={styles.usdtHeader}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={colors.emeraldMuted} stroke={colors.emerald} strokeWidth={1.5} />
            </Svg>
            <View style={styles.usdtText}>
              <Text variant="h3" color={colors.textPrimary}>Protege tu sueldo</Text>
              <Text variant="caption" color={colors.textSecondary}>
                Pasa tus pesos a USDT al instante.
              </Text>
            </View>
            <Badge label="ARS/USDT" variant="emerald" />
          </View>
        </Card>

        {/* Enviar a Familia */}
        <View style={styles.sectionHeader}>
          <Label color={colors.textMuted}>Enviar a Familia</Label>
        </View>
        <ContactPicker
          contacts={familyContacts}
          onSelect={(contact) => router.push({ pathname: '/enviar-familia', params: { contactId: contact.id } })}
          onAddPress={() => router.push('/enviar-familia')}
        />

        {/* Pagos & Servicios */}
        <View style={styles.sectionHeader}>
          <Label color={colors.textMuted}>Pagos & Servicios</Label>
          <TouchableOpacity>
            <Text variant="caption" color={colors.copper}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                <View style={[styles.actionDot, { backgroundColor: service.color }]} />
              </View>
              <Text variant="buttonSm" color={colors.textPrimary}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ultimos movimientos */}
        <View style={styles.sectionHeader}>
          <Label color={colors.textMuted}>Ultimos movimientos</Label>
        </View>
        {transactions.slice(0, 4).map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  balanceCard: {
    marginBottom: spacing.lg,
  },
  balanceAmount: {
    marginVertical: spacing.md,
  },
  cvuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceHigh,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  cvuBox: {
    flex: 1,
    gap: 2,
  },
  copyBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minWidth: 52,
    alignItems: 'center',
  },
  actionsScroll: {
    marginBottom: spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    paddingVertical: spacing.sm,
  },
  actionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  adelantoCard: {
    marginBottom: spacing.lg,
  },
  adelantoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  usdtCard: {
    marginBottom: spacing.xl,
  },
  usdtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  usdtText: {
    flex: 1,
    gap: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  serviceCard: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLow,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.lg,
    minHeight: layout.touchTarget,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
