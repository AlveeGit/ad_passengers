export const theme = {
  colors: {
    primary: '#0B6EFD',
    accent: '#FFB020',
    background: '#F8F9FB',
    text: '#1F2937',
    subtleText: '#6B7280',
    card: '#FFFFFF',
    border: '#E5E7EB',
    danger: '#DC2626',
    success: '#059669',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },
  tabs: {
    height: 64,
  },
} as const;

export type AppTheme = typeof theme;
