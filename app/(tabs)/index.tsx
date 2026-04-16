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
import {
  Text,
  MoneyText,
  Label,
  Card,
  Badge,
  StatusDot,
  ActionCircle,
  SkeletonCard,
  TopographicBackground,
  OreGauge,
} from '../../src/components/ui';
import { TransactionCard } from '../../src/components/cards';
import { useAuthStore, useWalletStore, useWorkStore, useNotificationsStore } from '../../src/stores';
import { useWallet } from '../../src/hooks';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle, Rect, G, Line } from 'react-native-svg';

type IconColorProps = { color: string; size?: number };

const ReceiptIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 3v18l2-1.5L10 21l2-1.5L14 21l2-1.5L18 21V3l-2 1.5L14 3l-2 1.5L10 3 8 4.5 6 3z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
const CalendarIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={16} rx={2} stroke={color} strokeWidth={1.6} />
    <Path d="M8 3v4M16 3v4M3 10h18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
const ShieldAlertIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
const HeartPulseIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3.5 12h3l2-4 3 8 2-6 1.5 2H21" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const GraduationIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 10l10-5 10 5-10 5-10-5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5M20 11v5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
const GiftIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={9} width={18} height={12} rx={1} stroke={color} strokeWidth={1.6} />
    <Path d="M12 9v12M3 14h18M8 9a3 3 0 014-3 3 3 0 014 3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
const SendIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 3L3 10l7 3 3 7 8-17z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
  </Svg>
);
const QrIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={3} width={7} height={7} stroke={color} strokeWidth={1.6} />
    <Rect x={14} y={3} width={7} height={7} stroke={color} strokeWidth={1.6} />
    <Rect x={3} y={14} width={7} height={7} stroke={color} strokeWidth={1.6} />
    <Path d="M14 14h3v3M20 14v7M14 21h3M17 17v4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);
const HeartIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 20s-7-4.35-9-9.5C1.5 6 5 3 8 4.5c1.6.8 2.8 2.1 4 3.5 1.2-1.4 2.4-2.7 4-3.5 3-1.5 6.5 1.5 5 6-2 5.15-9 9.5-9 9.5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
  </Svg>
);
const GridIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={3} width={7} height={7} rx={1} stroke={color} strokeWidth={1.6} />
    <Rect x={14} y={3} width={7} height={7} rx={1} stroke={color} strokeWidth={1.6} />
    <Rect x={3} y={14} width={7} height={7} rx={1} stroke={color} strokeWidth={1.6} />
    <Rect x={14} y={14} width={7} height={7} rx={1} stroke={color} strokeWidth={1.6} />
  </Svg>
);
const BellIcon = ({ color, size = 22 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);
const ShieldIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
  </Svg>
);
const PiggyIcon = ({ color, size = 20 }: IconColorProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 5a7 7 0 017 7 6 6 0 01-2 4.5V19a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H9v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1.5A7 7 0 014 11c0-2 1-3 2-4l-.5-2L8 6a7 7 0 014-1h3z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    <Circle cx={15.5} cy={11} r={1} fill={color} />
  </Svg>
);

interface QuickAction {
  id: string;
  label: string;
  color: string;
  route: string;
  icon: React.ComponentType<IconColorProps>;
}

