// Obsidian Foundry - Spacing & Layout tokens
// Corner radius: DEFAULT 4px, MAX 12px (xl). Nunca "bubbly".

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
} as const;

export const layout = {
  screenPadding: 20,
  cardPadding: 20,
  sectionGap: 32,
  borderRadius: {
    // Industrial precision - sharp corners
    none: 0,
    xs: 2,
    sm: 4,    // DEFAULT - buttons, cards, chips
    md: 6,    // medium elements
    lg: 8,    // elevated cards
    xl: 12,   // MAX - hero cards, modals (nunca mas)
    full: 9999, // solo avatares y status dots
  },
  touchTarget: 52,
  sosButtonSize: 60,
  avatarSm: 36,
  avatarMd: 48,
  avatarLg: 60,
  avatarXl: 80,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  tabBarHeight: 80,
  statusBarHeight: 44,
  // Ghost border width (cuando se necesita hint de limite)
  ghostBorderWidth: 1,
  // Accent bars (para status cards)
  accentBarWidth: 3,
  // Copper hairline (top border signature en hero cards)
  hairlineWidth: 2,
} as const;

// Tonal elevation - guia de apilamiento para profundidad sin sombras
export const elevation = {
  // Item sobre background -> surfaceLow
  lift1: 'surfaceLow',
  // Card sobre surfaceLow -> surfaceContainer
  lift2: 'surfaceContainer',
  // Input/active sobre card -> surfaceHigh
  lift3: 'surfaceHigh',
  // Modal/overlay flotante -> surfaceHighest
  lift4: 'surfaceHighest',
} as const;
