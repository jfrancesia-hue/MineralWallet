import React from 'react';
import { Tabs } from 'expo-router';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { colors } from '../../src/theme/colors';
import { layout } from '../../src/theme/spacing';
import { fontFamilies } from '../../src/theme/typography';
import { SOSTabButton } from '../../src/components/layout/SOSTabButton';

type IconProps = { color: string; focused: boolean };

function HomeIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12l9-8 9 8v8a2 2 0 01-2 2h-3v-6h-4v6H5a2 2 0 01-2-2z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}
function WalletIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7h16a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke={color} strokeWidth={1.6} />
      <Path d="M3 7a2 2 0 012-2h11v2" stroke={color} strokeWidth={1.6} />
      <Circle cx={17} cy={13} r={1.4} fill={color} />
    </Svg>
  );
}
function HeartIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20s-7-4.35-9-9.5C1.5 6 5 3 8 4.5c1.6.8 2.8 2.1 4 3.5 1.2-1.4 2.4-2.7 4-3.5 3-1.5 6.5 1.5 5 6-2 5.15-9 9.5-9 9.5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}
function UserIcon({ color }: IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.6} />
      <Path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceLowest,
          borderTopWidth: 0,
          height: layout.tabBarHeight,
          paddingBottom: 16,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.copper,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fontFamilies.mono,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plata"
        options={{
          title: 'Plata',
          tabBarIcon: ({ color, focused }) => <WalletIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <SOSTabButton {...(props as any)} />,
        }}
      />
      <Tabs.Screen
        name="salud"
        options={{
          title: 'Salud',
          tabBarIcon: ({ color, focused }) => <HeartIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <UserIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
