import React, { createContext, useContext, ReactNode } from 'react';
import { WidgetConfig, ThemeConfig } from '../types';

interface SwapWidgetContextValue {
  apiKey: string;
  supportedChains?: number[];
  theme?: ThemeConfig;
}

const SwapWidgetContext = createContext<SwapWidgetContextValue | undefined>(undefined);

interface SwapWidgetProviderProps {
  children: ReactNode;
  apiKey: string;
  supportedChains?: number[];
  theme?: ThemeConfig;
}

export function SwapWidgetProvider({
  children,
  apiKey,
  supportedChains,
  theme,
}: SwapWidgetProviderProps) {
  const value: SwapWidgetContextValue = {
    apiKey,
    supportedChains,
    theme,
  };

  // Apply theme if provided
  React.useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      if (theme.primaryColor) {
        root.style.setProperty('--haiku-primary-color', theme.primaryColor);
      }
      if (theme.secondaryColor) {
        root.style.setProperty('--haiku-secondary-color', theme.secondaryColor);
      }
      if (theme.backgroundColor) {
        root.style.setProperty('--haiku-background-color', theme.backgroundColor);
      }
      if (theme.textColor) {
        root.style.setProperty('--haiku-text-color', theme.textColor);
      }
      if (theme.borderRadius) {
        root.style.setProperty('--haiku-border-radius', theme.borderRadius);
      }
      if (theme.fontFamily) {
        root.style.setProperty('--haiku-font-family', theme.fontFamily);
      }
      if (theme.customCSS) {
        // Apply custom CSS
        const styleId = 'haiku-widget-custom-css';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.id = styleId;
          document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = theme.customCSS;
      }
    }
  }, [theme]);

  return (
    <SwapWidgetContext.Provider value={value}>
      {children}
    </SwapWidgetContext.Provider>
  );
}

export function useSwapWidget() {
  const context = useContext(SwapWidgetContext);
  if (context === undefined) {
    throw new Error('useSwapWidget must be used within a SwapWidgetProvider');
  }
  return context;
}
