import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { HttpClient, AxiosAdapter } from '../services/http-client'
import { useHaikuConfig } from './HaikuProvider'

const HttpClientContext = createContext<HttpClient | null>(null)

interface HttpClientProviderProps {
  children: ReactNode
}

export function HttpClientProvider({ children }: HttpClientProviderProps) {
  const { config } = useHaikuConfig()
  const [client, setClient] = useState<HttpClient | null>(null)

  useEffect(() => {
    const httpClient = new AxiosAdapter(config.baseUrl, config.apiKey)
    setClient(httpClient)
  }, [config.baseUrl, config.apiKey])

  if (!client) {
    return <div>Loading...</div>
  }

  return (
    <HttpClientContext.Provider value={client}>
      {children}
    </HttpClientContext.Provider>
  )
}

export function useHttpClient() {
  const context = useContext(HttpClientContext)
  if (!context) {
    throw new Error('useHttpClient must be used within HttpClientProvider')
  }
  return context
}
