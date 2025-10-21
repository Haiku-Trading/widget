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
  berachain,
  sei,
  worldchain,
  katana,
} from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { HaikuWidget, WidgetTheme } from '@haiku-trade/widget'
// import '@haiku-trade/widget/dist/styles.css'


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
  berachain,      // 80094: Berachain
  sei,            // 1329: Sei
  worldchain,     // 480: Worldchain
  katana,         // 747474: Katana
]

const config = getDefaultConfig({
  appName: 'Haiku Swap Widget Demo',
  projectId: '559f57c80e698d3d95adb8d69e8b9228', // Get from https://cloud.walletconnect.com
  chains: chains as any,
})

function App() {
  // Define different theme examples
  
  const redTheme: WidgetTheme = {
    mode: 'auto',
    light: {
      primaryColor: '#EF4444', // Red
      secondaryColor: '#06B6D4' // Cyan
    },
    dark: {
      primaryColor: '#EF4444', // Red
      secondaryColor: '#06B6D4' // Cyan
    }
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

                <div className="card mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Widget Authentication
                  </h2>
                  <p className="text-gray-600 mb-4">
                    The Haiku Widget now requires a <code className="bg-gray-100 px-2 py-1 rounded">widgetKey</code> prop for authentication. 
                    This key is used to authenticate requests to the Haiku backend API via the <code className="bg-gray-100 px-2 py-1 rounded">x-widget-key</code> header.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Integration Example:</h3>
                    <pre className="text-sm text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
{`<HaikuWidget 
  widgetKey="your-widget-key-here" 
  config={{ theme: customTheme }} 
/>`}
                    </pre>
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
                      <HaikuWidget 
                        widgetKey="demo-widget-key-12345" 
                        config={{ theme: redTheme }} 
                      />
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
                      <p>✅ Widget key authentication</p>
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
