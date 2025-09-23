export interface WidgetTheme {
  mode?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
  // Optional overrides for specific color roles
  accentColor?: string
  successColor?: string
  warningColor?: string
  errorColor?: string
}

export interface ThemeProviderProps {
  theme?: WidgetTheme
  children: React.ReactNode
}
