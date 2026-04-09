import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { layout } from '../../theme/spacing';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = layout.borderRadius.sm,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as number, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <Animated.View style={[styles.card, style]}>
      <Skeleton width="40%" height={14} style={styles.cardLabel} />
      <Skeleton width="70%" height={28} style={styles.cardTitle} />
      <Skeleton width="100%" height={12} />
    </Animated.View>
  );
}

export function SkeletonList({ count = 3, style }: { count?: number; style?: ViewStyle }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.listItem, style]}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Animated.View style={styles.listContent}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} style={styles.listSub} />
          </Animated.View>
          <Skeleton width={60} height={18} />
        </Animated.View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.elevated,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.lg,
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  cardLabel: {
    marginBottom: 4,
  },
  cardTitle: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listSub: {
    marginTop: 2,
  },
});
