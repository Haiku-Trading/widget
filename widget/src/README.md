# Haiku Widget - Standalone Component

The Haiku Widget is a self-sufficient React component that can be integrated into any application. It includes its own HTTP client and session management, but requires Wagmi and QueryClient providers to be set up by the host application.

## Installation

```bash
npm install @mozaic-fi/haiku-widget
```

## Basic Usage

### Complete Example with Providers

```tsx
import { HaikuWidget } from '@mozaic-fi/haiku-widget'
import { createConfig, http } from 'wagmi'
import { mainnet, arbitrum, base } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

// Create your Wagmi configuration
const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
})

// Create your query client
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

function App() {
  return (
    <Providers>
      <HaikuWidget />
    </Providers>
  )
}
```

## What's Included

The widget includes:

- **Trading Interface**: Complete swap interface with token selection
- **HTTP Client**: Self-contained API client for `http://localhost:5001/v1`
- **Session Management**: Internal session and trade state management
- **Multi-chain Support**: Works with any chains configured in your Wagmi setup
- **Wallet Integration**: Uses your existing Wagmi/RainbowKit setup
- **Self-contained**: All trading logic and API calls are handled internally

## What You Need to Provide

- **Wagmi Provider**: For wallet connection and blockchain interactions
- **QueryClient Provider**: For data fetching and caching
- **RainbowKit Provider**: For wallet connection UI (optional but recommended)

## Key Features

1. **Simple Integration**: Just wrap with providers and use
2. **No Privy Dependency**: Completely independent of any auth system
3. **No Authentication Required**: Backend can be called freely
4. **Standard Pattern**: Follows the same pattern as other Web3 widgets
5. **Multi-chain Support**: Works with any chains in your Wagmi config
6. **Wallet Agnostic**: Supports any wallet via Wagmi/RainbowKit

## Requirements

- React 18+
- Wagmi v2+
- @tanstack/react-query
- @rainbow-me/rainbowkit
- A connected wallet (managed by host application)

## Features

- ✅ Simple integration pattern
- ✅ Multi-chain support (works with any chains in your Wagmi config)
- ✅ Token swapping
- ✅ Portfolio management
- ✅ Transaction signing
- ✅ EIP-7702 support
- ✅ No authentication required
- ✅ TypeScript support
- ✅ Self-contained API calls

## Support

For support and questions, please contact the Mozaic team.
