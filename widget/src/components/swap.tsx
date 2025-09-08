'use client'

import { useClassicTokensBalancesQuery } from '../queries'
import { useEffect } from 'react'
import { TradeBody } from './trade-body'
import { TradeHeader } from './trade-header'
import { useAccount } from 'wagmi'

export function SwapContainer() {
  // ON INITIAL LOAD, FETCH BALANCES
  const tokenBalancesQuery = useClassicTokensBalancesQuery()
  const { address } = useAccount()

  // Add visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && address) {
        tokenBalancesQuery.refetch()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [tokenBalancesQuery, address])

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
