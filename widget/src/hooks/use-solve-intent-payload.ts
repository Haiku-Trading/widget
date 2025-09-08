import { useAccount } from 'wagmi'
import { useTradeStore } from '../providers'
import { useSessionStore } from '../providers/session'
import { SolveIntentPayload } from '../services/solve-intent'

export function useClassicSolveIntentPayload(): SolveIntentPayload {
  const account = useAccount()
  const slippage = useTradeStore((state) => state.slippage)
  const bridgeMode = useTradeStore((state) => state.bridgeMode)
  const inputPositions = useTradeStore((state) => state.inputPositions)
  // const targetWeights = useTradeStore((state) => state.targetWeights)
  const sessionID = useSessionStore((state) => state.sessionId)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const targetWeights = Object.fromEntries(
    outputTokens.map((token) => [token.iid, Math.round(token.percentage ?? 1) / 100]),
  )

  return {
    intent: {
      receiver: account.address!,
      slippage: Number(slippage),
      inputPositions,
      targetWeights,
      bridgeMode,
    },
    source: 'widget',
    sessionID,
  }
}
