import { useHttpClient } from '@/modules/app/providers/http'
import { useQuery } from '@tanstack/react-query'

interface Props {
  poolIid: string
  timeframe: 'day' | 'hour' | 'minute'
  aggregate: 1 | 4 | 5 | 12 | 15
  limit: number
  key: string
}

export function useChartData({ poolIid, timeframe, aggregate, limit, key }: Props) {
  const httpClient = useHttpClient()
  const query = useQuery({
    queryKey: ['chart-data', poolIid, timeframe, aggregate, limit],
    queryFn: async () => {
      if (timeframe === 'day') {
        if (aggregate !== 1) {
          return []
        }
      }

      if (timeframe === 'hour') {
        if (![1, 4, 12].includes(aggregate)) {
          return []
        }
      }

      if (timeframe === 'minute') {
        if (![1, 5, 15].includes(aggregate)) {
          return []
        }
      }
      const response = await httpClient.get<Array<[number, number, number, number, number]>>(
        `/ui/poolPriceData?iid=${poolIid}&timeframe=${timeframe}&aggregate=${aggregate}&limit=${limit}`,
      )
      // const responseSecondToken = await httpClient.get<Array<[number, number]>>(
      //   `/ui/tokenPriceData?iid=${iidSecondToken}&day=${day}`,
      // )

      // const minLength = Math.min(responseFirstToken.length, responseSecondToken.length)

      // const merged = responseFirstToken.slice(0, minLength).reduce(
      //   (acc, [timestamp, value], index) => {
      //     const dateKey = new Date(timestamp).toISOString().slice(0, 10)
      //     const ratio = value / responseSecondToken[index][1]
      //     acc[dateKey] = { time: dateKey, value: ratio }
      //     return acc
      //   },
      //   {} as Record<string, { time: string; value: number }>,
      // )

      // console.log('Merged chart data:', Object.values(merged))
      // return Object.values(merged)
      const uniqueTimeDatas = response.filter(
        (data, index, self) => index === self.findIndex((d) => d[0] === data[0]),
      )
      const datas = uniqueTimeDatas
        .sort((a, b) => a[0] - b[0])
        .map((data) => ({
          time: data[0], // Convert to Unix timestamp in seconds for minute-level precision
          value: Number(data[1]), // close price
        }))
      return datas
    },
    enabled: Boolean(poolIid),
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
