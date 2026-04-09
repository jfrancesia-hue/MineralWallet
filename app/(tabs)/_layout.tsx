import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/spacing';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.obsidian,
          borderTopWidth: 1,
          borderTopColor: colors.copperMuted,
          height: layout.tabBarHeight,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.copper,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'DMSans',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="plata"
        options={{
          title: 'Plata',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="salud"
        options={{
          title: 'Salud',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
