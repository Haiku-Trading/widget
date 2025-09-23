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

// Example token IDs for testing
const exampleTokens = {
  inputs: [
    { id: "uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Universal)" },
    { id: "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Base)" },
    { id: "polygon:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "MATIC (Polygon)" },
  ],
  outputs: [
    { id: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", name: "USDC (Base)" },
    { id: "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Base)" },
    { id: "polygon:0x2791bca1f2de4661ed88a30c99a7a9449aa84174", name: "USDC (Polygon)" },
  ]
};

function DevApp() {
  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('dark');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');

  // Widget configuration state
  const [hiddenChains, setHiddenChains] = useState<number[]>([]);
  const [hiddenProtocols, setHiddenProtocols] = useState<string[]>([]);
  const [singleInput, setSingleInput] = useState(false);
  const [singleOutput, setSingleOutput] = useState(false);
  const [lockedInputs, setLockedInputs] = useState(false);
  const [lockedOutputs, setLockedOutputs] = useState(false);

  // Preselected tokens state
  const [preselectedInputs, setPreselectedInputs] = useState<Record<string, number>>({});
  const [preselectedOutputs, setPreselectedOutputs] = useState<Record<string, number>>({});
  
  // Input for adding new preselected tokens
  const [newInputTokenId, setNewInputTokenId] = useState('');
  const [newInputAmount, setNewInputAmount] = useState('');
  const [newOutputTokenId, setNewOutputTokenId] = useState('');
  const [newOutputWeight, setNewOutputWeight] = useState('');

  // Computed widget config
  const widgetConfig = useMemo((): WidgetConfig => {
    const theme: WidgetTheme = {
      mode: themeMode,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      // Add some example additional colors to test the new system
      accentColor: '#EC4899', // Pink
      successColor: '#10B981', // Green
      warningColor: '#F59E0B', // Amber
      errorColor: '#EF4444', // Red
    };

    return {
      theme,
      hiddenChains: hiddenChains.length > 0 ? hiddenChains : undefined,
      hiddenProtocols: hiddenProtocols.length > 0 ? hiddenProtocols : undefined,
      multiInput: !singleInput, // Convert single to multi
      multiOutput: !singleOutput, // Convert single to multi
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
    singleInput,
    singleOutput,
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

  const addPreselectedInput = () => {
    if (newInputTokenId && newInputAmount) {
      const amount = parseFloat(newInputAmount);
      if (!isNaN(amount)) {
        setPreselectedInputs(prev => ({
          ...prev,
          [newInputTokenId]: amount
        }));
        setNewInputTokenId('');
        setNewInputAmount('');
      }
    }
  };

  const addPreselectedOutput = () => {
    if (newOutputTokenId && newOutputWeight) {
      const weight = parseFloat(newOutputWeight);
      if (!isNaN(weight)) {
        setPreselectedOutputs(prev => ({
          ...prev,
          [newOutputTokenId]: weight
        }));
        setNewOutputTokenId('');
        setNewOutputWeight('');
      }
    }
  };

  const removePreselectedInput = (tokenId: string) => {
    setPreselectedInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[tokenId];
      return newInputs;
    });
  };

  const removePreselectedOutput = (tokenId: string) => {
    setPreselectedOutputs(prev => {
      const newOutputs = { ...prev };
      delete newOutputs[tokenId];
      return newOutputs;
    });
  };

  const resetConfig = () => {
    setThemeMode('dark');
    setPrimaryColor('#3B82F6');
    setSecondaryColor('#10B981');
    setHiddenChains([]);
    setHiddenProtocols([]);
    setSingleInput(false);
    setSingleOutput(false);
    setLockedInputs(false);
    setLockedOutputs(false);
    setPreselectedInputs({});
    setPreselectedOutputs({});
    setNewInputTokenId('');
    setNewInputAmount('');
    setNewOutputTokenId('');
    setNewOutputWeight('');
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
                          checked={singleInput}
                          onChange={(e) => setSingleInput(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Single Input</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={singleOutput}
                          onChange={(e) => setSingleOutput(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Single Output</span>
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

                  {/* Preselected Inputs */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Preselected Inputs</h3>
                    
                    {/* Add new input */}
                    <div className="space-y-2 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Token ID (e.g., uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee)
                        </label>
                        <input
                          type="text"
                          value={newInputTokenId}
                          onChange={(e) => setNewInputTokenId(e.target.value)}
                          placeholder="uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                          className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Amount
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={newInputAmount}
                          onChange={(e) => setNewInputAmount(e.target.value)}
                          placeholder="1.0"
                          className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={addPreselectedInput}
                        className="w-full px-3 py-2 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                        style={{ backgroundColor: '#3b82f6', color: 'white' }}
                      >
                        Add Input Token
                      </button>
                      
                      {/* Quick examples */}
                      <div className="text-xs text-gray-600 mb-2">Quick examples:</div>
                      <div className="flex flex-wrap gap-1">
                        {exampleTokens.inputs.map((token) => (
                          <button
                            key={token.id}
                            onClick={() => {
                              setNewInputTokenId(token.id);
                              setNewInputAmount('1.0');
                            }}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                            title={token.id}
                          >
                            {token.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Current inputs */}
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(preselectedInputs).map(([tokenId, amount]) => (
                        <div key={tokenId} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                          <div className="flex-1 min-w-0">
                            <div className="font-mono truncate">{tokenId}</div>
                            <div className="text-gray-600">Amount: {amount}</div>
                          </div>
                          <button
                            onClick={() => removePreselectedInput(tokenId)}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preselected Outputs */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Preselected Outputs</h3>
                    
                    {/* Add new output */}
                    <div className="space-y-2 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Token ID (e.g., base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)
                        </label>
                        <input
                          type="text"
                          value={newOutputTokenId}
                          onChange={(e) => setNewOutputTokenId(e.target.value)}
                          placeholder="base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
                          className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Weight (0.0 - 1.0)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={newOutputWeight}
                          onChange={(e) => setNewOutputWeight(e.target.value)}
                          placeholder="0.5"
                          className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={addPreselectedOutput}
                        className="w-full px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                        style={{ backgroundColor: '#10b981', color: 'white' }}
                      >
                        Add Output Token
                      </button>
                      
                      {/* Quick examples */}
                      <div className="text-xs text-gray-600 mb-2">Quick examples:</div>
                      <div className="flex flex-wrap gap-1">
                        {exampleTokens.outputs.map((token) => (
                          <button
                            key={token.id}
                            onClick={() => {
                              setNewOutputTokenId(token.id);
                              setNewOutputWeight('0.5');
                            }}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                            title={token.id}
                          >
                            {token.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Current outputs */}
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(preselectedOutputs).map(([tokenId, weight]) => (
                        <div key={tokenId} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                          <div className="flex-1 min-w-0">
                            <div className="font-mono truncate">{tokenId}</div>
                            <div className="text-gray-600">Weight: {weight}</div>
                          </div>
                          <button
                            onClick={() => removePreselectedOutput(tokenId)}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                          >
                            ×
                          </button>
                        </div>
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
                      <HaikuWidget 
                        key={JSON.stringify(widgetConfig)} 
                        config={widgetConfig} 
                      />
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
