// Obsidian Foundry - Editorial Voice Typography
// Space Grotesk (display/headlines) + Be Vietnam Pro (body) + JetBrains Mono (data)

import { TextStyle } from 'react-native';

export const fontFamilies = {
  // Data & numbers - precision instrument
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',

  // Display & headlines - industrial geometric anchor
  display: 'SpaceGrotesk_500Medium',
  displayBold: 'SpaceGrotesk_700Bold',
  displaySemiBold: 'SpaceGrotesk_600SemiBold',

  // Body & titles - warm human readable
  body: 'BeVietnamPro_400Regular',
  bodyMedium: 'BeVietnamPro_500Medium',
  bodySemiBold: 'BeVietnamPro_600SemiBold',
  bodyBold: 'BeVietnamPro_700Bold',

  // Legacy aliases (compat)
  heading: 'SpaceGrotesk_500Medium',
  headingBold: 'SpaceGrotesk_700Bold',
  headingSemiBold: 'SpaceGrotesk_600SemiBold',
  headingMedium: 'SpaceGrotesk_500Medium',
} as const;

export const typography = {
  // Display - hero brand, massive
  displayLg: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 64,
    lineHeight: 68,
    letterSpacing: -2,
  } as TextStyle,

  display: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
  } as TextStyle,

  // Money - the hero of every screen (JetBrains Mono always)
  balance: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -1.5,
  } as TextStyle,

  moneyLg: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.5,
  } as TextStyle,

  moneyMd: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 28,
    lineHeight: 34,
  } as TextStyle,

  moneySm: {
    fontFamily: fontFamilies.mono,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  // Headings - Space Grotesk industrial stamp feel
  h1: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.displaySemiBold,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  // Body - Be Vietnam Pro warm human
  bodyLg: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    lineHeight: 26,
  } as TextStyle,

  body: {
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,

  bodySm: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,

  // Labels - monospace instrument feel (wide tracking)
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
  } as TextStyle,

  labelSm: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  } as TextStyle,

  // Caption
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  micro: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    lineHeight: 14,
  } as TextStyle,

  // Buttons - authoritative stamp
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,

  buttonSm: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;
