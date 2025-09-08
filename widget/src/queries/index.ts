'use client'

import { useEIP7702 } from '../hooks/use-eip-7702'
import { isValidWalletAddress } from '../utils/validate-wallet-address'
import { useQuery } from '@tanstack/react-query'
import { getTokens } from '../services/get-tokens'
import { useEffect } from 'react'
import { useTradeStore } from '../providers'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { SolveIntentPayload } from '../services/solve-intent'
import { TokenType } from '../enums/token-type'
import { useHttpClient } from '../providers/http-client'

// prettier-ignore
export const tradeKeys = {
  all: [{ entity: 'trade' }] as const,
  tokens: () => [{ ...tradeKeys.all[0], scope: 'tokens' }] as const,
  solveIntent: (payload: SolveIntentPayload) => [{ ...tradeKeys.all[0], scope: 'solveIntent', payload: payload.intent }] as const,
}

export function useGetTokensQuery() {
  const updateTokensUSDPrice = useTradeStore((state) => state.updateTokensUSDPrice)
  const httpClient = useHttpClient()
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
        },
      }
    },
    refetchInterval: 20000,
  })

  useEffect(() => {
    if (!query.isRefetching && query.data?.tokenList) {
      const allTokens = [
        query.data.tokenList.tokens,
        query.data.tokenList?.collateralTokens,
        query.data.tokenList?.varDebtTokens,
      ].flat()

      updateTokensUSDPrice(allTokens)
    }
  }, [query.data, query.isRefetching, updateTokensUSDPrice])

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
  }
}

export function useClassicTokensBalancesQuery<TData = Response>(
  select?: (data: Response) => TData,
) {
  const account = useAccount()
  const httpClient = useHttpClient()

  const { eip7702 } = useEIP7702()

  return useQuery({
    queryKey: [account.address, 'balances'],
    queryFn: async () => {
      const data = await httpClient.get<Response>(
        `/tokenBalances?address=${account.address}&eip7702=${eip7702}`,
      )
      return data
    },
    select,
    enabled: isValidWalletAddress(account.address),
    refetchInterval: 120000,
  })
}

export function useTokenBalanceQuery(iid: string) {
  return useClassicTokensBalancesQuery((data) => {
    return data.wallet_positions[iid].toString() || '0'
  })
}

