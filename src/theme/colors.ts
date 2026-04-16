// Obsidian Foundry Design System - Color Tokens
// Palette: Copper + Cyan + Emerald on warm Obsidian base.
// Rule: depth via tonal layering, NOT borders or shadows.

export const colors = {
  // Base background (obsidian floor)
  background: '#060A14',

  // Surface tiers - apilar para crear profundidad (Material You style)
  surfaceLowest: '#0A0E1A',
  surface: '#0F1420',
  surfaceLow: '#161C2E',       // cards nivel 1
  surfaceContainer: '#1D2436', // cards nivel 2
  surfaceHigh: '#262D40',      // inputs, elementos activos
  surfaceHighest: '#313442',   // elementos mas elevados

  // Legacy aliases (compat con codigo existente)
  obsidian: '#0A0E1A',
  elevated: '#262D40',

  // Primary - Copper signature
  copper: '#FFB784',
  copperLight: '#FFC89A',
  copperDark: '#9E5E28',
  copperMuted: 'rgba(255, 183, 132, 0.12)',
  copperGlow: 'rgba(255, 183, 132, 0.25)',
  copperSubtle: 'rgba(255, 183, 132, 0.06)',

  // Secondary - Cyan (datos tecnicos, live states)
  cyan: '#BDF4FF',
  cyanDark: '#6FCFE8',
  cyanMuted: 'rgba(189, 244, 255, 0.15)',
  cyanSubtle: 'rgba(189, 244, 255, 0.08)',

  // Tertiary - Emerald (exito, seguridad, growth)
  emerald: '#3FDFA5',
  emeraldDark: '#1FA878',
  emeraldMuted: 'rgba(63, 223, 165, 0.15)',
  emeraldSubtle: 'rgba(63, 223, 165, 0.08)',

  // Error - Red (emergencias)
  red: '#FF5555',
  redDark: '#8B0000',
  redMuted: 'rgba(255, 85, 85, 0.08)',
  redGlow: 'rgba(255, 85, 85, 0.3)',
  redSubtle: 'rgba(255, 85, 85, 0.04)',

  // Warning - Amber (precaucion, pendientes)
  amber: '#FFB020',
  amberMuted: 'rgba(255, 176, 32, 0.15)',
  amberSubtle: 'rgba(255, 176, 32, 0.08)',

  // Accent - Purple (nocturno, bienestar mental)
  purple: '#9B82FF',
  purpleMuted: 'rgba(155, 130, 255, 0.15)',
  purpleSubtle: 'rgba(155, 130, 255, 0.08)',

  // Text (warm white - NUNCA pure white)
  textPrimary: '#E8ECF4',
  textSecondary: '#A8AFC0',
  textMuted: '#5A6478',
  textCopper: '#FFB784',

  // Ghost borders (solo cuando accesibilidad exige) - outline_variant 15%
  ghostBorder: 'rgba(58, 66, 88, 0.6)',
  // Legacy border aliases
  border: 'rgba(58, 66, 88, 0.4)',
  borderFocus: '#FFB784',
  borderSubtle: 'rgba(58, 66, 88, 0.3)',

  // Status
  statusOnline: '#3FDFA5',
  statusOffline: '#5A6478',
  statusBusy: '#FF5555',
  statusAway: '#FFB020',

  // Signature gradients
  copperGradient: ['#FFB784', '#9E5E28'] as const,
  copperGradientLight: ['#FFC89A', '#FFB784'] as const,
  redGradient: ['#FF5555', '#8B0000'] as const,
  surfaceGradient: ['#0F1420', '#1D2436'] as const,
  surfaceDiagonal: ['#0F1420', '#262D40'] as const,
  backgroundGradient: ['#060A14', '#0A0E1A'] as const,
  cyanGradient: ['#BDF4FF', '#6FCFE8'] as const,
  emeraldGradient: ['#3FDFA5', '#1FA878'] as const,

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(6, 10, 20, 0.85)',
  overlayLight: 'rgba(6, 10, 20, 0.5)',
} as const;

export type ColorKey = keyof typeof colors;
