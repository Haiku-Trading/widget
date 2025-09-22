import { useEffect, useState } from 'react'
import { useConfig as useWidgetConfig } from '../providers/config-provider'
import { PreselectedTokensProvider } from '../providers/preselected-tokens-provider'
import { useGetTokensQuery } from '../queries'
import { useTradeStore } from '../providers'
import { resolveTokensFromMap, type TokenListData } from '../utils'
import { SwapContainer } from './swap'

interface PreselectedTokensHandlerProps {
  children: React.ReactNode
}

export function PreselectedTokensHandler({ children }: PreselectedTokensHandlerProps) {
  const { config: widgetConfig } = useWidgetConfig()
  const getTokensQuery = useGetTokensQuery()
  const { setPreselectedInputTokens, setPreselectedOutputTokens } = useTradeStore()
  const [preselectedTokensApplied, setPreselectedTokensApplied] = useState(false)
  const [isResolvingPreselectedTokens, setIsResolvingPreselectedTokens] = useState(false)

  useEffect(() => {
    // Only proceed if we have token data and haven't applied preselected tokens yet
    if (!getTokensQuery.data?.tokenList || preselectedTokensApplied) {
      return
    }

    // Check if we have preselected tokens to resolve
    const hasPreselectedInputs = widgetConfig.preselectedInputs && Object.keys(widgetConfig.preselectedInputs).length > 0
    const hasPreselectedOutputs = widgetConfig.preselectedOutputs && Object.keys(widgetConfig.preselectedOutputs).length > 0

    if (!hasPreselectedInputs && !hasPreselectedOutputs) {
      setPreselectedTokensApplied(true)
      return
    }

    setIsResolvingPreselectedTokens(true)

    const tokenData: TokenListData = {
      tokens: getTokensQuery.data.tokenList.tokens || [],
      collateralTokens: getTokensQuery.data.tokenList.collateralTokens || [],
      varDebtTokens: getTokensQuery.data.tokenList.varDebtTokens || [],
      vaultTokens: getTokensQuery.data.tokenList.vaultTokens || [],
      weightedLiquidityTokens: getTokensQuery.data.tokenList.weightedLiquidityTokens || [],
    }

    // Handle preselected input tokens
    if (hasPreselectedInputs) {
      const resolvedInputTokens = resolveTokensFromMap(
        widgetConfig.preselectedInputs!,
        tokenData,
        widgetConfig.hiddenChains,
        widgetConfig.hiddenProtocols
      )

      // Respect multiInput setting - if false, only take the first token
      const tokensToSet = widgetConfig.multiInput 
        ? resolvedInputTokens 
        : resolvedInputTokens.slice(0, 1)

      if (tokensToSet.length > 0) {
        setPreselectedInputTokens(tokensToSet)
      }
    }

    // Handle preselected output tokens
    if (hasPreselectedOutputs) {
      const resolvedOutputTokens = resolveTokensFromMap(
        widgetConfig.preselectedOutputs!,
        tokenData,
        widgetConfig.hiddenChains,
        widgetConfig.hiddenProtocols
      )

      // Respect multiOutput setting - if false, only take the first token
      const tokensToSet = widgetConfig.multiOutput 
        ? resolvedOutputTokens 
        : resolvedOutputTokens.slice(0, 1)

      if (tokensToSet.length > 0) {
        setPreselectedOutputTokens(tokensToSet)
      }
    }

    setPreselectedTokensApplied(true)
    setIsResolvingPreselectedTokens(false)
  }, [
    getTokensQuery.data,
    widgetConfig.preselectedInputs,
    widgetConfig.preselectedOutputs,
    widgetConfig.multiInput,
    widgetConfig.multiOutput,
    widgetConfig.hiddenChains,
    widgetConfig.hiddenProtocols,
    setPreselectedInputTokens,
    setPreselectedOutputTokens,
    preselectedTokensApplied,
  ])

  return (
    <PreselectedTokensProvider isResolvingPreselectedTokens={isResolvingPreselectedTokens}>
      {children}
    </PreselectedTokensProvider>
  )
}

export function SwapContainerWithPreselectedTokens() {
  return (
    <PreselectedTokensHandler>
      <SwapContainer />
    </PreselectedTokensHandler>
  )
}
