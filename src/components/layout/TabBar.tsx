import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Svg, Path } from 'react-native-svg';
import { Text } from '../ui/Text';
import { SOSTabButton } from './SOSTabButton';
import { colors } from '../../theme/colors';
import { layout, spacing } from '../../theme/spacing';

const tabIcons: Record<string, { d: string; label: string }> = {
  index: {
    d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    label: 'Inicio',
  },
  plata: {
    d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    label: 'Plata',
  },
  sos: {
    d: '',
    label: 'SOS',
  },
  salud: {
    d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    label: 'Salud',
  },
  perfil: {
    d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    label: 'Perfil',
  },
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topBorder} />
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabInfo = tabIcons[route.name] || { d: '', label: route.name };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'sos') {
            return (
              <SOSTabButton
                key={route.key}
                onPress={onPress}
              />
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isFocused ? colors.copper : colors.textMuted}
                strokeWidth={isFocused ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d={tabInfo.d} />
              </Svg>
              <Text
                variant="micro"
                color={isFocused ? colors.copper : colors.textMuted}
                style={styles.tabLabel}
              >
                {tabInfo.label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  topBorder: {
    height: 1,
    backgroundColor: colors.copperMuted,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.obsidian,
    height: layout.tabBarHeight,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.sm,
    minWidth: 56,
    minHeight: layout.touchTarget,
  },
  tabLabel: {
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: colors.copper,
    borderRadius: 1,
  },
});
