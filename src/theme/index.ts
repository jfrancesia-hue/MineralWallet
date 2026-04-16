export { colors } from './colors';
export type { ColorKey } from './colors';
export { spacing, layout, elevation } from './spacing';
export { typography, fontFamilies } from './typography';

export const theme = {
  dark: true,
  colors: {
    primary: '#FFB784',
    background: '#060A14',
    card: '#161C2E',
    text: '#E8ECF4',
    border: 'rgba(58, 66, 88, 0.3)',
    notification: '#FF5555',
  },
} as const;
