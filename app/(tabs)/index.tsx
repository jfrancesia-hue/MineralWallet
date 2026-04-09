import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, MoneyText, Label, Card, Badge, StatusDot, ActionCircle, SkeletonCard } from '../../src/components/ui';
import { TransactionCard } from '../../src/components/cards';
import { useAuthStore, useWalletStore, useWorkStore, useNotificationsStore } from '../../src/stores';
import { useWallet } from '../../src/hooks';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Rect } from 'react-native-svg';

const quickActions = [
  { id: 'recibo', label: 'Recibo', color: colors.copper, route: '/recibo' },
  { id: 'turnos', label: 'Turnos', color: colors.cyan, route: '/turnos' },
  { id: 'sos', label: 'SOS', color: colors.red, route: '/(tabs)/sos' },
  { id: 'salud', label: 'Salud', color: colors.emerald, route: '/(tabs)/salud' },
  { id: 'cursos', label: 'Cursos', color: colors.purple, route: '/carrera' },
  { id: 'beneficios', label: 'Beneficios', color: colors.amber, route: '/beneficios' },
];

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const balance = useWalletStore((s) => s.balance);
  const savings = useWalletStore((s) => s.savings);
  const usdtBalance = useWalletStore((s) => s.usdtBalance);
  const adelantoDisponible = useWalletStore((s) => s.adelantoDisponible);
  const transactions = useWalletStore((s) => s.transactions);
  const isLoading = useWalletStore((s) => s.isLoading);
  const currentShift = useWorkStore((s) => s.currentShift);
  const isCheckedIn = useWorkStore((s) => s.isCheckedIn);
  const fetchWorkSummary = useWorkStore((s) => s.fetchSummary);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationsStore((s) => s.fetchAll);
  const { fetchAll } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchWorkSummary();
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAll(), fetchWorkSummary(), fetchNotifications()]);
    setRefreshing(false);
  }, [fetchAll, fetchWorkSummary, fetchNotifications]);

  const recentTx = transactions.slice(0, 3);
  const initials = user ? `${user.nombre[0]}${user.apellido[0]}` : 'MW';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}
      >
        {isLoading && !refreshing ? <SkeletonCard /> : null}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/perfil')}>
              <Text variant="bodySm" color={colors.copper}>{initials}</Text>
            </TouchableOpacity>
            <View>
              <Badge label={user?.mina ?? 'MineralWallet'} variant="copper" />
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/notificaciones')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
              <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={colors.textPrimary} strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text variant="micro" color={colors.textPrimary}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Brand */}
        <Text variant="label" color={colors.copper} style={styles.brandText}>
          Mineral Wallet
        </Text>

        {/* Shift Status Strip */}
        {currentShift && (
          <Card
            variant="status"
            accentColor={isCheckedIn ? colors.emerald : colors.textMuted}
            style={styles.shiftStrip}
            onPress={() => router.push('/turnos')}
          >
            <View style={styles.shiftContent}>
              <View style={styles.shiftLeft}>
                <StatusDot status={isCheckedIn ? 'online' : 'rest'} size={8} />
                <Text variant="buttonSm" color={isCheckedIn ? colors.emerald : colors.textMuted} style={styles.shiftStatus}>
                  {isCheckedIn ? 'EN TURNO' : 'FUERA DE TURNO'}
                </Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>
                Turno {currentShift.type === 'manana' ? 'Manana' : currentShift.type === 'tarde' ? 'Tarde' : 'Noche'} — {currentShift.startTime} a {currentShift.endTime} — Dia {currentShift.dayOfRotation} de {currentShift.totalDays}
              </Text>
            </View>
          </Card>
        )}

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
          <MoneyText amount={balance} variant="balance" color={colors.textPrimary} />

          {/* Pills */}
          <View style={styles.pillsRow}>
            <Badge label="Proximo cobro: 5 dias" variant="cyan" />
            <Badge label={`Adelanto: $${adelantoDisponible.toLocaleString('es-AR')}`} variant="copper" />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 19V5M5 12l7-7 7 7" stroke={colors.emerald} strokeWidth={2} strokeLinecap="round" /></Svg>}
              label="Enviar"
              color={colors.emerald}
              onPress={() => router.push('/enviar')}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M19 12l-7 7-7-7" stroke={colors.cyan} strokeWidth={2} strokeLinecap="round" /></Svg>}
              label="Cobrar"
              color={colors.cyan}
              onPress={() => router.push('/pagar-qr')}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={colors.copper} strokeWidth={2} /></Svg>}
              label="Familia"
              color={colors.copper}
              onPress={() => router.push('/enviar-familia')}
            />
            <ActionCircle
              icon={<Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Rect x={3} y={3} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={14} y={3} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={3} y={14} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /><Rect x={14} y={14} width={7} height={7} rx={1} stroke={colors.textMuted} strokeWidth={1.5} /></Svg>}
              label="Mas"
              color={colors.textMuted}
              onPress={() => router.push('/(tabs)/plata')}
            />
          </View>
        </LinearGradient>

        {/* Savings & Shift Row */}
        <View style={styles.twoCardRow}>
          <Card style={styles.halfCard} onPress={() => router.push('/resguardo-usdt')}>
            <Label color={colors.copper}>Ahorro</Label>
            <MoneyText amount={savings} variant="moneySm" color={colors.textPrimary} style={styles.cardMoney} />
            <Text variant="micro" color={colors.textMuted}>{usdtBalance} USDT Resguardo</Text>
          </Card>
          <Card
            variant="status"
            accentColor={colors.cyan}
            style={styles.halfCard}
            onPress={() => router.push('/turnos')}
          >
            <Text variant="buttonSm" color={colors.textPrimary}>
              Hoy — {currentShift?.type === 'manana' ? 'Manana' : currentShift?.type === 'tarde' ? 'Tarde' : 'Noche'}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {currentShift?.sector} - {currentShift?.level}
            </Text>
            {currentShift && (
              <View style={styles.progressContainer}>
                <Text variant="micro" color={colors.textMuted}>
                  Progreso {Math.round((currentShift.dayOfRotation / currentShift.totalDays) * 100)}%
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(currentShift.dayOfRotation / currentShift.totalDays) * 100}%` }]} />
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickGridItem}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickGridCircle, { backgroundColor: `${action.color}15`, borderColor: `${action.color}30` }]}>
                {action.id === 'sos' ? (
                  <StatusDot status="critical" size={12} pulse />
                ) : (
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
          <TouchableOpacity onPress={() => router.push('/(tabs)/plata')}>
            <Text variant="caption" color={colors.copper}>Ver todo</Text>
          </TouchableOpacity>
        </View>

        {recentTx.map((tx) => (
          <TransactionCard key={tx.id} transaction={tx} />
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
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
