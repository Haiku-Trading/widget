import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { HaikuWidget, WidgetTheme } from './index'
import './styles.css'

// Create a client
const queryClient = new QueryClient()

// Configure chains for development
const config = getDefaultConfig({
  appName: 'Haiku Swap Widget Dev',
  projectId: '559f57c80e698d3d95adb8d69e8b9228', // Get from https://cloud.walletconnect.com
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: [process.env.ETH_RPC || 'https://eth.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'Etherscan', url: 'https://etherscan.io' },
      },
    },
    {
      id: 137,
      name: 'Polygon',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: {
        default: { http: [process.env.POLYGON_RPC || 'https://polygon-rpc.com'] },
      },
      blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
      },
    },
    {
      id: 42161,
      name: 'Arbitrum',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: [process.env.ARB_RPC || 'https://arb1.arbitrum.io/rpc'] },
      },
      blockExplorers: {
        default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
      },
    },
  ] as any,
})

function DevApp() {
  // Define different theme examples for testing
  const defaultTheme: WidgetTheme = {}
  
  const blueTheme: WidgetTheme = {
    mode: 'light',
    primaryColor: '#3B82F6', // Blue
    secondaryColor: '#10B981' // Green
  }

  const purpleTheme: WidgetTheme = {
    mode: 'dark',
    primaryColor: '#8B5CF6', // Purple
    secondaryColor: '#F59E0B' // Amber
  }

  const redTheme: WidgetTheme = {
    mode: 'auto',
    primaryColor: '#EF4444', // Red
    secondaryColor: '#06B6D4' // Cyan
  }

  const orangeTheme: WidgetTheme = {
    primaryColor: '#F97316', // Orange
    secondaryColor: '#84CC16' // Lime
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Haiku Swap Widget - Development
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Live reloading enabled! Make changes to see them instantly.
                </p>
                <div className="flex justify-center mb-8">
                  <ConnectButton />
                </div>
              </div>
              
              {/* Theme Examples */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Default Theme */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Default Theme
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Original widget styling
                  </p>
                  <div className="border rounded-lg p-4">
                    <HaikuWidget theme={defaultTheme} />
                  </div>
                </div>
              </div>


              {/* Development Info */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Development Mode
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✅ Hot Module Replacement (HMR) enabled</p>
                  <p>✅ Fast rebuilds with Vite</p>
                  <p>✅ Source maps for debugging</p>
                  <p>✅ Multiple theme examples</p>
                  <p>✅ Wallet connection ready</p>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>
)
