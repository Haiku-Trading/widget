import { useHttpClient } from '../../../providers/http-client'
import { useQuery } from '@tanstack/react-query'

interface Props {
  iidFirstToken: string
  iidSecondToken: string
}

const useMinMaxPrice = ({ iidFirstToken, iidSecondToken }: Props) => {
  const httpClient = useHttpClient()

  const query = useQuery({
    queryKey: ['min-max-data', iidFirstToken, iidSecondToken],
    queryFn: async () => {
      //   const response = await httpClient.get<Array<[number, number]>>(
      //     `/ui/tokenPriceData?iid=${iidFirstToken}&day=${day}`,
      //   )
      const response = ''

      return response
    },
    enabled: Boolean(iidFirstToken) && Boolean(iidSecondToken),
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 48 * 60 * 60 * 1000, // Keep data in cache for 48 hours
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  return {
    ...query,
    // Manual refresh function
    refresh: () => query.refetch(),
    maxPrice: 4600,
    minPrice: 1500,
  }
}

export default useMinMaxPrice
