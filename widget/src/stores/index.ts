import BigNumber from 'bignumber.js'
import { createStore } from 'zustand/vanilla'
import { TokenType } from '../enums/token-type'
import { TradeAlertsType } from '../models/api/trade-alerts'
import { AnyAPIToken } from '../services/get-tokens'
import { BridgeMode } from '../enums/bridge-mode'

export type TradeState = {
  context: 'classic'
  inputTokens: AnyAPIToken[]
  outputTokens: AnyAPIToken[]
  inputChainIds: number[]
  outputChainIds: number[]
  usdInputTotal: string
  slippage: string
  alerts: TradeAlertsType[]
  inputPositions: Record<string, string>
  clammInputPositions: Record<string, string>
  targetWeights: Record<string, number>
  isShowBalance: boolean
  isTokenView: boolean
  bridgeMode: BridgeMode
}

export type TradeActions = {
  setSlippage: (slippage: string) => void
  addInputToken: (tokens: AnyAPIToken[]) => void
  removeInputToken: (token: AnyAPIToken) => void
  addOutputToken: (tokens: AnyAPIToken[]) => void
  removeOutputToken: (token: AnyAPIToken) => void
  setPreselectedInputTokens: (tokens: Array<{ token: AnyAPIToken; amount: number }>) => void
  setPreselectedOutputTokens: (tokens: Array<{ token: AnyAPIToken; amount: number }>) => void
  setTokenValue: (token: AnyAPIToken, value: string, balance?: { balance: number; balanceUSD: number }) => void
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
  setBridgeMode: (bridgeMode: BridgeMode) => void
}

