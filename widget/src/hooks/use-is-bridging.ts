import { useTradeStore } from '../providers'

export function useIsBridging() {
  const targetWeights = useTradeStore((state) => state.targetWeights)
  const inputPositions = useTradeStore((state) => state.inputPositions)

  const inputTokensIID = Object.keys(inputPositions)
  const outputTokensIID = Object.keys(targetWeights)

  const inputNetworks = Array.from(
    new Set(inputTokensIID.map((tokenIID) => tokenIID.split(':')[0])),
  )
  const outputNetworks = Array.from(
    new Set(outputTokensIID.map((tokenIID) => tokenIID.split(':')[0])),
  )

  const isBridging = !outputNetworks.every((network) => inputNetworks.includes(network))
  return isBridging
}
