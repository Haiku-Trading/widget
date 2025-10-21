import React, { createContext, useContext } from 'react'
import { WidgetConfig } from '../types/config'
import { useWidgetKey } from './widget-key-provider'

interface ConfigContextType {
  config: WidgetConfig
}

const ConfigContext = createContext<ConfigContextType | null>(null)

export function ConfigProvider({ config = {}, children }: { config?: Omit<WidgetConfig, 'widgetKey'>; children: React.ReactNode }) {
  const { widgetKey } = useWidgetKey()
  
  const contextValue: ConfigContextType = {
    config: {
      widgetKey,
      multiInput: true,
      multiOutput: true,
      lockedInputs: false,
      lockedOutputs: false,
      ...config,
    },
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
