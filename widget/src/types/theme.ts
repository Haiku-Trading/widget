export interface ColorPalette {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  successColor?: string
  warningColor?: string
  errorColor?: string
}

export interface WidgetTheme {
  mode?: 'light' | 'dark' | 'auto'
  light?: ColorPalette
  dark?: ColorPalette
}

export interface ThemeProviderProps {
  theme?: WidgetTheme
  children: React.ReactNode
}
