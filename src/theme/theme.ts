// Light Theme Colors
export const lightColors = {
  // Primary colors
  primary: '#0B6EFD',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',

  // Secondary colors
  secondary: '#64748B',
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',

  // Success, warning, error
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  // Background colors
  background: '#F6F8FB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceTertiary: '#E2E8F0',

  // Text colors
  textPrimary: '#1E1E1E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#000000',
  textError: '#EF4444',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Status colors
  pending: '#F59E0B',
  approved: '#10B981',
  expired: '#EF4444',
  rejected: '#DC2626',

  // Chart colors
  chartPrimary: '#0B6EFD',
  chartSecondary: '#10B981',
  chartTertiary: '#FFB020',

  // Other colors
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

// Dark Theme Colors
export const darkColors = {
  // Primary colors
  primary: '#0B6EFD',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',

  // Secondary colors
  secondary: '#94A3B8',
  secondaryLight: '#CBD5E1',
  secondaryDark: '#64748B',

  // Success, warning, error
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  // Background colors
  background: '#0A0E1A',
  surface: '#1A1F2E',
  surfaceSecondary: '#252B3D',
  surfaceTertiary: '#334155',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B8C5D1',
  textTertiary: '#8A9BA8',
  textInverse: '#FFFFFF',
  textError: '#EF4444',

  // Border colors
  border: '#2D3748',
  borderLight: '#4A5568',
  borderDark: '#1A202C',

  // Status colors
  pending: '#F59E0B',
  approved: '#10B981',
  expired: '#EF4444',
  rejected: '#DC2626',

  // Chart colors
  chartPrimary: '#0B6EFD',
  chartSecondary: '#10B981',
  chartTertiary: '#FFB020',

  // Other colors
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 44,
    display: 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;

const baseShadowColor = '#000000';

const colors = {
  black: baseShadowColor,
  white: baseShadowColor,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

// Theme modes
export type ThemeMode = 'light' | 'dark';

// Create theme objects
export const lightTheme = {
  mode: 'light' as const,
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  tabs: {
    height: 56,
  },
} as const;

export const darkTheme = {
  mode: 'dark' as const,
  colors: darkColors,
  spacing,
  borderRadius,
  typography,
  shadows,
  tabs: {
    height: 56,
  },
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
export type Colors = typeof lightColors | typeof darkColors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Shadows = typeof shadows;

// Legacy theme export for backward compatibility
export const theme = lightTheme;
export type AppTheme = Theme;
