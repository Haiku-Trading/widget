/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHttpClient } from '../providers/http-client'
import { useQuery } from '@tanstack/react-query'

interface Props {
  iid: string
  enable: boolean
}

export function useConcentratedPoolData({ iid, enable }: Props) {
  const httpClient = useHttpClient()

  const query = useQuery({
    queryKey: ['concentrated-pool-data', iid],
    queryFn: async () => {
      return await httpClient.get<{
        currentPrice: string
        currentTick: string
        liquidity: string
        liquidityRaw: string
        sqrtPriceX96: string
        tickSpacing: number
        token0: any
        token1: any
        token0PriceUSD: string
        token1PriceUSD: string
      }>(`/ui/concentratedLiquidityPoolState?iid=${iid}`)
    },
    enabled: Boolean(iid) && enable,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 48 * 60 * 60 * 1000, // Keep data in cache for 48 hours
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  return {
    ...query,
    // Manual refresh function
    refresh: () => query.refetch(),
  }
}