export type TradeStore = TradeState & TradeActions

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
  clammInputPositions: {},
  targetWeights: {},
  isShowBalance: true,
  isTokenView: true,
  bridgeMode: BridgeMode.Fast,
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
        // Recalculate usdInputTotal if inputPositions or inputTokens changed
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
    //
    addInputToken: (tokens) => {
      set((state) => {
        const modifyTokens = tokens.map((item) => {
          return {
            ...item,
            showSlider: false,
          }
        })
        const newInputTokens = state.inputTokens.concat(modifyTokens)
        const inputPositionsEntries = tokens.map((token) => [token.iid, '0'] as const)
        const newInputPositions = {
          ...state.inputPositions,
          ...Object.fromEntries(inputPositionsEntries),
        }
        return {
          inputTokens: newInputTokens,
          inputPositions: newInputPositions,
          inputChainIds: Array.from(
            new Set(state.inputChainIds.concat(tokens.map((token) => token.network))),
          ),
        }
      })
    },
    removeInputToken: (token) => {
      set((state) => {
        const newTokens = state.inputTokens.filter((inputToken) => inputToken.iid !== token.iid)
        const inputPositionsEntries = Object.entries(state.inputPositions).filter(
          ([tokenIID]) => tokenIID !== token.iid,
        )
        const newInputPositions = Object.fromEntries(inputPositionsEntries)
        const usdInputTotal = getTotalUSD(newInputPositions, newTokens)

        return {
          inputTokens: newTokens,
          inputPositions: newInputPositions,
          usdInputTotal,
          inputChainIds: newTokens.length === 0 ? [] : state.inputChainIds,
        }
      })
    },
    addOutputToken: (tokens) => {
      const currentOutputTokens = get().outputTokens
      const modifyTokens = tokens.map((item) => {
        return {
          ...item,
          percentage: 0,
          locked: false,
          showSlider: false,
        }
      })
      const updatedOutputTokens = currentOutputTokens.concat(modifyTokens)
      const redistributedTokens = redistributeEvenly(updatedOutputTokens)

      set((state) => ({
        outputTokens: redistributedTokens,
        outputChainIds: state.outputChainIds.concat(tokens.map((token) => token.network)),
        targetWeights: Object.fromEntries(
          updatedOutputTokens.map((token) => [token.iid, 1 / updatedOutputTokens.length]),
        ),
      }))
    },
    removeOutputToken: (token) => {
      set((state) => {
        const updatedOutputTokens = state.outputTokens.filter(
          (outputToken) => outputToken.iid !== token.iid,
        )
        const redistributedTokens = redistributeEvenly(updatedOutputTokens)

        return {
          outputTokens: redistributedTokens,
          outputChainIds: state.outputChainIds.filter((chain) => token.network !== chain),
          targetWeights: Object.fromEntries(
            updatedOutputTokens.map((token) => [token.iid, 1 / updatedOutputTokens.length]),
          ),
        }
      })
    },
    setPreselectedInputTokens: (tokensWithAmounts) => {
      set((state) => {
        const modifyTokens = tokensWithAmounts.map(({ token }) => {
          return {
            ...token,
            showSlider: false,
          }
        })
        const inputPositionsEntries = tokensWithAmounts.map(({ token, amount }) => [token.iid, amount.toString()] as const)
        const newInputPositions = {
          ...state.inputPositions,
          ...Object.fromEntries(inputPositionsEntries),
        }
        return {
          inputTokens: modifyTokens,
          inputPositions: newInputPositions,
          inputChainIds: Array.from(
            new Set(tokensWithAmounts.map(({ token }) => token.network)),
          ),
        }
      })
    },
    setPreselectedOutputTokens: (tokensWithWeights) => {
      set((state) => {
        const modifyTokens = tokensWithWeights.map(({ token }) => {
          return {
            ...token,
            percentage: 0,
            locked: false,
            showSlider: false,
          }
        })
        
        // Calculate total weight for normalization
        const totalWeight = tokensWithWeights.reduce((sum, { amount }) => sum + amount, 0)
        
        // Set percentages based on weights (convert to percentages)
        const tokensWithPercentages = modifyTokens.map((token, index) => {
          const weight = tokensWithWeights[index].amount
          const percentage = totalWeight > 0 ? (weight / totalWeight) * 100 : 0
          return {
            ...token,
            percentage,
          }
        })
        
        return {
          outputTokens: tokensWithPercentages,
          outputChainIds: tokensWithWeights.map(({ token }) => token.network),
          targetWeights: Object.fromEntries(
            tokensWithWeights.map(({ token, amount }) => [token.iid, totalWeight > 0 ? amount / totalWeight : 0]),
          ),
        }
      })
    },
    toggleLock: (tokenId: string) => {
      set((state) => {
        const updatedOutputTokens = state.outputTokens.map((token) =>
          token.iid === tokenId ? { ...token, locked: !token.locked } : token,
        )

        // Update targetWeights based on the current percentages after lock toggle
        const newTargetWeights = Object.fromEntries(
          updatedOutputTokens.map((token) => [token.iid, (token.percentage || 0) / 100]),
        )

        return {
          outputTokens: updatedOutputTokens,
          targetWeights: newTargetWeights,
        }
      })
    },
    toggleSlider(iid: string, type: 'output' | 'input') {
      set((state) => {
        const toggle = (tokens: typeof state.inputTokens) => {
          let hasChanges = false
          const newTokens = tokens.map((token) => {
            if (token.iid === iid) {
              // Only create new object if showSlider actually changes
              if (token.showSlider !== !token.showSlider) {
                hasChanges = true
                return { ...token, showSlider: !token.showSlider }
              }
              return token
            } else {
              // Only create new object if showSlider is not already false
              if (token.showSlider !== false) {
                hasChanges = true
                return { ...token, showSlider: false }
              }
              return token
            }
          })
          
          // Only return new array if there were actual changes
          return hasChanges ? newTokens : tokens
        }

        if (type === 'output') {
          const newOutputTokens = toggle(state.outputTokens)
          return newOutputTokens !== state.outputTokens ? { outputTokens: newOutputTokens } : {}
        } else {
          const newInputTokens = toggle(state.inputTokens)
          return newInputTokens !== state.inputTokens ? { inputTokens: newInputTokens } : {}
        }
      })
    },
    handlePercentageChange: (iid: string, newPercentage: number) => {
      set((state) => {
        const redistributedTokens = redistributePercentages(state.outputTokens, iid, newPercentage)

        // Update targetWeights based on the new percentages
        const newTargetWeights = Object.fromEntries(
          redistributedTokens.map((token) => [token.iid, (token.percentage || 0) / 100]),
        )

        return {
          outputTokens: redistributedTokens,
          targetWeights: newTargetWeights,
        }
      })
    },
    handlePercentageInputChange(iid, newPercentage, balance) {},
    swapToken: () => {
      set((state) => {
        const newInputTokens = state.outputTokens
        const newOutputTokens = state.inputTokens.map((token) => ({
          ...token,
          percentage: 100 / state.inputTokens.length,
        }))

        const inputPositions = Object.fromEntries(
          newInputTokens.map((token) => [token.iid, '0'] as const),
        )

        const modifyTokens = newOutputTokens.map((item) => {
          return {
            ...item,
            percentage: 0,
            locked: false,
            showSlider: false,
          }
        })

        const redistributedTokens = redistributeEvenly(modifyTokens)

        const targetWeights = Object.fromEntries(
          newOutputTokens.map((token) => [token.iid, 1 / newOutputTokens.length]),
        )

        return {
          inputTokens: newInputTokens,
          outputTokens: redistributedTokens,
          inputPositions,
          targetWeights,
          inputChainIds: newInputTokens.map((token) => token.network),
          outputChainIds: newOutputTokens.map((token) => token.network),
        }
      })
    },
    setTokenValue: (token, value, balance) => {
      set((state) => {
        const inputPositions = {
          ...state.inputPositions,
        }

        const clammInputPositions = {
          ...state.clammInputPositions,
        }

        // Handle CLAMM tokens separately - convert USD value to liquidity amount
        if (token.type === TokenType.ConcentratedLiquidity && balance) {
          clammInputPositions[token.iid] = Math.ceil(
            Number((Number(value) / balance.balanceUSD) * balance.balance),
          ).toString()
        }

        // Store value in inputPositions for all tokens (including CLAMM)
        inputPositions[token.iid] = value

        const usdInputTotal = getTotalUSD(inputPositions, state.inputTokens)

        return {
          clammInputPositions,
          inputPositions,
          usdInputTotal,
        }
      })
    },
    updateTokensUSDPrice: (tokens) => {
      set((state) => {
        // Early return if no tokens to update
        if (!tokens || tokens.length === 0) {
          return state
        }

        let hasChanges = false
        const newInputTokens = state.inputTokens.map((token) => {
          const foundToken = tokens.find((t) => t.iid === token.iid)
          if (foundToken && foundToken.priceUSD !== token.priceUSD) {
            hasChanges = true
            return { ...token, priceUSD: foundToken.priceUSD }
          }
          return token
        })
        
        const newOutputTokens = state.outputTokens.map((token) => {
          const foundToken = tokens.find((t) => t.iid === token.iid)
          if (foundToken && foundToken.priceUSD !== token.priceUSD) {
            hasChanges = true
            return { ...token, priceUSD: foundToken.priceUSD }
          }
          return token
        })
        
        // Only update if there are actual changes to prevent unnecessary re-renders
        if (hasChanges) {
          return { inputTokens: newInputTokens, outputTokens: newOutputTokens }
        }
        
        return state
      })
    },
    handleShowBalance: () => {
      set((state) => ({
        isShowBalance: !state.isShowBalance,
      }))
    },
    setIsTokenView(togle) {
      set(() => ({
        isTokenView: togle,
      }))
    },
    clearSlider: (type: 'output' | 'input') =>
      set((state) => {
        let hasInputChanges = false
        let hasOutputChanges = false
        
        const newInputTokens = state.inputTokens.map((token) => {
          if (type === 'input' && token.showSlider !== false) {
            hasInputChanges = true
            return { ...token, showSlider: false }
          }
          return token
        })
        
        const newOutputTokens = state.outputTokens.map((token) => {
          if (type === 'output' && token.showSlider !== false) {
            hasOutputChanges = true
            return { ...token, showSlider: false }
          }
          return token
        })
        
        const changes: Partial<TradeState> = {}
        if (hasInputChanges) changes.inputTokens = newInputTokens
        if (hasOutputChanges) changes.outputTokens = newOutputTokens
        
        return changes
      }),
    addMoreAlerts: (alerts) =>
      set((state) => {
        const existingAlerts = state.alerts

        const newAlerts = alerts.filter((alert) => {
          return !existingAlerts.some(
            (existingAlert) =>
              existingAlert.type === alert.type &&
              existingAlert.message.toLowerCase() === alert.message.toLowerCase(),
          )
        })

        const updatedAlerts = [...existingAlerts, ...newAlerts]

        return {
          alerts: updatedAlerts,
        }
      }),
    updateAlert: (alert) =>
      set((state) => {
        return {
          alerts: alert,
        }
      }),
    removeAlerts: (alerts) =>
      set((state) => {
        const removedAlerts = state.alerts.filter((alert) => {
          return !alerts.some(
            (existingAlert) =>
              existingAlert.type === alert.type &&
              existingAlert.message.toLowerCase() === alert.message.toLowerCase(),
          )
        })

        return {
          alerts: removedAlerts,
        }
      }),
    clearAlerts: () => set(() => ({ alerts: [] })),
    setBridgeMode: (bridgeMode) => set({ bridgeMode }),
  }))
}

