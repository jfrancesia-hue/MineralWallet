import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, MoneyText } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import type { FamilyContact } from '../../types';

interface FamilyContactCardProps {
  contact: FamilyContact;
  onPress?: () => void;
  compact?: boolean;
}

export function FamilyContactCard({ contact, onPress, compact = false }: FamilyContactCardProps) {
  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.compact} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Text variant="bodySm" color={colors.copper}>{contact.name[0]}</Text>
        </View>
        <Text variant="caption" color={colors.textPrimary}>{contact.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.full} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text variant="bodySm" color={colors.copper}>{contact.name[0]}</Text>
        </View>
        <View style={styles.content}>
          <Text variant="bodySm" color={colors.textPrimary}>{contact.name}</Text>
          <Text variant="caption" color={colors.textMuted}>{contact.relationship} · {contact.method}</Text>
        </View>
        <View style={styles.amountCol}>
          <MoneyText amount={contact.lastSentAmount} variant="moneySm" color={colors.textPrimary} />
          <Text variant="micro" color={colors.textMuted}>ultimo envio</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compact: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  full: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.copperMuted,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
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
  content: {
    flex: 1,
    gap: 2,
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
