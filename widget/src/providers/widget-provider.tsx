
import { ReactNode, useState } from 'react'
import { AxiosAdapter } from '../services/axios-adapter'
import { HttpClientProvider } from './http-client'
import { SessionStoreProvider } from './session'
import { TradeStoreProvider } from './index'
import { TooltipProvider } from '../components/tooltip/tooltip'
import { useWidgetKey } from './widget-key-provider'
import { useConfig } from './config-provider'
import { BridgeMode } from '../enums/bridge-mode'

// Minimal provider that only provides HTTP client and session stores for the widget
// The widget expects to be used within a WagmiProvider and QueryClientProvider from the host application
export function WidgetHttpProvider({ children }: { children: ReactNode }) {
  const { widgetKey } = useWidgetKey()
  const { config } = useConfig()
  
  const [httpClient] = useState(
    () =>
      new AxiosAdapter({
        baseURL: process.env.API_BASE_URL || 'https://api.haiku.trade/v1',
        widgetKey: widgetKey,
      }),
  )

  // Determine initial bridgeMode from config
  const initialBridgeMode = config.bridgeMode === 'fast' 
    ? BridgeMode.Fast 
    : config.bridgeMode === 'economy' 
    ? BridgeMode.Economy 
    : BridgeMode.Fast // default to Fast for 'open' or undefined

  return (
    <TooltipProvider>
      <HttpClientProvider client={httpClient}>
        <SessionStoreProvider>
          <TradeStoreProvider bridgeMode={initialBridgeMode}>
            {children}
          </TradeStoreProvider>
        </SessionStoreProvider>
      </HttpClientProvider>
    </TooltipProvider>
  )
}
