import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    />
  );
}
