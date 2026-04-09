import { TextStyle } from 'react-native';

export const fontFamilies = {
  mono: 'JetBrainsMono',
  monoBold: 'JetBrainsMono-Bold',
  heading: 'Outfit',
  headingBold: 'Outfit-Bold',
  headingSemiBold: 'Outfit-SemiBold',
  headingMedium: 'Outfit-Medium',
  body: 'DMSans',
  bodyMedium: 'DMSans-Medium',
  bodyBold: 'DMSans-Bold',
} as const;

export const typography = {
  // Money/Balance display
  balance: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 52,
    lineHeight: 60,
    letterSpacing: -1,
  } as TextStyle,

  // Large money
  moneyLg: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.5,
  } as TextStyle,

  // Medium money
  moneyMd: {
    fontFamily: fontFamilies.monoBold,
    fontSize: 28,
    lineHeight: 34,
  } as TextStyle,

  // Small money
  moneySm: {
    fontFamily: fontFamilies.mono,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  // Headings
  h1: {
    fontFamily: fontFamilies.headingBold,
    fontSize: 28,
    lineHeight: 34,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.headingSemiBold,
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.headingMedium,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  // Body
  bodyLg: {
    fontFamily: fontFamilies.body,
    fontSize: 18,
    lineHeight: 26,
  } as TextStyle,

  body: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,

  bodySm: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,

  // Labels (instrument feel)
  label: {
    fontFamily: fontFamilies.mono,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  } as TextStyle,

  labelSm: {
    fontFamily: fontFamilies.mono,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
  } as TextStyle,

  // Caption
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,

  // Micro
  micro: {
    fontFamily: fontFamilies.body,
    fontSize: 10,
    lineHeight: 14,
  } as TextStyle,

  // Button
  button: {
    fontFamily: fontFamilies.headingSemiBold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,

  buttonSm: {
    fontFamily: fontFamilies.headingMedium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;
