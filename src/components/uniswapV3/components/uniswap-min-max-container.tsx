import { useHttpClient } from '../../../providers/http-client'
import { useQuery } from '@tanstack/react-query'
import { APIToken } from '../../../services/get-tokens'

interface HookProps {
  iidFirstToken: string
  iidSecondToken: string
}

export const useMinMaxPrice = ({ iidFirstToken, iidSecondToken }: HookProps) => {
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

interface UniswapMinMaxContainerProps {
  minMaxRange: { minRange: number; maxRange: number }
  isFullRange: boolean
  activeToken: APIToken
  otherToken: APIToken
}

const UniswapMinMaxContainer = ({
  minMaxRange,
  isFullRange,
  activeToken,
  otherToken,
}: UniswapMinMaxContainerProps) => {
  const { minPrice, maxPrice } = useMinMaxPrice({
    iidFirstToken: activeToken.iid,
    iidSecondToken: otherToken.iid,
  })

  return (
    <div className="bg-bg-section p-4 rounded-bl-[20px] rounded-br-[20px]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-14px-normal text-grey-medium">Min Price</span>
          <span className="text-base font-medium text-foreground">
            {minMaxRange.minRange > 0 ? minMaxRange.minRange.toFixed(5) : minPrice?.toFixed(5) || '0.00000'}{' '}
            {otherToken.symbol} = 1 {activeToken.symbol}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-14px-normal text-grey-medium">Max Price</span>
          <span className="text-base font-medium text-foreground">
            {minMaxRange.maxRange > 0 ? minMaxRange.maxRange.toFixed(5) : maxPrice?.toFixed(5) || '0.00000'}{' '}
            {otherToken.symbol} = 1 {activeToken.symbol}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UniswapMinMaxContainer
