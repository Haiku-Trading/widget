import { cn } from '../../utils'
import { ScrollArea } from '../scroll-area'
import BigNumber from 'bignumber.js'
import { useTradeStore } from '../../providers'
import { Card } from '../card'
import { ProgressBar } from '../progress-bar'
import { AnyAPIToken } from '../../services/get-tokens'

type ProgressBarProps = {
  inputTokens: AnyAPIToken[]
  outputTokens: AnyAPIToken[]
}

export function PositionBreakdown({ inputTokens, outputTokens }: ProgressBarProps) {
  const totalUSD = useTradeStore((state) => state.usdInputTotal)
  const inputPositions = useTradeStore((state) => state.inputPositions)
  const targetWeights = useTradeStore((state) => state.targetWeights)

  const inputPool = inputTokens.map((token) => {
    const tokenValue = inputPositions[token.iid]
    const usdBalance = BigNumber(tokenValue).multipliedBy(token.priceUSD)
    return {
      iid: token.iid,
      symbol: token.symbol,
      percentage: Math.round(usdBalance.dividedBy(totalUSD).multipliedBy(100).toNumber() || 0),
      color: token.primaryColor || '',
      icon: 'logoURI' in token ? token.logoURI : '',
      chainId: token.network,
    }
  })

  const outputPoolUnfiltered = Object.entries(targetWeights).map(([tokenIid, percentage]) => {
    const token = outputTokens.find((token) => token.iid === tokenIid)
    if (!token) return null
    return {
      iid: token.iid,
      symbol: token.symbol,
      percentage: Math.round(percentage * 100),
      color: token.primaryColor || '',
      icon: 'logoURI' in token ? token.logoURI : '',
      chainId: token.network,
    }
  })

  const outputPool = outputPoolUnfiltered
    .filter((token) => !!token)
    .map((token, _, filteredPool) => ({
      ...token,
      percentage: filteredPool.length === 1 ? 100 : token.percentage,
    }))

  return (
    <Card className="bg-bg-surface max-md:min-w-full rounded-2xl max-w-[520px] min-[1550px]:max-w-[580px] min-[1750px]:max-w-[818px]">
      <div className="flex gap-24 justify-between items-center w-full">
        <span className="text-2xl font-medium max-md:text-base">Position Breakdown</span>
      </div>
      <div className="my-4 border-border border-b" />
      <div className={cn('flex flex-col gap-8')}>
        <div className="flex flex-col gap-4">
          <p className="text-base font-medium">
            Input ({inputPool.length}){' '}
            <span
              className={cn(
                'pl-4',
                inputPool.length === 5 ? 'text-failed' : 'text-muted-foreground',
              )}
            >
              Maximum of 5 assets
            </span>
          </p>
          <ScrollArea.Root rootClassName="pb-5">
            <div className="flex gap-4">
              {inputPool.map((token) => (
                <ProgressBar
                  key={token.iid}
                  fbName={token.symbol}
                  color={token.color}
                  percentage={token.percentage}
                  icon={token.icon || ''}
                  chainId={token.chainId}
                />
              ))}
            </div>
          </ScrollArea.Root>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-base font-medium ">
            Output ({outputPool.length})
            <span
              className={cn(
                'pl-4',
                outputPool.length === 5 ? 'text-failed' : 'text-muted-foreground',
              )}
            >
              Maximum of 5 assets
            </span>
          </p>
          <ScrollArea.Root rootClassName="pb-5">
            <div className="flex gap-4">
              {outputPool.map((token) => (
                <ProgressBar
                  key={token.iid}
                  color={token.color}
                  fbName={token.symbol}
                  percentage={token.percentage}
                  icon={token.icon || ''}
                  chainId={token.chainId}
                />
              ))}
            </div>
          </ScrollArea.Root>
        </div>
      </div>
    </Card>
  )
}
