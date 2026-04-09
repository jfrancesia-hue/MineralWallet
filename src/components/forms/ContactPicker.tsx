import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../ui';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import type { FamilyContact } from '../../types';

interface ContactPickerProps {
  contacts: FamilyContact[];
  selectedId?: string;
  onSelect: (contact: FamilyContact) => void;
  showAddButton?: boolean;
  onAddPress?: () => void;
}

export function ContactPicker({
  contacts,
  selectedId,
  onSelect,
  showAddButton = true,
  onAddPress,
}: ContactPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {contacts.map((contact) => {
          const isSelected = contact.id === selectedId;
          return (
            <TouchableOpacity
              key={contact.id}
              onPress={() => onSelect(contact)}
              style={styles.item}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                <Text variant="bodySm" color={isSelected ? colors.textPrimary : colors.copper}>
                  {contact.name[0]}
                </Text>
              </View>
              <Text variant="caption" color={isSelected ? colors.textPrimary : colors.textSecondary}>
                {contact.name}
              </Text>
              <Text variant="micro" color={colors.textMuted}>
                {contact.relationship}
              </Text>
            </TouchableOpacity>
          );
        })}
        {showAddButton && (
          <TouchableOpacity onPress={onAddPress} style={styles.item} activeOpacity={0.7}>
            <View style={styles.addAvatar}>
              <Text variant="h3" color={colors.textMuted}>+</Text>
            </View>
            <Text variant="caption" color={colors.textMuted}>Nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 64,
  },
  avatar: {
    width: layout.avatarLg,
    height: layout.avatarLg,
    borderRadius: layout.avatarLg / 2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.copper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: {
    backgroundColor: colors.copper,
    borderColor: colors.copperLight,
  },
  addAvatar: {
    width: layout.avatarLg,
    height: layout.avatarLg,
    borderRadius: layout.avatarLg / 2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.textMuted,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