/* -------------------------------------------------------------------------------------------------
 * getTotalUSD
 * -----------------------------------------------------------------------------------------------*/

function getTotalUSD(inputPositions: Record<string, string>, tokens: AnyAPIToken[]) {
  const totalUSD = Object.entries(inputPositions).reduce((total, [tokenIID, value]) => {
    const token = tokens.find((token) => token.iid === tokenIID)
    if (!token) return '0'
    const usdAmount = BigNumber(value).multipliedBy(token.priceUSD)
    return token.type === TokenType.VarDebt
      ? BigNumber(total).minus(usdAmount).toFixed()
      : usdAmount.plus(total).toFixed()
  }, '0')
  return totalUSD
}

const redistributeEvenly = (tokenList: AnyAPIToken[]) => {
  const evenPersentage = Math.floor(100 / tokenList.length)
  const remainder = 100 - evenPersentage * tokenList.length

  return tokenList.map((token, index) => {
    const newPercentage = Math.max(0, index < remainder ? evenPersentage + 1 : evenPersentage)
    const newLocked = false
    const newShowSlider = false
    
    // Only create new object if values actually change
    if (token.percentage !== newPercentage || token.locked !== newLocked || token.showSlider !== newShowSlider) {
      return {
        ...token,
        percentage: newPercentage,
        locked: newLocked,
        showSlider: newShowSlider,
      }
    }
    
    return token
  })
}

