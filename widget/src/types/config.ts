import { WidgetTheme } from './theme'

export interface WidgetConfig {
  theme?: WidgetTheme
  hiddenChains?: number[]
  hiddenProtocols?: string[]
}

export interface ConfigProviderProps {
  config?: WidgetConfig
  children: React.ReactNode
}
