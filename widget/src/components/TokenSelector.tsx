import React, { useState } from 'react';
import { Token, TokenType } from '../types';
import { cn, formatNumber } from '../utils';

interface TokenSelectorProps {
  selectedTokens: Token[];
  onTokensChange: (tokens: Token[]) => void;
  onAmountChange: (tokenId: string, amount: string) => void;
  amounts: Record<string, string>;
  type: 'input' | 'output';
  readOnly?: boolean;
}

export function TokenSelector({
  selectedTokens,
  onTokensChange,
  onAmountChange,
  amounts,
  type,
  readOnly = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTokenSelect = (token: Token) => {
    if (type === 'input') {
      onTokensChange([token]);
    } else {
      onTokensChange([token]);
    }
    setIsOpen(false);
  };

  const handleAmountChange = (tokenId: string, value: string) => {
    if (readOnly) return;
    onAmountChange(tokenId, value);
  };

  const selectedToken = selectedTokens[0];
  const amount = selectedToken ? amounts[selectedToken.iid] || '' : '';

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Token Display */}
        <div className="flex items-center space-x-2">
          {selectedToken ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {selectedToken.logoURI ? (
                  <img
                    src={selectedToken.logoURI}
                    alt={selectedToken.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {selectedToken.symbol.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedToken.symbol}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedToken.name}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Select Token
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="flex-1">
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(selectedToken?.iid || '', e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className={cn(
              'w-full text-right bg-transparent text-lg font-medium text-gray-900 dark:text-white',
              'placeholder-gray-400 dark:placeholder-gray-500',
              'focus:outline-none',
              readOnly && 'cursor-default'
            )}
          />
        </div>

        {/* Select Token Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Token Selection Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Popular Tokens */}
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Popular</div>
            <div className="grid grid-cols-2 gap-2">
              {popularTokens.map((token) => (
                <button
                  key={token.iid}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {token.logoURI ? (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-4 h-4 rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {token.symbol.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mock popular tokens - in real implementation, this would come from your API
const popularTokens: Token[] = [
  {
    iid: 'eth:1',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    network: 1,
    type: TokenType.Native,
    primaryColor: '#627EEA',
  },
  {
    iid: 'usdc:1',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    network: 1,
    type: TokenType.ERC20,
    primaryColor: '#2775CA',
  },
  {
    iid: 'wbtc:1',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    network: 1,
    type: TokenType.ERC20,
    primaryColor: '#F7931A',
  },
  {
    iid: 'dai:1',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    network: 1,
    type: TokenType.ERC20,
    primaryColor: '#F5AC37',
  },
];