const redistributePercentages = (
  updatedTokens: AnyAPIToken[],
  changedTokenId: string,
  newPercentage: number,
) => {
  const lockedTokens = updatedTokens.filter((token) => token.locked && token.iid !== changedTokenId)
  const unlockedTokens = updatedTokens.filter(
    (token) => !token.locked && token.iid !== changedTokenId,
  )

  if (unlockedTokens.length === 0) return updatedTokens

  const lockedSum = lockedTokens.reduce((sum, token) => sum + (token.percentage ?? 0), 0)
  const minRequiredForOthers = unlockedTokens.length
  const maxAllowedForCurrent = 100 - lockedSum - minRequiredForOthers

  newPercentage = Math.max(1, Math.min(newPercentage, maxAllowedForCurrent))

  const availablePercentage = 100 - lockedSum - newPercentage

  if (availablePercentage < unlockedTokens.length) {
    newPercentage = 100 - lockedSum - unlockedTokens.length
    newPercentage = Math.max(1, newPercentage)
  }

  const finalAvailable = 100 - lockedSum - newPercentage
  const evenDistribution = Math.max(1, Math.floor(finalAvailable / unlockedTokens.length))
  const remainder = finalAvailable - evenDistribution * unlockedTokens.length

  return updatedTokens.map((token) => {
    if (token.iid === changedTokenId) {
      // Only create new object if percentage actually changes
      if (token.percentage !== newPercentage) {
        return { ...token, percentage: newPercentage }
      }
      return token
    }
    if (token.locked) {
      return token
    }

    const index = unlockedTokens.findIndex((t) => t.iid === token.iid)
    const calculatedPercentage = index < remainder ? evenDistribution + 1 : evenDistribution
    const finalPercentage = Math.max(1, calculatedPercentage)
    
    // Only create new object if percentage actually changes
    if (token.percentage !== finalPercentage) {
      return {
        ...token,
        percentage: finalPercentage,
      }
    }
    
    return token
  })
}
