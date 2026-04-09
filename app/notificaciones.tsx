import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text, Card } from '../src/components/ui';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

type NotifCategory = 'all' | 'plata' | 'turnos' | 'seguridad' | 'salud' | 'beneficios';

const filters: { key: NotifCategory; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'plata', label: 'Plata' },
  { key: 'turnos', label: 'Turnos' },
  { key: 'seguridad', label: 'Seguridad' },
  { key: 'salud', label: 'Salud' },
  { key: 'beneficios', label: 'Beneficios' },
];

const notifications = [
  {
    group: 'Hoy',
    items: [
      { title: 'Adelanto acreditado', desc: '$150.000 disponibles en tu cuenta', time: 'hace 1h', color: colors.emerald, category: 'plata', unread: true },
      { title: 'Recordatorio turno', desc: 'Manana inicia tu descanso (7 dias)', time: 'hace 3h', color: colors.copper, category: 'turnos', unread: true },
      { title: 'Renovar proteccion auditiva', desc: 'Vence el 20/04 — solicitar reposicion', time: 'hace 5h', color: colors.red, category: 'seguridad', unread: true },
    ],
  },
  {
    group: 'Ayer',
    items: [
      { title: 'Nuevo curso disponible', desc: 'Operacion de Grua Puente (+500 XP)', time: 'hace 8h', color: colors.cyan, category: 'turnos', unread: false },
      { title: 'Examen periodico 15/05', desc: 'Preparacion necesaria — revisar checklist', time: 'ayer', color: colors.emerald, category: 'salud', unread: false },
      { title: 'Hidratate bien', desc: 'Llevas 5 dias consecutivos en turno', time: 'ayer', color: colors.purple, category: 'salud', unread: false },
    ],
  },
  {
    group: 'Esta semana',
    items: [
      { title: '25% dto Indumentaria', desc: 'Nuevo descuento en Indumentaria Minera SRL', time: 'hace 3 dias', color: colors.copper, category: 'beneficios', unread: false },
    ],
  },
];

export default function NotificacionesScreen() {
  const [filter, setFilter] = useState<NotifCategory>('all');

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
          <Text variant="h1" color={colors.textPrimary}>Notificaciones</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterPill, filter === f.key && styles.filterActive]}
                onPress={() => setFilter(f.key)}
              >
                <Text variant="buttonSm" color={filter === f.key ? colors.background : colors.textMuted}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Notifications grouped */}
        {notifications.map((group) => {
          const filteredItems = filter === 'all'
            ? group.items
            : group.items.filter((n) => n.category === filter);

          if (filteredItems.length === 0) return null;

          return (
            <View key={group.group}>
              <Text variant="label" color={colors.textMuted} style={styles.groupTitle}>
                {group.group}
              </Text>
              {filteredItems.map((notif, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.notifCard, notif.unread && styles.notifUnread]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.notifAccent, { backgroundColor: notif.color }]} />
                  <View style={styles.notifContent}>
                    <View style={styles.notifHeader}>
                      <Text variant="bodySm" color={colors.textPrimary} style={styles.notifTitle}>
                        {notif.title}
                      </Text>
                      <Text variant="micro" color={colors.textMuted}>{notif.time}</Text>
                    </View>
                    <Text variant="caption" color={colors.textSecondary}>{notif.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
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
  scroll: { paddingTop: spacing['5xl'] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl, paddingHorizontal: spacing.xl },
  backBtn: { width: layout.touchTarget, height: layout.touchTarget, justifyContent: 'center' },
  filterScroll: { marginBottom: spacing.xl },
  filterRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl },
  filterPill: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.full, borderWidth: 1, borderColor: colors.copperMuted,
    minHeight: 36, justifyContent: 'center',
  },
  filterActive: { backgroundColor: colors.copper, borderColor: colors.copper },
  groupTitle: { marginBottom: spacing.sm, paddingHorizontal: spacing.xl },
  notifCard: {
    flexDirection: 'row', backgroundColor: colors.surface,
    marginHorizontal: spacing.xl, marginBottom: spacing.sm,
    borderRadius: layout.borderRadius.md, overflow: 'hidden',
    minHeight: layout.touchTarget,
  },
  notifUnread: { backgroundColor: colors.elevated },
  notifAccent: { width: 3 },
  notifContent: { flex: 1, padding: spacing.lg, gap: spacing.xs },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { flex: 1 },
});
