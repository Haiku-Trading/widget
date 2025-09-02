import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useHttpClient } from '../providers/http'

interface TokenBalance {
  token: {
    iid: string
    symbol: string
    name: string
    address: string
    chainId: number
    network: number
    decimals: number
    logoURI?: string
  }
  balance: string
  balanceUSD: string
}

interface Response {
  wallet_positions: Record<string, number>
  token_balances: TokenBalance[]
}

export function useClassicTokensBalancesQuery<TData = Response>(
  select?: (data: Response) => TData,
) {
  const { address } = useAccount()
  const httpClient = useHttpClient()

  return useQuery({
    queryKey: [address, 'balances'],
    queryFn: async () => {
      const data = await httpClient.get<Response>(
        `/tokenBalances?address=${address}`,
      )
      return data
    },
    select,
    enabled: !!address,
    refetchInterval: 120000, // 2 minutes
  })
}
