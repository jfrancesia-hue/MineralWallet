import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text, SkeletonCard } from '../src/components/ui';
import { NotificationCard } from '../src/components/cards';
import { useNotificationsStore } from '../src/stores';
import type { NotifCategory } from '../src/types';
import { colors } from '../src/theme/colors';
import { spacing, layout } from '../src/theme/spacing';
import { Svg, Path } from 'react-native-svg';

type FilterKey = 'all' | NotifCategory;

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'plata', label: 'Plata' },
  { key: 'turnos', label: 'Turnos' },
  { key: 'seguridad', label: 'Seguridad' },
  { key: 'salud', label: 'Salud' },
  { key: 'beneficios', label: 'Beneficios' },
];

function getTimeGroup(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = diff / 3600000;
  if (hours < 24) return 'Hoy';
  if (hours < 48) return 'Ayer';
  return 'Esta semana';
}

export default function NotificacionesScreen() {
  const { notifications, markAsRead, markAllAsRead, isLoading, fetchAll } = useNotificationsStore();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.category === filter);

  // Group by time
  const groups = new Map<string, typeof filtered>();
  for (const n of filtered) {
    const group = getTimeGroup(n.timestamp);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(n);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.copper} colors={[colors.copper]} />}>
        {isLoading && !refreshing ? <SkeletonCard /> : null}
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.textPrimary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
          <Text variant="h1" color={colors.textPrimary} style={styles.headerTitle}>Notificaciones</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text variant="caption" color={colors.copper}>Leer todas</Text>
          </TouchableOpacity>
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
        {Array.from(groups.entries()).map(([group, items]) => (
          <View key={group}>
            <Text variant="label" color={colors.textMuted} style={styles.groupTitle}>
              {group}
            </Text>
            {items.map((notif) => (
              <View key={notif.id} style={styles.notifContainer}>
                <NotificationCard
                  notification={notif}
                  onPress={() => {
                    markAsRead(notif.id);
                    if (notif.actionRoute) {
                      router.push(notif.actionRoute as any);
                    }
                  }}
                />
              </View>
            ))}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text variant="body" color={colors.textMuted} align="center">
              No hay notificaciones
            </Text>
          </View>
        )}

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
  headerTitle: { flex: 1 },
  filterScroll: { marginBottom: spacing.xl },
  filterRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl },
  filterPill: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: layout.borderRadius.full, 
    minHeight: 36, justifyContent: 'center',
  },
  filterActive: { backgroundColor: colors.copper, borderColor: colors.copper },
  groupTitle: { marginBottom: spacing.sm, paddingHorizontal: spacing.xl },
  notifContainer: { paddingHorizontal: spacing.xl },
  empty: { paddingTop: spacing['4xl'] },
});
