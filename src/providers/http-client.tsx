import { createContext, ReactNode, useContext } from 'react'
import { HttpClient } from '../models/http-client'

const HttpClientContext = createContext<HttpClient | null>(null)

type HttpClientProviderProps = {
  client: HttpClient
  children: ReactNode
}

export function HttpClientProvider({ client, children }: HttpClientProviderProps) {
  return <HttpClientContext.Provider value={client}>{children}</HttpClientContext.Provider>
}

export function useHttpClient() {
  const context = useContext(HttpClientContext)
  if (!context) {
    throw new Error(`useHttpClient must be used within HttpClientProvider`)
  }
  return context
}
