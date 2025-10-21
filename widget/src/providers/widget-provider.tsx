
import { ReactNode, useState } from 'react'
import { AxiosAdapter } from '../services/axios-adapter'
import { HttpClientProvider } from './http-client'
import { SessionStoreProvider } from './session'
import { TradeStoreProvider } from './index'
import { TooltipProvider } from '../components/tooltip/tooltip'
import { useWidgetKey } from './widget-key-provider'

// Minimal provider that only provides HTTP client and session stores for the widget
// The widget expects to be used within a WagmiProvider and QueryClientProvider from the host application
export function WidgetHttpProvider({ children }: { children: ReactNode }) {
  const { widgetKey } = useWidgetKey()
  
  const [httpClient] = useState(
    () =>
      new AxiosAdapter({
        baseURL: process.env.API_BASE_URL || 'https://api.haiku.trade/v1',
        widgetKey: widgetKey,
      }),
  )

  return (
    <TooltipProvider>
      <HttpClientProvider client={httpClient}>
        <SessionStoreProvider>
          <TradeStoreProvider>
            {children}
          </TradeStoreProvider>
        </SessionStoreProvider>
      </HttpClientProvider>
    </TooltipProvider>
  )
}
