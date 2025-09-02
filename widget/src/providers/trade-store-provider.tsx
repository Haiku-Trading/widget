import React, { createContext, useContext, ReactNode, useRef } from 'react'
import { useStore, StoreApi } from 'zustand'
import { createTradeStore, TradeStore, defaultTradeInitState } from '../stores/trade-store'

interface TradeStoreContextValue {
  store: StoreApi<TradeStore>
}

const TradeStoreContext = createContext<TradeStoreContextValue | null>(null)

export const useTradeStore = <T,>(selector: (state: TradeStore) => T): T => {
  const context = useContext(TradeStoreContext)
  if (!context) {
    throw new Error('useTradeStore must be used within TradeStoreProvider')
  }
  return useStore(context.store, selector)
}

interface TradeStoreProviderProps {
  children: ReactNode
}

export function TradeStoreProvider({ children }: TradeStoreProviderProps) {
  const storeRef = useRef<StoreApi<TradeStore>>()
  
  if (!storeRef.current) {
    storeRef.current = createTradeStore(defaultTradeInitState)
  }

  return (
    <TradeStoreContext.Provider value={{ store: storeRef.current }}>
      {children}
    </TradeStoreContext.Provider>
  )
}
