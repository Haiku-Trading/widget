import { WidgetTheme } from './theme'
import { Category } from '../services/get-tokens'

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
  tokenSelect?: 'simple' | 'default'
  bridgeMode?: 'open' | 'fast' | 'economy'
  allowedInputCategories?: Category[]
  allowedOutputCategories?: Category[]
  allowedInputTokens?: string[]
  allowedOutputTokens?: string[]
}

export interface ConfigProviderProps {
  config?: WidgetConfig
  children: React.ReactNode
}
