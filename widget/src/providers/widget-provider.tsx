'use client'

import { ReactNode, useState } from 'react'
import { AxiosAdapter } from '../services/axios-adapter'
import { HttpClientProvider } from './http-client'
import { SessionStoreProvider } from './session'
import { TradeStoreProvider } from './index'

// Minimal provider that only provides HTTP client and session stores for the widget
export function WidgetHttpProvider({ children }: { children: ReactNode }) {
  const [httpClient] = useState(
    () =>
      new AxiosAdapter({
        baseURL: 'http://localhost:5001/v1',
        request: {
          onIntercept(request) {
            if (request.url?.includes('inference')) return
            request.headers['api-key'] = '002b827f-b1da-4135-ac68-9a24fdd67533'
          },
        },
      }),
  )

  return (
    <HttpClientProvider client={httpClient}>
      <SessionStoreProvider>
        <TradeStoreProvider>
          {children}
        </TradeStoreProvider>
      </SessionStoreProvider>
    </HttpClientProvider>
  )
}
