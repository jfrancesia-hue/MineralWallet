import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing, layout } from '../../theme/spacing';
import { OfflineBanner } from '../shared/OfflineBanner';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  withTabBar?: boolean;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = true,
  padded = true,
  withTabBar = true,
  style,
}: ScreenContainerProps) {
  const content = (
    <>
      <OfflineBanner />
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            padded && styles.padded,
            withTabBar && styles.withTabBar,
            style,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, padded && styles.padded, style]}>
          {children}
        </View>
      )}
    </>
  );

  return (
    <View style={styles.root}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  withTabBar: {
    paddingBottom: layout.tabBarHeight + spacing['2xl'],
  },
});
