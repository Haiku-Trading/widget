import BigNumber from 'bignumber.js'
import { createStore } from 'zustand/vanilla'

export interface AnyAPIToken {
  iid: string
  symbol: string
  name: string
  address: string
  chainId: number
  network: number
  decimals: number
  logoURI?: string
  priceUSD?: string
  percentage?: number
  showSlider?: boolean
}

export interface TradeAlertsType {
  isActive: boolean
  type: 'error' | 'warning' | 'info' | 'success'
  message: string
}

export type TradeState = {
  context: 'classic' | 'agent'
  inputTokens: AnyAPIToken[]
  outputTokens: AnyAPIToken[]
  inputChainIds: number[]
  outputChainIds: number[]
  usdInputTotal: string
  slippage: string
  alerts: TradeAlertsType[]
  inputPositions: Record<string, string>
  targetWeights: Record<string, number>
  isShowBalance: boolean
  isTokenView: boolean
}

export type TradeActions = {
  setSlippage: (slippage: string) => void
  addInputToken: (tokens: AnyAPIToken[]) => void
  removeInputToken: (token: AnyAPIToken) => void
  addOutputToken: (tokens: AnyAPIToken[]) => void
  removeOutputToken: (token: AnyAPIToken) => void
  setTokenValue: (token: AnyAPIToken, value: string) => void
  swapToken: () => void
  updateTokensUSDPrice: (tokens: AnyAPIToken[]) => void
  updateAlerts: (alerts: TradeAlertsType[]) => void
  setTargetWeights: (targetWeights: Record<string, number>) => void
  setTradeState: (state: Partial<TradeState>) => void
  reset: () => void
  handleShowBalance: () => void
  toggleLock: (iid: string) => void
  toggleSlider: (iid: string, type: 'output' | 'input') => void
  handlePercentageChange: (iid: string, newPercentage: number) => void
  handlePercentageInputChange: (iid: string, newPercentage: number, balance: number) => void
  setIsTokenView: (state: boolean) => void
  clearSlider: (type: 'output' | 'input') => void
  addMoreAlerts: (alerts: TradeAlertsType[]) => void
  removeAlerts: (alerts: TradeAlertsType[]) => void
  updateAlert: (alerts: TradeAlertsType[]) => void
  clearAlerts: () => void
}

export type TradeStore = TradeState & TradeActions

const getTotalUSD = (inputPositions: Record<string, string>, inputTokens: AnyAPIToken[]): string => {
  if (!inputPositions || !inputTokens.length) return '0'

  return inputTokens.reduce((acc, token) => {
    const position = inputPositions[token.iid]
    if (!position || !token.priceUSD) return acc

    const positionBN = new BigNumber(position)
    const priceBN = new BigNumber(token.priceUSD)
    const tokenTotal = positionBN.times(priceBN)

    return BigNumber(acc).plus(tokenTotal).toString()
  }, '0')
}

export const defaultTradeInitState: TradeState = {
  context: 'classic',
  inputTokens: [],
  outputTokens: [],
  inputChainIds: [],
  outputChainIds: [],
  usdInputTotal: '0',
  slippage: '0.003',
  alerts: [],
  inputPositions: {},
  targetWeights: {},
  isShowBalance: true,
  isTokenView: true,
}

