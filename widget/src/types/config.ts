import { WidgetTheme } from './theme'

export interface WidgetConfig {
  theme?: WidgetTheme
  hiddenChains?: number[]
  hiddenProtocols?: string[]
  multiInput?: boolean
  multiOutput?: boolean
}

export interface ConfigProviderProps {
  config?: WidgetConfig
  children: React.ReactNode
}
