import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { WidgetConfig, SwapState, SwapQuote, SwapTransaction, Token } from '../types';
import { cn, formatUSD } from '../utils';
import { TokenSelector } from './TokenSelector';
import { SwapButton } from './SwapButton';
import { SwapWidgetProvider } from '../providers/SwapWidgetProvider';

interface SwapWidgetProps extends WidgetConfig {
  className?: string;
}

export function SwapWidget({
  apiKey,
  theme,
  supportedChains,
  defaultTokens,
  slippageTolerance = 0.5,
  displayMode = 'full',
  onSwapComplete,
  onQuoteUpdate,
  onError,
  className,
}: SwapWidgetProps) {
  const [swapState, setSwapState] = useState<SwapState>({
    inputTokens: defaultTokens?.slice(0, 1) || [],
    outputTokens: defaultTokens?.slice(1, 2) || [],
    inputAmounts: {},
    outputAmounts: {},
    slippage: slippageTolerance,
    isLoading: false,
  });

  const [quote, setQuote] = useState<SwapQuote | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputTokenChange = useCallback((tokens: Token[]) => {
    setSwapState(prev => ({
      ...prev,
      inputTokens: tokens,
      inputAmounts: {},
    }));
  }, []);

  const handleOutputTokenChange = useCallback((tokens: Token[]) => {
    setSwapState(prev => ({
      ...prev,
      outputTokens: tokens,
      outputAmounts: {},
    }));
  }, []);

  const handleInputAmountChange = useCallback((tokenId: string, amount: string) => {
    setSwapState(prev => ({
      ...prev,
      inputAmounts: {
        ...prev.inputAmounts,
        [tokenId]: amount,
      },
    }));
  }, []);

  const handleSwapComplete = useCallback((transaction: SwapTransaction) => {
    onSwapComplete?.(transaction);
    // Reset state after successful swap
    setSwapState(prev => ({
      ...prev,
      inputAmounts: {},
      outputAmounts: {},
    }));
  }, [onSwapComplete]);

  const handleError = useCallback((error: Error) => {
    onError?.(error);
    setSwapState(prev => ({
      ...prev,
      error: error.message,
    }));
  }, [onError]);

  // Update quote when swap state changes
  useEffect(() => {
    if (swapState.inputTokens.length > 0 && swapState.outputTokens.length > 0) {
      // Here you would call your quote API
      // For now, we'll simulate a quote update
      const hasInputAmounts = Object.values(swapState.inputAmounts).some(amount => parseFloat(amount) > 0);
      
      if (hasInputAmounts) {
        // Simulate quote calculation
        const mockQuote: SwapQuote = {
          inputTokens: swapState.inputTokens,
          outputTokens: swapState.outputTokens,
          inputAmounts: swapState.inputAmounts,
          outputAmounts: swapState.outputAmounts,
          usdInputTotal: '0',
          usdOutputTotal: '0',
          slippage: swapState.slippage,
        };
        
        setQuote(mockQuote);
        onQuoteUpdate?.(mockQuote);
      }
    }
  }, [swapState, onQuoteUpdate]);

  const widgetClasses = cn(
    'haiku-swap-widget',
    'bg-white dark:bg-gray-900',
    'rounded-xl border border-gray-200 dark:border-gray-700',
    'shadow-lg',
    displayMode === 'compact' && 'p-4',
    displayMode === 'full' && 'p-6',
    displayMode === 'drawer' && 'p-4',
    className
  );

  return (
    <SwapWidgetProvider
      apiKey={apiKey}
      supportedChains={supportedChains}
      theme={theme}
    >
      <div className={widgetClasses}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Swap Tokens
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by Haiku
          </p>
        </div>

        <div className="space-y-4">
          {/* Input Token Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </label>
            <TokenSelector
              selectedTokens={swapState.inputTokens}
              onTokensChange={handleInputTokenChange}
              onAmountChange={handleInputAmountChange}
              amounts={swapState.inputAmounts}
              type="input"
            />
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSwapState(prev => ({
                  ...prev,
                  inputTokens: prev.outputTokens,
                  outputTokens: prev.inputTokens,
                  inputAmounts: prev.outputAmounts,
                  outputAmounts: prev.inputAmounts,
                }));
              }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Output Token Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </label>
            <TokenSelector
              selectedTokens={swapState.outputTokens}
              onTokensChange={handleOutputTokenChange}
              onAmountChange={() => {}} // Output amounts are calculated
              amounts={swapState.outputAmounts}
              type="output"
              readOnly
            />
          </div>

          {/* Quote Display */}
          {quote && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                <span className="text-gray-900 dark:text-white">
                  1 {quote.inputTokens[0]?.symbol} = {formatUSD(quote.usdInputTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Slippage:</span>
                <span className="text-gray-900 dark:text-white">{quote.slippage}%</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <SwapButton
            swapState={swapState}
            quote={quote}
            onSwap={handleSwapComplete}
            onError={handleError}
            isLoading={isLoading}
          />
        </div>
      </div>
    </SwapWidgetProvider>
  );
}