export const createTradeStore = (initState: TradeState = defaultTradeInitState) => {
  return createStore<TradeStore>()((set, get) => ({
    ...initState,
    usdInputTotal: getTotalUSD(initState.inputPositions, initState.inputTokens),
    
    updateAlerts: (alerts) => set({ alerts }),
    setSlippage: (slippage) => set({ slippage }),
    setTargetWeights: (targetWeights) => set({ targetWeights }),
    
    setTradeState: (newState) => {
      set((state) => {
        const updatedState = { ...state, ...newState }
        if (newState.inputPositions || newState.inputTokens) {
          updatedState.usdInputTotal = getTotalUSD(
            newState.inputPositions || state.inputPositions,
            newState.inputTokens || state.inputTokens,
          )
        }
        return updatedState
      })
    },
    
    reset: () => set(initState),
    
    addInputToken: (tokens) => {
      set((state) => {
        const modifyTokens = tokens.map((item) => ({
          ...item,
          showSlider: false,
        }))
        const newInputTokens = state.inputTokens.concat(modifyTokens)
        const newInputChainIds = [...new Set(newInputTokens.map((token) => token.chainId))]
        
        return {
          ...state,
          inputTokens: newInputTokens,
          inputChainIds: newInputChainIds,
          usdInputTotal: getTotalUSD(state.inputPositions, newInputTokens),
        }
      })
    },
    
    removeInputToken: (token) => {
      set((state) => {
        const newInputTokens = state.inputTokens.filter((item) => item.iid !== token.iid)
        const newInputChainIds = [...new Set(newInputTokens.map((token) => token.chainId))]
        
        return {
          ...state,
          inputTokens: newInputTokens,
          inputChainIds: newInputChainIds,
          usdInputTotal: getTotalUSD(state.inputPositions, newInputTokens),
        }
      })
    },
    
    addOutputToken: (tokens) => {
      set((state) => {
        const newOutputTokens = state.outputTokens.concat(tokens)
        const newOutputChainIds = [...new Set(newOutputTokens.map((token) => token.chainId))]
        
        return {
          ...state,
          outputTokens: newOutputTokens,
          outputChainIds: newOutputChainIds,
        }
      })
    },
    
    removeOutputToken: (token) => {
      set((state) => {
        const newOutputTokens = state.outputTokens.filter((item) => item.iid !== token.iid)
        const newOutputChainIds = [...new Set(newOutputTokens.map((token) => token.chainId))]
        
        return {
          ...state,
          outputTokens: newOutputTokens,
          outputChainIds: newOutputChainIds,
        }
      })
    },
    
    setTokenValue: (token, value) => {
      set((state) => {
        const newInputPositions = { ...state.inputPositions, [token.iid]: value }
        return {
          ...state,
          inputPositions: newInputPositions,
          usdInputTotal: getTotalUSD(newInputPositions, state.inputTokens),
        }
      })
    },
    
    swapToken: () => {
      set((state) => ({
        ...state,
        inputTokens: state.outputTokens,
        outputTokens: state.inputTokens,
        inputChainIds: state.outputChainIds,
        outputChainIds: state.inputChainIds,
        inputPositions: {},
        usdInputTotal: '0',
      }))
    },
    
    updateTokensUSDPrice: (tokens) => {
      set((state) => {
        const updatedInputTokens = state.inputTokens.map((inputToken) => {
          const updatedToken = tokens.find((token) => token.iid === inputToken.iid)
          return updatedToken ? { ...inputToken, priceUSD: updatedToken.priceUSD } : inputToken
        })
        
        return {
          ...state,
          inputTokens: updatedInputTokens,
          usdInputTotal: getTotalUSD(state.inputPositions, updatedInputTokens),
        }
      })
    },
    
    handleShowBalance: () => set((state) => ({ isShowBalance: !state.isShowBalance })),
    setIsTokenView: (isTokenView) => set({ isTokenView }),
    
    toggleLock: (iid) => {
      set((state) => ({
        ...state,
        inputTokens: state.inputTokens.map((token) =>
          token.iid === iid ? { ...token, showSlider: !token.showSlider } : token
        ),
      }))
    },
    
    toggleSlider: (iid, type) => {
      if (type === 'input') {
        set((state) => ({
          ...state,
          inputTokens: state.inputTokens.map((token) =>
            token.iid === iid ? { ...token, showSlider: !token.showSlider } : token
          ),
        }))
      } else {
        set((state) => ({
          ...state,
          outputTokens: state.outputTokens.map((token) =>
            token.iid === iid ? { ...token, showSlider: !token.showSlider } : token
          ),
        }))
      }
    },
    
    handlePercentageChange: (iid, newPercentage) => {
      set((state) => ({
        ...state,
        outputTokens: state.outputTokens.map((token) =>
          token.iid === iid ? { ...token, percentage: newPercentage } : token
        ),
      }))
    },
    
    handlePercentageInputChange: (iid, newPercentage, balance) => {
      set((state) => ({
        ...state,
        outputTokens: state.outputTokens.map((token) =>
          token.iid === iid ? { ...token, percentage: newPercentage } : token
        ),
      }))
    },
    
    clearSlider: (type) => {
      if (type === 'input') {
        set((state) => ({
          ...state,
          inputTokens: state.inputTokens.map((token) => ({ ...token, showSlider: false })),
        }))
      } else {
        set((state) => ({
          ...state,
          outputTokens: state.outputTokens.map((token) => ({ ...token, showSlider: false })),
        }))
      }
    },
    
    addMoreAlerts: (alerts) => {
      set((state) => ({
        ...state,
        alerts: [...state.alerts, ...alerts],
      }))
    },
    
    removeAlerts: (alerts) => {
      set((state) => ({
        ...state,
        alerts: state.alerts.filter((alert) => !alerts.includes(alert)),
      }))
    },
    
    updateAlert: (alerts) => {
      set((state) => ({
        ...state,
        alerts: state.alerts.map((alert) => {
          const updatedAlert = alerts.find((a) => a === alert)
          return updatedAlert || alert
        }),
      }))
    },
    
    clearAlerts: () => set({ alerts: [] }),
  }))
}
