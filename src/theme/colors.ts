export const colors = {
  // Backgrounds
  background: '#060A14',
  obsidian: '#0A0E1A',
  surface: '#0F1420',
  elevated: '#161C2E',

  // Brand
  copper: '#C87533',
  copperLight: '#D4935A',
  copperDark: '#A05E28',
  copperMuted: 'rgba(200, 117, 51, 0.12)',
  copperGlow: 'rgba(200, 117, 51, 0.25)',

  // Accents
  cyan: '#00E5FF',
  cyanMuted: 'rgba(0, 229, 255, 0.15)',
  emerald: '#00C48C',
  emeraldMuted: 'rgba(0, 196, 140, 0.15)',
  red: '#FF3B4A',
  redMuted: 'rgba(255, 59, 74, 0.06)',
  redGlow: 'rgba(255, 59, 74, 0.25)',
  amber: '#FFB020',
  amberMuted: 'rgba(255, 176, 32, 0.15)',
  purple: '#6B4EFF',
  purpleMuted: 'rgba(107, 78, 255, 0.15)',

  // Text
  textPrimary: '#E8ECF4',
  textSecondary: '#8A94A6',
  textMuted: '#5A6478',
  textCopper: '#C87533',

  // Borders
  border: 'rgba(200, 117, 51, 0.12)',
  borderFocus: '#C87533',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',

  // Status
  statusOnline: '#00C48C',
  statusOffline: '#5A6478',
  statusBusy: '#FF3B4A',
  statusAway: '#FFB020',

  // Gradients (start, end)
  copperGradient: ['#C87533', '#D4935A'] as const,
  redGradient: ['#FF3B4A', '#8B0000'] as const,
  surfaceGradient: ['#0F1420', '#161C2E'] as const,
  backgroundGradient: ['#060A14', '#0A0E1A'] as const,

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(6, 10, 20, 0.85)',
} as const;

export type ColorKey = keyof typeof colors;
