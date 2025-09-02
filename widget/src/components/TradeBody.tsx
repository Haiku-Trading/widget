import React from 'react'
import { useTradeStore } from '../providers/trade-store-provider'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function TradeBody() {
  const { address } = useAccount()
  const { inputTokens, outputTokens, addInputToken, addOutputToken } = useTradeStore((state) => ({
    inputTokens: state.inputTokens,
    outputTokens: state.outputTokens,
    addInputToken: state.addInputToken,
    addOutputToken: state.addOutputToken,
  }))

  if (!address) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">
          <ConnectButton />
        </div>
        <p className="text-muted-foreground">Connect your wallet to start swapping</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Input Token Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">From</label>
        <div className="p-4 border border-border rounded-lg bg-bg-section">
          {inputTokens.length === 0 ? (
            <button
              onClick={() => {
                // Mock token for demo
                addInputToken([{
                  iid: 'eth-1',
                  symbol: 'ETH',
                  name: 'Ethereum',
                  address: '0x0000000000000000000000000000000000000000',
                  chainId: 1,
                  network: 1,
                  decimals: 18,
                  priceUSD: '2000',
                }])
              }}
              className="w-full p-3 text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              Select token
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <div>
                  <div className="font-medium">{inputTokens[0].symbol}</div>
                  <div className="text-sm text-muted-foreground">{inputTokens[0].name}</div>
                </div>
              </div>
              <input
                type="number"
                placeholder="0.0"
                className="text-right bg-transparent border-none outline-none text-lg font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <button className="p-2 rounded-full bg-bg-section hover:bg-bg-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Output Token Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">To</label>
        <div className="p-4 border border-border rounded-lg bg-bg-section">
          {outputTokens.length === 0 ? (
            <button
              onClick={() => {
                // Mock token for demo
                addOutputToken([{
                  iid: 'usdc-1',
                  symbol: 'USDC',
                  name: 'USD Coin',
                  address: '0xA0b86a33E6441b8c4C8C0b4b4b4b4b4b4b4b4b4b',
                  chainId: 1,
                  network: 1,
                  decimals: 6,
                  priceUSD: '1',
                }])
              }}
              className="w-full p-3 text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              Select token
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">{outputTokens[0].symbol}</div>
                  <div className="text-sm text-muted-foreground">{outputTokens[0].name}</div>
                </div>
              </div>
              <input
                type="number"
                placeholder="0.0"
                className="text-right bg-transparent border-none outline-none text-lg font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <button
        disabled={inputTokens.length === 0 || outputTokens.length === 0}
        className="w-full p-4 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        {inputTokens.length === 0 || outputTokens.length === 0
          ? 'Select tokens to swap'
          : 'Swap'}
      </button>
    </div>
  )
}
