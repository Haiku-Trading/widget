'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { TradeBody } from './TradeBody'
import { TradeHeader } from './TradeHeader'
import { useClassicTokensBalancesQuery } from '../hooks/useClassicTokensBalancesQuery'

export function SwapContainer() {
  const { address } = useAccount()

  // ON INITIAL LOAD, FETCH BALANCES
  const tokenBalancesQuery = useClassicTokensBalancesQuery()

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
    </div>
  )
}
