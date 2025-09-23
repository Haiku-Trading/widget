import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { HaikuWidget, WidgetTheme, WidgetConfig } from "./index";
import "./styles.css";
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
} from "wagmi/chains";

// Create a client
const queryClient = new QueryClient();

// Configure chains for development
const chains = [
  mainnet, // 1: Ethereum
  optimism, // 10: Optimism
  bsc, // 56: BNB Smart Chain
  gnosis, // 100: Gnosis
  polygon, // 137: Polygon
  arbitrum, // 42161: Arbitrum
  avalanche, // 43114: Avalanche
  base, // 8453: Base
  scroll, // 534352: Scroll
  berachain, // 80094: Berachain
  sei, // 1329: Sei
  worldchain, // 480: Worldchain
  katana, // 747474: Katana
];

const config = getDefaultConfig({
  appName: "Haiku Swap Widget Demo",
  projectId: "559f57c80e698d3d95adb8d69e8b9228", // Get from https://cloud.walletconnect.com
  chains: chains as any,
});

// Available chains for the playground
const availableChains = [
  { id: 1, name: "Ethereum", chain: mainnet },
  { id: 10, name: "Optimism", chain: optimism },
  { id: 56, name: "BSC", chain: bsc },
  { id: 100, name: "Gnosis", chain: gnosis },
  { id: 137, name: "Polygon", chain: polygon },
  { id: 42161, name: "Arbitrum", chain: arbitrum },
  { id: 43114, name: "Avalanche", chain: avalanche },
  { id: 8453, name: "Base", chain: base },
  { id: 534352, name: "Scroll", chain: scroll },
  { id: 80094, name: "Berachain", chain: berachain },
  { id: 1329, name: "Sei", chain: sei },
  { id: 480, name: "Worldchain", chain: worldchain },
  { id: 747474, name: "Katana", chain: katana },
];

// Available protocols for testing
const availableProtocols = [
  "AAVE_V3",
  "UNISWAP_V3",
  "SUSHISWAP",
  "CURVE",
  "BALANCER",
  "COMPOUND",
  "MAKER",
  "LIDO",
];

function DevApp() {
  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('dark');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');

  // Widget configuration state
  const [hiddenChains, setHiddenChains] = useState<number[]>([]);
  const [hiddenProtocols, setHiddenProtocols] = useState<string[]>([]);
  const [multiInput, setMultiInput] = useState(false);
  const [multiOutput, setMultiOutput] = useState(true);
  const [lockedInputs, setLockedInputs] = useState(false);
  const [lockedOutputs, setLockedOutputs] = useState(false);

  // Preselected tokens state
  const [preselectedInputs, setPreselectedInputs] = useState<Record<string, number>>({});
  const [preselectedOutputs, setPreselectedOutputs] = useState<Record<string, number>>({});

  // Computed widget config
  const widgetConfig = useMemo((): WidgetConfig => {
    const theme: WidgetTheme = {
      mode: themeMode,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
    };

    return {
      theme,
      hiddenChains: hiddenChains.length > 0 ? hiddenChains : undefined,
      hiddenProtocols: hiddenProtocols.length > 0 ? hiddenProtocols : undefined,
      multiInput,
      multiOutput,
      lockedInputs,
      lockedOutputs,
      preselectedInputs: Object.keys(preselectedInputs).length > 0 ? preselectedInputs : undefined,
      preselectedOutputs: Object.keys(preselectedOutputs).length > 0 ? preselectedOutputs : undefined,
    };
  }, [
    themeMode,
    primaryColor,
    secondaryColor,
    hiddenChains,
    hiddenProtocols,
    multiInput,
    multiOutput,
    lockedInputs,
    lockedOutputs,
    preselectedInputs,
    preselectedOutputs,
  ]);

  // Helper functions
  const toggleHiddenChain = (chainId: number) => {
    setHiddenChains(prev => 
      prev.includes(chainId) 
        ? prev.filter(id => id !== chainId)
        : [...prev, chainId]
    );
  };

  const toggleHiddenProtocol = (protocol: string) => {
    setHiddenProtocols(prev => 
      prev.includes(protocol) 
        ? prev.filter(p => p !== protocol)
        : [...prev, protocol]
    );
  };

  const resetConfig = () => {
    setThemeMode('dark');
    setPrimaryColor('#3B82F6');
    setSecondaryColor('#10B981');
    setHiddenChains([]);
    setHiddenProtocols([]);
    setMultiInput(false);
    setMultiOutput(true);
    setLockedInputs(false);
    setLockedOutputs(false);
    setPreselectedInputs({});
    setPreselectedOutputs({});
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Haiku Swap Widget Playground
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Experiment with real-time configuration changes
                </p>
                <div className="flex justify-center mb-4">
                  <ConnectButton />
                </div>
                <button
                  onClick={resetConfig}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium border border-red-600"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  Reset All Settings
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Theme Controls */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Theme</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mode
                        </label>
                        <select
                          value={themeMode}
                          onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'auto')}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="#10B981"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Widget Behavior Controls */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Widget Behavior</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={multiInput}
                          onChange={(e) => setMultiInput(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Multi Input</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={multiOutput}
                          onChange={(e) => setMultiOutput(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Multi Output</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={lockedInputs}
                          onChange={(e) => setLockedInputs(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Locked Inputs</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={lockedOutputs}
                          onChange={(e) => setLockedOutputs(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Locked Outputs</span>
                      </label>
                    </div>
                  </div>

                  {/* Hidden Chains */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Hidden Chains</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableChains.map((chain) => (
                        <label key={chain.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hiddenChains.includes(chain.id)}
                            onChange={() => toggleHiddenChain(chain.id)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {chain.name} ({chain.id})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Hidden Protocols */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Hidden Protocols</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableProtocols.map((protocol) => (
                        <label key={protocol} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={hiddenProtocols.includes(protocol)}
                            onChange={() => toggleHiddenProtocol(protocol)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{protocol}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Config JSON */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Config</h3>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(widgetConfig, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Widget Display */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Live Widget Preview
                    </h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <HaikuWidget config={widgetConfig} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>
);
