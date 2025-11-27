
import { useEIP7702 } from '../hooks/use-eip-7702'
import { isValidWalletAddress } from '../utils/validate-wallet-address'
import { useQuery } from '@tanstack/react-query'
import { getTokens } from '../services/get-tokens'
import { useEffect, useRef } from 'react'
import { useTradeStore } from '../providers'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { SolveIntentPayload } from '../services/solve-intent'
import { TokenType } from '../enums/token-type'
import { useHttpClient } from '../providers/http-client'
import { useStableCallback } from '../utils/react-19-compat'

// prettier-ignore
export const tradeKeys = {
  all: [{ entity: 'trade' }] as const,
  tokens: () => [{ ...tradeKeys.all[0], scope: 'tokens' }] as const,
  solveIntent: (payload: SolveIntentPayload) => [{ ...tradeKeys.all[0], scope: 'solveIntent', payload: payload.intent }] as const,
}

export function useGetTokensQuery() {
  const updateTokensUSDPrice = useTradeStore((state) => state.updateTokensUSDPrice)
  const httpClient = useHttpClient()
  const lastUpdateRef = useRef<string>('')
  
  // Create stable callback to prevent React 19 re-render issues
  const stableUpdateTokensUSDPrice = useStableCallback(updateTokensUSDPrice)
  const query = useQuery({
    queryKey: tradeKeys.tokens(),
    queryFn: async () => {
      const response = await getTokens(httpClient)

      const addTokenType = <T>(tokens: T[], type: TokenType) =>
        tokens.map((token) => ({
          ...token,
          type,
        }))

      return {
        ...response,
        tokenList: {
          ...response.tokenList,
          tokens: addTokenType(response.tokenList.tokens, TokenType.Token),
          collateralTokens: addTokenType(response.tokenList.collateralTokens, TokenType.Collateral),
          varDebtTokens: addTokenType(response.tokenList.varDebtTokens, TokenType.VarDebt),
          weightedLiquidityTokens: addTokenType(
            response.tokenList.weightedLiquidityTokens,
            TokenType.WeightedLiquidity,
          ),
          vaultTokens: addTokenType(response.tokenList.vaultTokens, TokenType.Vault),
          concentratedLiquidityTokens: addTokenType(
            response.tokenList.concentratedLiquidityTokens || [],
            TokenType.ConcentratedLiquidity,
          ),
        },
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  })

  useEffect(() => {
    if (!query.isRefetching && query.data?.tokenList) {
      const allTokens = [
        query.data.tokenList.tokens,
        query.data.tokenList?.collateralTokens,
        query.data.tokenList?.varDebtTokens,
      ].flat()

      // Only update if we have tokens to update and data has changed
      if (allTokens.length > 0) {
        const dataHash = JSON.stringify(query.data.tokenList)
        if (dataHash !== lastUpdateRef.current) {
          lastUpdateRef.current = dataHash
          stableUpdateTokensUSDPrice(allTokens)
        }
      }
    }
  }, [query.data?.tokenList, query.isRefetching, stableUpdateTokensUSDPrice])

  return query
}

export function useEnabled() {
  const inputTokens = useTradeStore((state) => state.inputTokens)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const usdInputTotal = useTradeStore((state) => state.usdInputTotal)
  const account = useAccount()

  return (
    !!account.address &&
    inputTokens.length > 0 &&
    outputTokens.length > 0 &&
    BigNumber(usdInputTotal).isGreaterThan('0')
  )
}


type Response = {
  prices: Record<string, number>
  wallet_positions: Record<string, number>
  categorised_wallet_positions: {
    collateral_positions: Record<string, number>
    debt_positions: Record<string, number>
    token_positions: Record<string, number>
    weighted_liquidity_positions: Record<string, number>
    vault_positions: Record<string, number>
    concentrated_liquidity_positions?: Record<string, string>
  }
}

export function useClassicTokensBalancesQuery<TData = Response>(
  select?: (data: Response) => TData,
) {
  const account = useAccount()
  const httpClient = useHttpClient()

  const { eip7702 } = useEIP7702()

  return useQuery({
    queryKey: [account.address, 'balances', eip7702],
    queryFn: async () => {
      const data = await httpClient.get<Response>(
        `/tokenBalances?address=${account.address}&eip7702=${eip7702}`,
      )
      return data
    },
    select,
    enabled: isValidWalletAddress(account.address),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  })
}

export function useTokenBalanceQuery(iid: string) {
  return useClassicTokensBalancesQuery((data) => {
    return data.wallet_positions[iid].toString() || '0'
  })
}

