export { colors } from './colors';
export type { ColorKey } from './colors';
export { spacing, layout } from './spacing';
export { typography, fontFamilies } from './typography';

export const theme = {
  dark: true,
  colors: {
    primary: '#C87533',
    background: '#060A14',
    card: '#0F1420',
    text: '#E8ECF4',
    border: 'rgba(200, 117, 51, 0.12)',
    notification: '#FF3B4A',
  },
} as const;
