import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text, Label, Card, Badge, SkeletonCard } from '../../src/components/ui';
import { useAuthStore, useSafetyStore, useCareerStore, useWalletStore } from '../../src/stores';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle } from 'react-native-svg';

const settingsItems = [
  { id: 'datos', label: 'Datos personales' },
  { id: 'familia', label: 'Mi familia', route: '/enviar-familia' },
  { id: 'seguridad', label: 'Seguridad de cuenta' },
  { id: 'biometria', label: 'Seguridad Biometrica', route: '/biometric-setup' },
  { id: 'cvu', label: 'Mi CVU y Alias', route: '/(tabs)/plata' },
  { id: 'notificaciones', label: 'Notificaciones', route: '/notificaciones' },
  { id: 'offline', label: 'Modo offline' },
  { id: 'idioma', label: 'Idioma', value: 'Espanol' },
  { id: 'ayuda', label: 'Ayuda y soporte' },
  { id: 'terminos', label: 'Terminos y condiciones' },
];

export default function PerfilScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const safetyScore = useSafetyStore((s) => s.safetyScore);
  const incidentCount = useSafetyStore((s) => s.incidentCount);
  const consecutiveTalks = useSafetyStore((s) => s.consecutiveTalks);
  const fetchSafety = useSafetyStore((s) => s.fetchSummary);
  const certificates = useCareerStore((s) => s.certificates);
  const fetchCareer = useCareerStore((s) => s.fetchSummary);
  const creditScore = useWalletStore((s) => s.creditScore);
  const isLoading = useWalletStore((s) => s.isLoading);
  const fetchBalance = useWalletStore((s) => s.fetchBalance);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSafety();
    fetchCareer();
    fetchBalance();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchSafety(), fetchCareer(), fetchBalance()]);
    setRefreshing(false);
  }, [fetchSafety, fetchCareer, fetchBalance]);

  const activeCerts = certificates.filter((c) => c.status === 'vigente').length;
  const initials = user ? `${user.nombre[0]}${user.apellido[0]}` : 'MW';

  const badges = [
    { label: `Safety ${safetyScore}`, variant: 'emerald' as const },
    { label: incidentCount === 0 ? 'Sin incidentes' : `${incidentCount} incidentes`, variant: incidentCount === 0 ? 'emerald' as const : 'red' as const },
    { label: `${consecutiveTalks} charlas`, variant: 'copper' as const },
    { label: `${activeCerts} certificaciones`, variant: 'cyan' as const },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesion',
      'Estas seguro que queres cerrar tu sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesion',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text variant="h1" color={colors.copper}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={colors.textPrimary} strokeWidth={1.5} />
                <Circle cx={12} cy={13} r={4} stroke={colors.textPrimary} strokeWidth={1.5} />
              </Svg>
            </TouchableOpacity>
          </View>
          <Text variant="h2" color={colors.textPrimary} align="center">
            {user ? `${user.nombre} ${user.apellido}` : 'MineralWallet'}
          </Text>
          <Text variant="bodySm" color={colors.textSecondary} align="center">
            {user?.categoria ?? ''} — {user?.mina ?? ''}
          </Text>
          <Text variant="caption" color={colors.textMuted} align="center">
            Legajo #{user?.legajo ?? ''} · {user?.empresa ?? ''} · {user?.antiguedad ?? 0} anos
          </Text>
        </View>

        {/* Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
          <View style={styles.badgesRow}>
            {badges.map((badge, index) => (
              <Badge key={index} label={badge.label} variant={badge.variant} />
            ))}
          </View>
        </ScrollView>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text variant="moneyMd" color={colors.textPrimary} align="center">
              {user?.antiguedad ?? 0}
            </Text>
            <Text variant="caption" color={colors.textMuted} align="center">anos</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text variant="moneyMd" color={colors.textPrimary} align="center">
              Score {creditScore}
            </Text>
            <Text variant="caption" color={colors.textMuted} align="center">credito</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="moneyMd" color={colors.textPrimary} align="center">A+</Text>
            <Text variant="caption" color={colors.textMuted} align="center">rating</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingsItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.settingsLeft}>
                <View style={styles.settingsIcon}>
                  <View style={styles.settingsDot} />
                </View>
                <Text variant="body" color={colors.textPrimary}>{item.label}</Text>
              </View>
              <View style={styles.settingsRight}>
                {item.value && (
                  <Text variant="caption" color={colors.textMuted}>{item.value}</Text>
                )}
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18l6-6-6-6" stroke={colors.textMuted} strokeWidth={1.5} strokeLinecap="round" />
                </Svg>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text variant="body" color={colors.red} align="center">
            Cerrar sesion
          </Text>
        </TouchableOpacity>

        {/* Version */}
        <Text variant="micro" color={colors.textMuted} align="center" style={styles.version}>
          MineralWallet v2.0.0 — Build {user?.legajo ?? '0000'}
        </Text>

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
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    gap: spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: layout.avatarXl,
    height: layout.avatarXl,
    borderRadius: layout.avatarXl / 2,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesScroll: {
    marginBottom: spacing.xl,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    marginBottom: spacing['2xl'],
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.copperMuted,
  },
  settingsList: {
    gap: 0,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.copperMuted,
    minHeight: layout.touchTarget,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.copper,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoutButton: {
    marginTop: spacing['2xl'],
    paddingVertical: spacing.lg,
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
  version: {
    marginTop: spacing.lg,
    fontFamily: 'JetBrainsMono',
  },
  bottomSpacer: {
    height: layout.tabBarHeight + spacing['2xl'],
  },
});
