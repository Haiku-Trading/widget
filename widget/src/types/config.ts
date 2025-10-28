import { WidgetTheme } from './theme'

export interface WidgetConfig {
  theme?: WidgetTheme
  hiddenChains?: number[]
  hiddenProtocols?: string[]
  multiInput?: boolean
  multiOutput?: boolean
  preselectedInputs?: Record<string, number> // token iid -> amount
  preselectedOutputs?: Record<string, number> // token iid -> weight
  lockedInputs?: boolean
  lockedOutputs?: boolean
}

export interface ConfigProviderProps {
  config?: WidgetConfig
  children: React.ReactNode
}
