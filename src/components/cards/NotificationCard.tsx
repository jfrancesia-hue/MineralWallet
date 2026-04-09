import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Notification, NotifCategory } from '../../types';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

const categoryColors: Record<NotifCategory, string> = {
  plata: colors.copper,
  turnos: colors.cyan,
  seguridad: colors.red,
  salud: colors.emerald,
  beneficios: colors.purple,
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const accentColor = categoryColors[notification.category] ?? colors.textMuted;

  return (
    <Card
      onPress={onPress}
      style={notification.read ? styles.card : { ...styles.card, ...styles.unread }}
    >
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: accentColor }]} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              variant="bodySm"
              color={notification.read ? colors.textSecondary : colors.textPrimary}
              style={styles.title}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text variant="micro" color={colors.textMuted}>
              {formatTimeAgo(notification.timestamp)}
            </Text>
          </View>
          <Text variant="caption" color={colors.textMuted} numberOfLines={2}>
            {notification.description}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  unread: {
    borderLeftWidth: 2,
    borderLeftColor: colors.copper,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
  },
});
