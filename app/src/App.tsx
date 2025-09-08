import { WagmiProvider } from 'wagmi'
import { 
  arbitrum, 
  base, 
  bsc, 
  mainnet, 
  optimism, 
  polygon, 
  avalanche,
  gnosis,
  scroll,
  sepolia
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { HaikuWidget } from '@haiku/swap-widget'




// Create a client
const queryClient = new QueryClient()

// Configure chains for the app
const chains = [
  mainnet,        // 1: Ethereum
  optimism,       // 10: Optimism
  bsc,            // 56: BNB Smart Chain
  gnosis,         // 100: Gnosis
  polygon,        // 137: Polygon
  arbitrum,       // 42161: Arbitrum
  avalanche,      // 43114: Avalanche
  base,           // 8453: Base
  scroll,         // 534352: Scroll
  sepolia         // 11155111: Sepolia (testnet)
]

const config = getDefaultConfig({
  appName: 'Haiku Swap Widget Demo',
  projectId: '559f57c80e698d3d95adb8d69e8b9228', // Get from https://cloud.walletconnect.com
  chains: chains as any,
})

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Haiku Swap Widget Demo
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Connect your wallet and test the Haiku Swap Widget with support for 10 major networks
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Wallet Connection
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Connect your wallet to start using the Haiku Swap Widget
                  </p>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Swap Widget
                  </h2>
                  <p className="text-gray-600 mb-6">
                    The Haiku Swap Widget supports cross-chain swaps across major networks including Ethereum, Polygon, Arbitrum, and more
                  </p>

                  <HaikuWidget />
                  
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
