/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChartData } from '@/modules/agent/queries/chart-data'
import { APIToken, cn } from '@/modules/app'
import { ToggleGroup } from 'radix-ui'
import { useMemo, useState } from 'react'
import UniswapChart from './uniswap-chart'
import UniswapMinMaxContainer from './uniswap-min-max-container'

interface UniswapChartContainerProps {
  firstToken: APIToken
  secondToken: APIToken
  pool: APIToken
  isFullRange: boolean
  concentratedPoolData?: {
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
  }
  onSetTickRange?: (range: { lower: string; upper: string }) => void
}

const filterChart = [
  { label: '1D', key: '1D', timeframe: 'minute' as const, aggregate: 15 as const, limit: 24 * 4 },
  { label: '1W', key: '1W', timeframe: 'hour' as const, aggregate: 1 as const, limit: 168 },
  { label: '1M', key: '1M', timeframe: 'hour' as const, aggregate: 4 as const, limit: 180 },
  { label: '1Y', key: '1Y', timeframe: 'day' as const, aggregate: 1 as const, limit: 365 },
  { label: 'All', key: 'ALL', timeframe: 'day' as const, aggregate: 1 as const, limit: 1000 },
]

const UniswapChartContainer = ({
  firstToken,
  secondToken,
  pool,
  isFullRange,
  onSetTickRange,
  concentratedPoolData,
}: UniswapChartContainerProps) => {
  //STATE
  const [currentToken, setCurrentToken] = useState<string>(firstToken?.symbol || '')
  const [currentFilter, setCurrentFilter] = useState<string>(filterChart[2].key)
  const [minMaxRange, setMinMaxRange] = useState({ minRange: 0, maxRange: 0 })
  const tokens = useMemo(() => [firstToken, secondToken], [firstToken, secondToken])

  const currentFilterConfig = useMemo(() => {
    return filterChart.find((f) => f.key === currentFilter) ?? filterChart[2]
  }, [currentFilter])

  //UTILS
  const { data: chartData } = useChartData({
    poolIid: pool.iid,
    timeframe: currentFilterConfig.timeframe,
    aggregate: currentFilterConfig.aggregate,
    limit: currentFilterConfig.limit,
    key: currentFilterConfig.key,
  })

  const { activeToken, otherToken, marketRate } = useMemo(() => {
    const active = tokens.find((t) => t.symbol === currentToken) ?? firstToken
    const other = active.symbol === firstToken.symbol ? secondToken : firstToken

    const activePrice = parseFloat(active?.priceUSD || '0')
    const otherPrice = parseFloat(other?.priceUSD || '0')

    return {
      activeToken: active,
      otherToken: other,
      marketRate: otherPrice > 0 ? (activePrice / otherPrice).toFixed(5) : '0',
    }
  }, [currentToken, firstToken, secondToken, tokens])

  // Transform chart data based on selected token
  const transformedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return []
    
    // If current token is not the first token, invert the price values
    const shouldInvert = currentToken !== firstToken?.symbol
    
    if (shouldInvert) {
      return chartData.map((item) => ({
        time: item.time,
        value: item.value,
      }))
    }
    
    return chartData
  }, [chartData, currentToken, firstToken?.symbol])

  // Check if chart is inverted (showing second token)
  const isInverted = currentToken !== firstToken?.symbol

  // const { minPrice, maxPrice } = useMemo(() => {
  //   if (!chartData || chartData.length === 0) {
  //     return { minPrice: 0, maxPrice: 0 }
  //   }

  //   const values = chartData.map((item) => item.value)

  //   const otherTokenPriceUSD = parseFloat(otherToken?.priceUSD || '1')

  //   return {
  //     minPrice: Math.min(...values) / otherTokenPriceUSD,
  //     maxPrice: Math.max(...values) / otherTokenPriceUSD,
  //   }
  // }, [chartData])


  return (
    <div className="flex flex-col gap-1">
      <div className="bg-bg-section p-4 rounded-tl-[20px] rounded-tr-[20px]">
        <div className="flex justify-between items-center">
          <span className="text-14px-normal text-grey-medium dark:text-[#B2B2B2]">
            Market price:{' '}
            <span className="dark:text-[white] text-[black]">
              {marketRate} {otherToken.symbol} = 1 {activeToken.symbol}
            </span>
          </span>
          <ToggleGroup.Root
            type="single"
            value={currentToken}
            onValueChange={(value) => {
              if (value) setCurrentToken(value)
            }}
            className={cn(
              'mb-2 isolate relative inline-flex h-12 max-newmd:w-full max-md:h-10 shrink-0 cursor-pointer items-center rounded-full border border-border disabled:cursor-not-allowed disabled:opacity-50 bg-secondary px-1',
            )}
          >
            {tokens.map((token) => (
              <ToggleGroup.Item
                key={token.symbol}
                value={token.symbol}
                className={cn(
                  'group relative flex-1 text-sm font-medium text-muted-foreground px-4 py-2 text-center rounded-full',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                )}
              >
                {currentToken === token.symbol && (
                  <div
                    className="bg-primary rounded-full absolute inset-0"
                  />
                )}
                <p className={cn('relative z-10', 'text-white')}>{token.symbol}</p>
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>

        <UniswapChart
          setMinMaxRange={setMinMaxRange}
          isFullRange={isFullRange}
          data={transformedChartData}
          timeframe={currentFilterConfig.timeframe}
          inverted={isInverted}
          concentratedPoolData={concentratedPoolData}
          onSetTickRange={onSetTickRange}
        />
        <ToggleGroup.Root
          type="single"
          value={currentFilter}
          onValueChange={(value) => {
            if (value) setCurrentFilter(value)
          }}
          className={cn(
            'mt-2 isolate relative inline-flex h-12 max-newmd:w-full max-md:h-10 shrink-0 cursor-pointer items-center rounded-full border border-border disabled:cursor-not-allowed disabled:opacity-50 bg-secondary px-1',
          )}
        >
          {filterChart.map((day) => (
            <ToggleGroup.Item
              key={day.key}
              value={day.key}
              className={cn(
                'group relative flex-1 text-sm font-medium text-muted-foreground px-5 py-2 text-center rounded-full',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary',
                'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
              )}
            >
              {currentFilter === day.key && (
                <div
                  className="bg-primary rounded-full absolute inset-0"
                />
              )}
              <p className={cn('relative z-10', 'text-white')}>{day.label}</p>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>
      <UniswapMinMaxContainer
        minMaxRange={minMaxRange}
        isFullRange={isFullRange}
        activeToken={activeToken}
        otherToken={otherToken}
      />
    </div>
  )
}

export default UniswapChartContainer
