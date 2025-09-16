import React, { createContext, useContext, useEffect, useRef } from 'react'
import { WidgetTheme, ThemeProviderProps } from '../types/theme'
import { applyThemeToElement } from '../utils/theme-utils'

interface ThemeContextType {
  theme: WidgetTheme
  setTheme: (theme: WidgetTheme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ theme = {}, children }: ThemeProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTheme, setCurrentTheme] = React.useState<WidgetTheme>(theme)

  // Apply theme to container when theme changes
  useEffect(() => {
    if (containerRef.current) {
      applyThemeToElement(containerRef.current, currentTheme)
    }
  }, [currentTheme])

  // Update theme when props change
  useEffect(() => {
    setCurrentTheme(theme)
  }, [theme])

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    setTheme: setCurrentTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div ref={containerRef} className="haiku-widget-theme-container">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
