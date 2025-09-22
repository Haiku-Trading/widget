import React, { createContext, useContext } from 'react'
import { WidgetConfig } from '../types/config'

interface ConfigContextType {
  config: WidgetConfig
}

const ConfigContext = createContext<ConfigContextType | null>(null)

export function ConfigProvider({ config = {}, children }: { config?: WidgetConfig; children: React.ReactNode }) {
  const contextValue: ConfigContextType = {
    config,
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
