export interface WidgetTheme {
  mode?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  secondaryColor?: string
}

export interface ThemeProviderProps {
  theme?: WidgetTheme
  children: React.ReactNode
}
