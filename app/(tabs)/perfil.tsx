import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text, Label, Card, Badge } from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing, layout } from '../../src/theme/spacing';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

const badges = [
  { label: 'Safety 94', variant: 'emerald' as const },
  { label: 'Sin incidentes', variant: 'emerald' as const },
  { label: '23 charlas', variant: 'copper' as const },
  { label: '12 certificaciones', variant: 'cyan' as const },
];

const settingsItems = [
  { id: 'datos', label: 'Datos personales', icon: 'user' },
  { id: 'familia', label: 'Mi familia', icon: 'heart' },
  { id: 'seguridad', label: 'Seguridad de cuenta', icon: 'shield' },
  { id: 'cvu', label: 'Mi CVU y Alias', icon: 'credit-card' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
  { id: 'offline', label: 'Modo offline', icon: 'wifi-off' },
  { id: 'idioma', label: 'Idioma', icon: 'globe', value: 'Espanol' },
  { id: 'ayuda', label: 'Ayuda y soporte', icon: 'help' },
  { id: 'terminos', label: 'Terminos y condiciones', icon: 'file' },
];

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text variant="h1" color={colors.copper}>CF</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={colors.textPrimary} strokeWidth={1.5} />
                <Circle cx={12} cy={13} r={4} stroke={colors.textPrimary} strokeWidth={1.5} />
              </Svg>
            </TouchableOpacity>
          </View>
          <Text variant="h2" color={colors.textPrimary} align="center">
            Carlos Eduardo Francesia
          </Text>
          <Text variant="bodySm" color={colors.textSecondary} align="center">
            Operador Senior A — Minera Alumbrera
          </Text>
          <Text variant="caption" color={colors.textMuted} align="center">
            Legajo #4521 · Desde Marzo 2019 · 7 anos
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
            <Text variant="moneyMd" color={colors.textPrimary} align="center">7</Text>
            <Text variant="caption" color={colors.textMuted} align="center">anos</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text variant="moneyMd" color={colors.textPrimary} align="center">$4.2M</Text>
            <Text variant="caption" color={colors.textMuted} align="center">cobrado</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="moneyMd" color={colors.textPrimary} align="center">A+</Text>
            <Text variant="caption" color={colors.textMuted} align="center">score</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.settingsItem}>
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
        <TouchableOpacity style={styles.logoutButton}>
          <Text variant="body" color={colors.red} align="center">
            Cerrar sesion
          </Text>
        </TouchableOpacity>

        {/* Version */}
        <Text variant="micro" color={colors.textMuted} align="center" style={styles.version}>
          MineralWallet v2.0.0 — Build 4521
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
