import React, { createContext, useContext } from 'react'

interface PreselectedTokensContextType {
  isResolvingPreselectedTokens: boolean
}

const PreselectedTokensContext = createContext<PreselectedTokensContextType | null>(null)

export function PreselectedTokensProvider({ 
  children, 
  isResolvingPreselectedTokens 
}: { 
  children: React.ReactNode
  isResolvingPreselectedTokens: boolean 
}) {
  return (
    <PreselectedTokensContext.Provider value={{ isResolvingPreselectedTokens }}>
      {children}
    </PreselectedTokensContext.Provider>
  )
}

export function usePreselectedTokensContext(): PreselectedTokensContextType {
  const context = useContext(PreselectedTokensContext)
  if (!context) {
    // Return default values if context is not available
    return { isResolvingPreselectedTokens: false }
  }
  return context
}
