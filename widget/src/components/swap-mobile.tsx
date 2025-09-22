import { TradeBody } from './trade-body'
import { TradeHeader } from './trade-header'
import { useClassicTokensBalancesQuery } from '../queries'

export function SwapContainerMobile() {
  // Standard query usage
  const tokenBalancesQuery = useClassicTokensBalancesQuery()

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-sm mx-auto">
      <div className="w-full bg-bg-surface rounded-2xl flex flex-col border border-stroke-grey-primary shadow-lg">
        <TradeHeader tokenBalancesQuery={tokenBalancesQuery}/>
        <TradeBody />
      </div>
    </div>
  )
}
