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
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { HaikuWidget, WidgetTheme } from '@haiku/swap-widget'
import '@haiku/swap-widget/dist/styles.css'




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
]

const config = getDefaultConfig({
  appName: 'Haiku Swap Widget Demo',
  projectId: '559f57c80e698d3d95adb8d69e8b9228', // Get from https://cloud.walletconnect.com
  chains: chains as any,
})

function App() {
  // Define different theme examples
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
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Haiku Swap Widget Demo
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Connect your wallet and test the Haiku Swap Widget with custom theming support
                </p>
              </div>
              
              <div className="max-w-6xl mx-auto">
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

                {/* Theme Examples */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Default Theme */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Default Theme
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Original widget styling
                    </p>
                    <div className="border rounded-lg p-4 bg-white">
                      <HaikuWidget theme={defaultTheme} />
                    </div>
                  </div>

                  {/* Blue Theme */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Blue Theme (Light)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Primary: #3B82F6, Secondary: #10B981
                    </p>
                    <div className="border rounded-lg p-4 bg-white">
                      <HaikuWidget theme={blueTheme} />
                    </div>
                  </div>

                  {/* Purple Theme */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Purple Theme (Dark)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Primary: #8B5CF6, Secondary: #F59E0B
                    </p>
                    <div className="border rounded-lg p-4 bg-gray-800">
                      <HaikuWidget theme={purpleTheme} />
                    </div>
                  </div>

                  {/* Red Theme */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Red Theme (Auto)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Primary: #EF4444, Secondary: #06B6D4
                    </p>
                    <div className="border rounded-lg p-4 bg-white">
                      <HaikuWidget theme={redTheme} />
                    </div>
                  </div>

                  {/* Orange Theme */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Orange Theme (Auto)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Primary: #F97316, Secondary: #84CC16
                    </p>
                    <div className="border rounded-lg p-4 bg-white">
                      <HaikuWidget theme={orangeTheme} />
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="card">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Theming Features
                    </h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>✅ Custom primary & secondary colors</p>
                      <p>✅ Light, dark, and auto modes</p>
                      <p>✅ Hex color support (#3B82F6)</p>
                      <p>✅ Automatic color conversion</p>
                      <p>✅ TypeScript support</p>
                      <p>✅ Backward compatible</p>
                    </div>
                  </div>
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
