import React, { createContext, useContext } from 'react'

interface WidgetKeyContextType {
  widgetKey: string
}

const WidgetKeyContext = createContext<WidgetKeyContextType | null>(null)

interface WidgetKeyProviderProps {
  widgetKey: string
  children: React.ReactNode
}

export function WidgetKeyProvider({ widgetKey, children }: WidgetKeyProviderProps) {
  // Validate widget key
  if (!widgetKey || widgetKey.trim() === '') {
    throw new Error('WidgetKey is required and cannot be empty. Please provide a valid widget key.')
  }

  const contextValue: WidgetKeyContextType = {
    widgetKey: widgetKey.trim(),
  }

  return (
    <WidgetKeyContext.Provider value={contextValue}>
      {children}
    </WidgetKeyContext.Provider>
  )
}

export function useWidgetKey(): WidgetKeyContextType {
  const context = useContext(WidgetKeyContext)
  if (!context) {
    throw new Error('useWidgetKey must be used within a WidgetKeyProvider')
  }
  return context
}
