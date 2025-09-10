
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
  type TradeStore,
  type TradeState,
  createTradeStore,
  defaultTradeInitState,
} from '../stores'

export type TradeStoreApi = ReturnType<typeof createTradeStore>

export const TradeStoreContext = createContext<TradeStoreApi | undefined>(undefined)

export type TradeStoreProviderProps = Partial<TradeState> & {
  children: ReactNode
  context?: TradeStore['context']
  listener?: Parameters<TradeStoreApi['subscribe']>[0]
}

export const TradeStoreProvider = ({
  children,
  listener,
  ...initialStoreState
}: TradeStoreProviderProps) => {
  const storeRef = useRef<TradeStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createTradeStore({
      ...defaultTradeInitState,
      ...initialStoreState,
    })
    if (listener) {
      storeRef.current.subscribe(listener)
    }
  }

  return (
    <TradeStoreContext.Provider value={storeRef.current}>{children}</TradeStoreContext.Provider>
  )
}

export const useTradeStore = <T,>(selector: (store: TradeStore) => T): T => {
  const tradeStoreContext = useContext(TradeStoreContext)

  if (!tradeStoreContext) {
    throw new Error(`useTradeStore must be used within TradeStoreProvider`)
  }

  return useStore(tradeStoreContext, selector)
}
