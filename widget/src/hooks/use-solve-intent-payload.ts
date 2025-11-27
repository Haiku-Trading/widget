import { useAccount } from 'wagmi'
import { useTradeStore } from '../providers'
import { useSessionStore } from '../providers/session'
import { SolveIntentPayload } from '../services/solve-intent'

export function useClassicSolveIntentPayload(): SolveIntentPayload {
  const account = useAccount()
  const slippage = useTradeStore((state) => state.slippage)
  const bridgeMode = useTradeStore((state) => state.bridgeMode)
  const inputPositions = useTradeStore((state) => state.inputPositions)
  const clammPositions = useTradeStore((state) => state.clammInputPositions)
  // const targetWeights = useTradeStore((state) => state.targetWeights)
  const sessionID = useSessionStore((state) => state.sessionId)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const targetWeights = Object.fromEntries(
    outputTokens.map((token) => [token.iid, Math.round(token.percentage ?? 1) / 100]),
  )

  // rewrite input positions to include clamm positions
  // Only use clammPositions for keys that exist in clammPositions, otherwise use inputPositions
  const modifiedInputPositions: Record<string, string> = Object.keys(inputPositions).reduce(
    (acc, key) => {
      if (clammPositions[key]) {
        acc[key] = clammPositions[key]
      } else {
        acc[key] = inputPositions[key]
      }
      return acc
    },
    {} as Record<string, string>,
  )

  return {
    intent: {
      receiver: account.address || '0x0000000000000000000000000000000000000000',
      slippage: Number(slippage),
      inputPositions: modifiedInputPositions,
      targetWeights,
      bridgeMode,
    },
    source: 'widget',
    sessionID,
  }
}
