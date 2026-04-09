import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, MoneyText, Label, Card, Badge, Button, ActionCircle } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Rect } from 'react-native-svg';

const actionButtons = [
  { id: 'transferir', label: 'Transferir', color: colors.copper },
  { id: 'cobrar', label: 'Cobrar', color: colors.emerald },
  { id: 'pagarqr', label: 'Pagar QR', color: colors.cyan },
  { id: 'adelanto', label: 'Adelanto', color: colors.amber },
  { id: 'recargar', label: 'Recargar', color: colors.purple },
];

const familyContacts = [
  { id: '1', name: 'Maria', role: 'Esposa' },
  { id: '2', name: 'Mama', role: 'Madre' },
  { id: '3', name: 'Hermano', role: 'Hermano' },
];

const services = [
  { id: '1', name: 'Internet', icon: 'wifi' },
  { id: '2', name: 'Electricidad', icon: 'zap' },
  { id: '3', name: 'Agua', icon: 'droplet' },
  { id: '4', name: 'Recargas', icon: 'phone' },
];

export default function PlataScreen() {
  const [adelantoAmount, setAdelantoAmount] = useState(125000);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
          <MoneyText amount="847.250" variant="balance" color={colors.textPrimary} style={styles.balanceAmount} />

          {/* CVU */}
          <View style={styles.cvuRow}>
            <View style={styles.cvuBox}>
              <Text variant="labelSm" color={colors.textMuted}>CVU</Text>
              <Text variant="moneySm" color={colors.textSecondary}>00000031000123456789...</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={9} y={9} width={13} height={13} rx={2} stroke={colors.cyan} strokeWidth={1.5} />
                <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={colors.cyan} strokeWidth={1.5} />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Alias */}
          <View style={styles.cvuRow}>
            <View style={styles.cvuBox}>
              <Text variant="labelSm" color={colors.textMuted}>Alias</Text>
              <Text variant="moneySm" color={colors.textSecondary}>MINA.ORO.WALLE</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x={9} y={9} width={13} height={13} rx={2} stroke={colors.cyan} strokeWidth={1.5} />
                <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={colors.cyan} strokeWidth={1.5} />
              </Svg>
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
                onPress={() => {}}
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
                Solicita hasta <Text variant="bodySm" color={colors.copper}>$200.000</Text>
              </Text>
            </View>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={colors.copper} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>

          {/* Slider visual */}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${(adelantoAmount / 200000) * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${(adelantoAmount / 200000) * 100}%` }]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text variant="micro" color={colors.textMuted}>$10.000</Text>
              <MoneyText amount={adelantoAmount.toLocaleString('es-AR')} variant="moneySm" color={colors.copper} />
              <Text variant="micro" color={colors.textMuted}>$200.000</Text>
            </View>
          </View>

          <Button title="Solicitar Adelanto" onPress={() => {}} variant="primary" size="lg" />
        </Card>

        {/* Protege tu sueldo (USDT) */}
        <Card style={styles.usdtCard}>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.familyRow}>
            {familyContacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.familyCard}>
                <View style={styles.familyAvatar}>
                  <Text variant="bodySm" color={colors.copper}>{contact.name[0]}</Text>
                </View>
                <Text variant="caption" color={colors.textPrimary}>{contact.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.familyCard}>
              <View style={[styles.familyAvatar, styles.familyAddAvatar]}>
                <Text variant="h3" color={colors.textMuted}>+</Text>
              </View>
              <Text variant="caption" color={colors.textMuted}>Nuevo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
              <View style={styles.serviceIcon}>
                <View style={[styles.actionDot, { backgroundColor: colors.cyan }]} />
              </View>
              <Text variant="buttonSm" color={colors.textPrimary}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    backgroundColor: colors.elevated,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  cvuBox: {
    flex: 1,
    gap: 2,
  },
  copyBtn: {
    width: layout.touchTarget,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: spacing.xl,
  },
  sliderContainer: {
    marginBottom: spacing.xl,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.elevated,
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.copper,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textPrimary,
    marginLeft: -10,
    shadowColor: colors.copper,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    alignItems: 'center',
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
  },
  familyRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  familyCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  familyAvatar: {
    width: layout.avatarLg,
    height: layout.avatarLg,
    borderRadius: layout.avatarLg / 2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyAddAvatar: {
    borderColor: colors.textMuted,
    borderStyle: 'dashed',
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
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    minHeight: layout.touchTarget,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.cyanMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
