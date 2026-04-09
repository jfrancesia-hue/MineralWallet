import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';
import { StatusDot } from './StatusDot';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, number> = {
  sm: layout.avatarSm,
  md: layout.avatarMd,
  lg: layout.avatarLg,
  xl: layout.avatarXl,
};

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  showStatus?: boolean;
  status?: 'online' | 'warning' | 'critical' | 'rest';
  borderColor?: string;
  style?: ViewStyle;
}

export function Avatar({
  name,
  imageUrl,
  size = 'md',
  showStatus = false,
  status = 'online',
  borderColor = colors.copper,
  style,
}: AvatarProps) {
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const fontSize = dimension < 40 ? 12 : dimension < 60 ? 14 : 18;

  return (
    <View style={[{ width: dimension, height: dimension }, style]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              borderColor,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              borderColor,
            },
          ]}
        >
          <Text variant="bodySm" color={colors.copper} style={{ fontSize }}>
            {initials}
          </Text>
        </View>
      )}
      {showStatus && (
        <View style={styles.statusContainer}>
          <StatusDot status={status} size={dimension < 48 ? 6 : 8} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
