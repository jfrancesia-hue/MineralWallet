import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, MoneyText, Label, Card, Badge, StatusDot, ActionCircle } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

const quickActions = [
  { id: 'recibo', label: 'Recibo', color: colors.copper },
  { id: 'turnos', label: 'Turnos', color: colors.cyan },
  { id: 'sos', label: 'SOS', color: colors.red },
  { id: 'salud', label: 'Salud', color: colors.emerald },
  { id: 'cursos', label: 'Cursos', color: colors.purple },
  { id: 'beneficios', label: 'Beneficios', color: colors.amber },
];

const recentTransactions = [
  { id: '1', title: 'Deposito de Nomina', date: '22 May, 2024', amount: '+$420.000', positive: true },
  { id: '2', title: 'Comisaria Industrial', date: '21 May, 2024', amount: '-$12.500', positive: false },
  { id: '3', title: 'Transferencia Familia', date: '20 May, 2024', amount: '-$50.000', positive: false },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text variant="bodySm" color={colors.copper}>CF</Text>
            </View>
            <View>
              <Badge label="Minera Alumbrera" variant="copper" />
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellButton}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
                <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
              <View style={styles.bellBadge}>
                <Text variant="micro" color={colors.textPrimary}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand */}
        <Text variant="label" color={colors.copper} style={styles.brandText}>
          Mineral Wallet
        </Text>

        {/* Shift Status Strip */}
        <Card variant="status" accentColor={colors.emerald} style={styles.shiftStrip}>
          <View style={styles.shiftContent}>
            <View style={styles.shiftLeft}>
              <StatusDot status="online" size={8} />
              <Text variant="buttonSm" color={colors.emerald} style={styles.shiftStatus}>
                EN TURNO
              </Text>
            </View>
            <Text variant="caption" color={colors.textSecondary}>
              Turno Manana — 06:00 a 14:00 — Dia 5 de 7
            </Text>
            <View style={styles.shiftRight}>
              <Text variant="label" color={colors.textMuted}>Faltan</Text>
              <Text variant="moneyMd" color={colors.cyan}>3h</Text>
              <Text variant="moneySm" color={colors.cyan}>24m</Text>
            </View>
          </View>
        </Card>

        {/* Balance Hero Card */}
        <LinearGradient
          colors={[colors.surface, colors.elevated]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceTopBorder} />
          <Label color={colors.copper} style={styles.balanceLabel}>
            Saldo disponible
          </Label>
          <MoneyText amount="847.250" variant="balance" color={colors.textPrimary} />

          {/* Pills */}
          <View style={styles.pillsRow}>
            <Badge label="Proximo cobro: 5 dias" variant="cyan" />
            <Badge label="Adelanto: $200.000" variant="copper" />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 19V5M5 12l7-7 7 7" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" /></Svg>}
              label="Enviar"
              color={colors.emerald}
              onPress={() => {}}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M19 12l-7 7-7-7" stroke={colors.cyan} strokeWidth={2} strokeLinecap="round" /></Svg>}
              label="Cobrar"
              color={colors.cyan}
              onPress={() => {}}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={colors.copper} strokeWidth={2} /></Svg>}
              label="Familia"
              color={colors.copper}
              onPress={() => {}}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Rect x={3} y={3} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={14} y={3} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={3} y={14} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={14} y={14} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /></Svg>}
              label="Mas"
              color={colors.textMuted}
              onPress={() => {}}
            />
          </View>
        </LinearGradient>

        {/* Savings & Shift Row */}
        <View style={styles.twoCardRow}>
          <Card style={styles.halfCard}>
            <Label color={colors.copper}>Ahorro</Label>
            <MoneyText amount="125.000" variant="moneySm" color={colors.textPrimary} style={styles.cardMoney} />
            <Text variant="micro" color={colors.textMuted}>340 USDT Resguardo</Text>
          </Card>
          <Card variant="status" accentColor={colors.cyan} style={styles.halfCard}>
            <Text variant="buttonSm" color={colors.textPrimary}>Hoy — Manana</Text>
            <Text variant="caption" color={colors.textSecondary}>Sector Norte - Nivel -3</Text>
            <View style={styles.progressContainer}>
              <Text variant="micro" color={colors.textMuted}>Progreso 60%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickGridItem}>
              <View style={[styles.quickGridCircle, { backgroundColor: `${action.color}15`, borderColor: `${action.color}30` }]}>
                {action.id === 'sos' && <StatusDot status="critical" size={12} pulse />}
                {action.id !== 'sos' && (
                  <View style={[styles.quickGridDot, { backgroundColor: action.color }]} />
                )}
              </View>
              <Text variant="caption" color={colors.textSecondary} align="center">
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text variant="label" color={colors.textMuted}>Actividad reciente</Text>
          <TouchableOpacity>
            <Text variant="caption" color={colors.copper}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.map((tx) => (
          <Card key={tx.id} style={styles.transactionCard}>
            <View style={styles.transactionRow}>
              <View style={styles.transactionLeft}>
                <Text variant="bodySm" color={colors.textPrimary}>{tx.title}</Text>
                <Text variant="caption" color={colors.textMuted}>{tx.date}</Text>
              </View>
              <MoneyText
                amount={tx.amount.replace(/[+$-]/g, '')}
                variant="moneySm"
                prefix={tx.positive ? '+$' : '-$'}
                color={tx.positive ? colors.emerald : colors.textPrimary}
              />
            </View>
          </Card>
        ))}

        {/* Bottom spacer for tab bar */}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: layout.avatarMd,
    height: layout.avatarMd,
    borderRadius: layout.avatarMd / 2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bellButton: {
    position: 'relative',
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    marginBottom: spacing.lg,
  },
  shiftStrip: {
    marginBottom: spacing.lg,
  },
  shiftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  shiftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shiftStatus: {
    letterSpacing: 2,
  },
  shiftRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  balanceCard: {
    borderRadius: layout.borderRadius.md,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.copperMuted,
  },
  balanceTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.copper,
  },
  balanceLabel: {
    marginBottom: spacing.sm,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  twoCardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  halfCard: {
    flex: 1,
  },
  cardMoney: {
    marginVertical: spacing.xs,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.elevated,
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: 2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing['2xl'],
  },
  quickGridItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  quickGridCircle: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: layout.touchTarget / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickGridDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  transactionCard: {
    marginBottom: spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
    gap: 2,
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
