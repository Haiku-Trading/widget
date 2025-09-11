
import { TradeBody } from './trade-body'
import { TradeHeader } from './trade-header'
import { useClassicTokensBalancesQuery } from '../queries'

export function SwapContainer() {
  // Standard query usage
  const tokenBalancesQuery = useClassicTokensBalancesQuery()

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-12 w-full">
      <div className="max-w-[520px] max-h-[800px] w-full bg-bg-surface rounded-3xl flex flex-col border border-stroke-grey-primary">
        <TradeHeader tokenBalancesQuery={tokenBalancesQuery}/>
        <TradeBody />
      </div>

      {/* {(inputTokens.length || outputTokens.length) > 0 && context === 'classic' && (
        <div className="w-1/2 max-[1396px]:w-full max-[1396px]:max-w-[520px] overflow-x-auto">
          <PositionBreakdown inputTokens={inputTokens} outputTokens={outputTokens} />
        </div>
      )} */}
    </div>
  )
}
