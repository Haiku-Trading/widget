import React, { useState } from 'react';
import { SwapWidget } from '@haiku/swap-widget';

export function AdvancedUsageExample() {
  const [theme, setTheme] = useState({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '16px',
    fontFamily: 'Inter, sans-serif',
  });

  const [displayMode, setDisplayMode] = useState<'compact' | 'full' | 'drawer'>('full');

  const handleSwapComplete = (transaction: any) => {
    console.log('Swap completed:', transaction);
    // You could show a toast notification here
    alert(`Swap completed! Transaction: ${transaction.hash}`);
  };

  const handleQuoteUpdate = (quote: any) => {
    console.log('Quote updated:', quote);
    // You could update UI with quote information
  };

  const handleError = (error: Error) => {
    console.error('Swap error:', error);
    // You could show an error toast here
    alert(`Error: ${error.message}`);
  };

  const themes = {
    default: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '16px',
      fontFamily: 'Inter, sans-serif',
    },
    dark: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderRadius: '20px',
      fontFamily: 'Inter, sans-serif',
    },
    berachain: {
      primaryColor: '#fbbf24',
      secondaryColor: '#f59e0b',
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      borderRadius: '24px',
      fontFamily: 'Inter, sans-serif',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Haiku Swap Widget - Advanced Demo
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Customization Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                onChange={(e) => setTheme(themes[e.target.value as keyof typeof themes])}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="berachain">Berachain</option>
              </select>
            </div>

            {/* Display Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <select
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="compact">Compact</option>
                <option value="full">Full</option>
                <option value="drawer">Drawer</option>
              </select>
            </div>

            {/* Custom CSS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <button
                onClick={() => {
                  const customCSS = `
                    .haiku-swap-widget {
                      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                      border: 2px solid ${theme.primaryColor};
                    }
                  `;
                  setTheme(prev => ({ ...prev, customCSS }));
                }}
                className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Custom Shadow
              </button>
            </div>
          </div>
        </div>

        {/* Widget */}
        <div className="flex justify-center">
          <SwapWidget
            apiKey="demo-api-key"
            theme={theme}
            displayMode={displayMode}
            supportedChains={[1, 137, 1329]} // Ethereum, Polygon, Berachain
            defaultTokens={[
              {
                iid: 'eth:1',
                symbol: 'ETH',
                name: 'Ethereum',
                decimals: 18,
                network: 1,
                type: 'Native',
              },
              {
                iid: 'usdc:1',
                symbol: 'USDC',
                name: 'USD Coin',
                decimals: 6,
                network: 1,
                type: 'ERC20',
              },
            ]}
            slippageTolerance={0.5}
            onSwapComplete={handleSwapComplete}
            onQuoteUpdate={handleQuoteUpdate}
            onError={handleError}
            className="shadow-2xl"
          />
        </div>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Widget Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✅ Multi-chain support</li>
              <li>✅ Custom theming</li>
              <li>✅ Responsive design</li>
              <li>✅ Wallet integration</li>
              <li>✅ Real-time quotes</li>
              <li>✅ Error handling</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Integration Benefits</h3>
            <ul className="space-y-2 text-gray-600">
              <li>🚀 Easy to integrate</li>
              <li>🎨 Fully customizable</li>
              <li>📱 Mobile responsive</li>
              <li>🔒 Secure by default</li>
              <li>⚡ Lightweight</li>
              <li>🔄 Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
