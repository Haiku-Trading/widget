import React from 'react'
import { HaikuWidget } from '../components/haiku-widget'
import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum, base, polygon } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

// Example Wagmi configuration
const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, base, polygon],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
})

// Example query client
const queryClient = new QueryClient()

// Providers setup (required)
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Complete example with providers
export function StandaloneExample() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Haiku Widget - Complete Example
          </h1>
          <HaikuWidget />
        </div>
      </div>
    </Providers>
  )
}

// Example with single token selection (no multi-select)
export function SingleTokenExample() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Haiku Widget - Single Token Selection
          </h1>
          <HaikuWidget 
            config={{
              multiInput: false,  // Only allow single input token
              multiOutput: false, // Only allow single output token
            }}
          />
        </div>
      </div>
    </Providers>
  )
}

// Example with preselected tokens
export function PreselectedTokensExample() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Haiku Widget - Preselected Tokens
          </h1>
          <HaikuWidget 
            config={{
              multiInput: false,
              multiOutput: false,
              preselectedInputs: {
                "uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": 100 // 100 USDC amount
              },
              preselectedOutputs: {
                "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 0.5, // 50% weight
                "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": 0.5  // 50% weight
              },
            }}
          />
        </div>
      </div>
    </Providers>
  )
}

// Minimal usage - just the widget (requires providers to be set up elsewhere)
export function MinimalExample() {
  return <HaikuWidget />
}