const quickActions: QuickAction[] = [
  { id: 'recibo', label: 'Recibo', color: colors.copper, route: '/recibo', icon: ReceiptIcon },
  { id: 'turnos', label: 'Turnos', color: colors.cyan, route: '/turnos', icon: CalendarIcon },
  { id: 'sos', label: 'SOS', color: colors.red, route: '/(tabs)/sos', icon: ShieldAlertIcon },
  { id: 'salud', label: 'Salud', color: colors.emerald, route: '/(tabs)/salud', icon: HeartPulseIcon },
  { id: 'cursos', label: 'Cursos', color: colors.purple, route: '/carrera', icon: GraduationIcon },
  { id: 'beneficios', label: 'Beneficios', color: colors.amber, route: '/beneficios', icon: GiftIcon },
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
  const firstName = user?.nombre?.split(' ')[0] ?? 'Minero';
  const initials = user ? `${user.nombre[0]}${user.apellido[0]}` : 'MW';
  const shiftProgress = currentShift ? (currentShift.dayOfRotation / currentShift.totalDays) * 100 : 0;

  return (
    <View style={styles.container}>
      <TopographicBackground opacity={0.04} glowPosition="top-right" style={styles.topo}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/perfil')} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.copperGradient}
                  style={styles.avatarGradient}
                >
                  <Text variant="bodyMedium" color={colors.background}>{initials}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.headerText}>
                <Text variant="caption" color={colors.textMuted}>Hola,</Text>
                <Text variant="h3" color={colors.textPrimary}>{firstName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/notificaciones')} activeOpacity={0.8}>
              <View style={styles.bellCircle}>
                <BellIcon color={colors.textPrimary} />
              </View>
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text variant="micro" color={colors.background}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Mine Badge */}
          <View style={styles.mineBadgeRow}>
            <View style={styles.mineBadge}>
              <ShieldIcon color={colors.copper} size={14} />
              <Text variant="labelSm" color={colors.copper}>{user?.mina ?? 'Mineral Wallet'}</Text>
            </View>
          </View>

          {isLoading && !refreshing ? <SkeletonCard /> : null}

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
                  <Text variant="buttonSm" color={isCheckedIn ? colors.emerald : colors.textMuted}>
                    {isCheckedIn ? 'EN TURNO' : 'FUERA DE TURNO'}
                  </Text>
                </View>
                <Text variant="caption" color={colors.textSecondary}>
                  {currentShift.type === 'manana' ? 'Manana' : currentShift.type === 'tarde' ? 'Tarde' : 'Noche'} · {currentShift.startTime} - {currentShift.endTime} · Dia {currentShift.dayOfRotation}/{currentShift.totalDays}
                </Text>
              </View>
            </Card>
          )}

          {/* Balance Hero Card */}
          <Card variant="hero" glow style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Label color={colors.copper}>Saldo disponible</Label>
              <Text variant="micro" color={colors.textMuted}>ARS</Text>
            </View>
            <MoneyText amount={balance} variant="balance" color={colors.textPrimary} style={styles.balanceAmount} />

            {/* Pills */}
            <View style={styles.pillsRow}>
              <Badge label={`Proximo cobro · 5 dias`} variant="cyan" icon={<CalendarIcon color={colors.cyan} size={12} />} />
              <Badge label={`Adelanto $${(adelantoDisponible / 1000).toFixed(0)}k`} variant="copper" />
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsRow}>
              <ActionCircle
                icon={<SendIcon color={colors.emerald} size={22} />}
                label="Enviar"
                color={colors.emerald}
                onPress={() => router.push('/enviar')}
              />
              <ActionCircle
                icon={<QrIcon color={colors.cyan} size={22} />}
                label="Cobrar"
                color={colors.cyan}
                onPress={() => router.push('/pagar-qr')}
              />
              <ActionCircle
                icon={<HeartIcon color={colors.background} size={22} />}
                label="Familia"
                color={colors.copper}
                primary
                onPress={() => router.push('/enviar-familia')}
              />
              <ActionCircle
                icon={<GridIcon color={colors.textSecondary} size={22} />}
                label="Mas"
                color={colors.textSecondary}
                onPress={() => router.push('/(tabs)/plata')}
              />
            </View>
          </Card>

          {/* Savings & Shift Row */}
          <View style={styles.twoCardRow}>
            <Card variant="elevated" style={styles.halfCard} onPress={() => router.push('/resguardo-usdt')}>
              <View style={styles.halfHeader}>
                <PiggyIcon color={colors.copper} size={16} />
                <Label color={colors.copper}>Ahorro</Label>
              </View>
              <MoneyText amount={savings} variant="moneySm" color={colors.textPrimary} style={styles.cardMoney} />
              <View style={styles.usdtRow}>
                <View style={styles.usdtDot} />
                <Text variant="micro" color={colors.textMuted}>{usdtBalance} USDT resguardo</Text>
              </View>
            </Card>

            <Card
              variant="status"
              accentColor={colors.cyan}
              style={styles.halfCard}
              onPress={() => router.push('/turnos')}
            >
              <View style={styles.halfHeader}>
                <CalendarIcon color={colors.cyan} size={16} />
                <Label color={colors.cyan}>Hoy</Label>
              </View>
              <Text variant="bodyMedium" color={colors.textPrimary}>
                {currentShift?.type === 'manana' ? 'Manana' : currentShift?.type === 'tarde' ? 'Tarde' : 'Noche'}
              </Text>
              <Text variant="caption" color={colors.textSecondary} style={styles.shiftSector}>
                {currentShift?.sector ?? '—'} · {currentShift?.level ?? '—'}
              </Text>
              {currentShift && (
                <OreGauge
                  value={shiftProgress}
                  color="cyan"
                  height={4}
                  rightLabel={`${Math.round(shiftProgress)}%`}
                  style={styles.halfGauge}
                />
              )}
            </Card>
          </View>

          {/* Quick Access Grid */}
          <View style={styles.quickGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isSos = action.id === 'sos';
              return (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickGridItem}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.quickGridCircle,
                      {
                        backgroundColor: withAlpha(action.color, 0.12),
                      },
                    ]}
                  >
                    {isSos && <View style={styles.sosRing} />}
                    <Icon color={action.color} size={22} />
                  </View>
                  <Text variant="caption" color={colors.textSecondary} align="center">
                    {action.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionTick} />
              <Text variant="label" color={colors.textMuted}>Actividad reciente</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/plata')}>
              <Text variant="caption" color={colors.copper}>Ver todo →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.txList}>
            {recentTx.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </TopographicBackground>
    </View>
  );
}

function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topo: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 2,
  },
  bellButton: {
    position: 'relative',
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mineBadgeRow: {
    marginBottom: spacing.lg,
  },
  mineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.copperMuted,
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
  balanceCard: {
    marginBottom: spacing.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    marginBottom: spacing.md,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoCardRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  halfCard: {
    flex: 1,
  },
  halfHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardMoney: {
    marginTop: spacing.xs,
  },
  usdtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  usdtDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.emerald,
  },
  shiftSector: {
    marginTop: 2,
  },
  halfGauge: {
    marginTop: spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing['3xl'],
    rowGap: spacing.xl,
  },
  quickGridItem: {
    width: '30%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickGridCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sosRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.red,
    opacity: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTick: {
    width: 3,
    height: 12,
    backgroundColor: colors.copper,
  },
  txList: {
    gap: spacing.sm,
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['3xl'],
  },
});
