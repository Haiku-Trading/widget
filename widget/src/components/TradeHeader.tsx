import React from 'react'
import { useTradeStore } from '../providers/trade-store-provider'
import { useClassicTokensBalancesQuery } from '../hooks/useClassicTokensBalancesQuery'

type TradeHeaderProps = {
  tokenBalancesQuery: ReturnType<typeof useClassicTokensBalancesQuery>
}

export function TradeHeader({ tokenBalancesQuery }: TradeHeaderProps) {
  const { isShowBalance, handleShowBalance } = useTradeStore((state) => ({
    isShowBalance: state.isShowBalance,
    handleShowBalance: state.handleShowBalance,
  }))

  return (
    <div className="flex items-center justify-between p-6 border-b border-stroke-grey-primary">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-foreground">Swap</h2>
        <button
          onClick={handleShowBalance}
          className="p-2 rounded-lg hover:bg-bg-section transition-colors"
        >
          {isShowBalance ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Slippage</span>
        <select className="px-3 py-1 text-sm border border-border rounded-md bg-background">
          <option value="0.001">0.1%</option>
          <option value="0.003" selected>0.3%</option>
          <option value="0.005">0.5%</option>
          <option value="0.01">1.0%</option>
        </select>
      </div>
    </div>
  )
}
