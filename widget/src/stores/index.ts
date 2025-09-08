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
        const toggle = (tokens: typeof state.inputTokens) =>
          tokens.map((token) =>
            token.iid === iid
              ? { ...token, showSlider: !token.showSlider }
              : { ...token, showSlider: false },
          )

        if (type === 'output') {
          return {
            outputTokens: toggle(state.outputTokens),
          }
        } else {
          return {
            inputTokens: toggle(state.inputTokens),
          }
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
    setTokenValue: (token, value) => {
      set((state) => {
        const inputPositions = {
          ...state.inputPositions,
        }
        inputPositions[token.iid] = value

        const usdInputTotal = getTotalUSD(inputPositions, state.inputTokens)

        return {
          inputPositions,
          usdInputTotal,
        }
      })
    },
    updateTokensUSDPrice: (tokens) => {
      set((state) => {
        const newInputTokens = state.inputTokens.map((token) => {
          const findedToken = tokens.find((t) => t.iid === token.iid)
          if (findedToken) {
            return { ...token, priceUSD: findedToken.priceUSD }
          }
          return token
        })
        const newOutputTokens = state.outputTokens.map((token) => {
          const findedToken = tokens.find((t) => t.iid === token.iid)
          if (findedToken) {
            return { ...token, priceUSD: findedToken.priceUSD }
          }
          return token
        })
        return { inputTokens: newInputTokens, outputTokens: newOutputTokens }
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
      set((state) => ({
        inputTokens: state.inputTokens.map((token) => ({
          ...token,
          showSlider: type === 'input' ? false : token.showSlider,
        })),
        outputTokens: state.outputTokens.map((token) => ({
          ...token,
          showSlider: type === 'output' ? false : token.showSlider,
        })),
      })),
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

  return tokenList.map((token, index) => ({
    ...token,
    percentage: Math.max(0, index < remainder ? evenPersentage + 1 : evenPersentage),
    locked: false,
    showSlider: false,
  }))
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
      return { ...token, percentage: newPercentage }
    }
    if (token.locked) {
      return token
    }

    const index = unlockedTokens.findIndex((t) => t.iid === token.iid)
    const calculatedPercentage = index < remainder ? evenDistribution + 1 : evenDistribution
    return {
      ...token,
      percentage: Math.max(1, calculatedPercentage),
    }
  })
}
