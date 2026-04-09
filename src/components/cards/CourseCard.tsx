import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Badge, ProgressBar } from '../ui';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

const difficultyVariant: Record<string, 'emerald' | 'amber' | 'red'> = {
  basico: 'emerald',
  intermedio: 'amber',
  avanzado: 'red',
};

const typeColors: Record<string, string> = {
  obligatorio: colors.red,
  recomendado: colors.amber,
  voluntario: colors.cyan,
};

export function CourseCard({ course, onPress }: CourseCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text variant="bodySm" color={colors.textPrimary} style={styles.name} numberOfLines={2}>
          {course.name}
        </Text>
        <Badge label={course.difficulty} variant={difficultyVariant[course.difficulty] ?? 'default'} />
      </View>

      <View style={styles.meta}>
        <Text variant="caption" color={colors.textMuted}>{course.hours}h</Text>
        <View style={[styles.typeDot, { backgroundColor: typeColors[course.type] ?? colors.textMuted }]} />
        <Text variant="caption" color={colors.textMuted}>{course.type}</Text>
        <Text variant="caption" color={colors.purple}>+{course.xpReward} XP</Text>
      </View>

      {course.progress > 0 && (
        <View style={styles.progress}>
          <ProgressBar progress={course.progress} color={colors.cyan} height={4} />
          <Text variant="micro" color={colors.textMuted}>{course.progress}%</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
