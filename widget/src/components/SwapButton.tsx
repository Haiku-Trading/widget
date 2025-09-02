import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { SwapState, SwapQuote, SwapTransaction } from '../types';
import { cn, validateAmount } from '../utils';

interface SwapButtonProps {
  swapState: SwapState;
  quote?: SwapQuote;
  onSwap: (transaction: SwapTransaction) => void;
  onError: (error: Error) => void;
  isLoading?: boolean;
}

export function SwapButton({
  swapState,
  quote,
  onSwap,
  onError,
  isLoading = false,
}: SwapButtonProps) {
  const { isConnected, address } = useAccount();
  const [isExecuting, setIsExecuting] = useState(false);

  const canSwap = () => {
    if (!isConnected) return false;
    if (swapState.inputTokens.length === 0 || swapState.outputTokens.length === 0) return false;
    
    const hasValidInputAmounts = Object.values(swapState.inputAmounts).some(amount => 
      validateAmount(amount)
    );
    
    if (!hasValidInputAmounts) return false;
    if (!quote) return false;
    
    return true;
  };

  const handleSwap = async () => {
    if (!canSwap()) return;
    
    setIsExecuting(true);
    
    try {
      // Simulate swap execution
      // In real implementation, this would call your swap API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTransaction: SwapTransaction = {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'confirmed',
        inputTokens: swapState.inputTokens,
        outputTokens: swapState.outputTokens,
        inputAmounts: swapState.inputAmounts,
        outputAmounts: swapState.outputAmounts,
        timestamp: Date.now(),
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      };
      
      onSwap(mockTransaction);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Swap failed'));
    } finally {
      setIsExecuting(false);
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (swapState.inputTokens.length === 0 || swapState.outputTokens.length === 0) return 'Select Tokens';
    if (!Object.values(swapState.inputAmounts).some(amount => validateAmount(amount))) return 'Enter Amount';
    if (!quote) return 'Getting Quote...';
    if (isExecuting) return 'Swapping...';
    return 'Swap';
  };

  const getButtonState = () => {
    if (!isConnected) return 'connect';
    if (!canSwap()) return 'disabled';
    if (isExecuting || isLoading) return 'loading';
    return 'ready';
  };

  const buttonState = getButtonState();

  return (
    <div className="space-y-3">
      {/* Wallet Connection Status */}
      {!isConnected && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Connect your wallet to start swapping
          </p>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={buttonState === 'disabled' || buttonState === 'loading'}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          buttonState === 'connect' && [
            'bg-blue-600 hover:bg-blue-700 text-white',
            'focus:ring-blue-500',
            'shadow-lg hover:shadow-xl'
          ],
          buttonState === 'ready' && [
            'bg-green-600 hover:bg-green-700 text-white',
            'focus:ring-green-500',
            'shadow-lg hover:shadow-xl'
          ],
          buttonState === 'disabled' && [
            'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400',
            'cursor-not-allowed'
          ],
          buttonState === 'loading' && [
            'bg-gray-400 dark:bg-gray-500 text-white',
            'cursor-wait'
          ]
        )}
      >
        {buttonState === 'loading' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{getButtonText()}</span>
          </div>
        )}
        {buttonState !== 'loading' && getButtonText()}
      </button>

      {/* Swap Details */}
      {quote && canSwap() && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Input:</span>
            <span className="text-gray-900 dark:text-white">
              {Object.entries(swapState.inputAmounts)
                .filter(([_, amount]) => validateAmount(amount))
                .map(([tokenId, amount]) => {
                  const token = swapState.inputTokens.find(t => t.iid === tokenId);
                  return `${amount} ${token?.symbol}`;
                })
                .join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Output:</span>
            <span className="text-gray-900 dark:text-white">
              {Object.entries(swapState.outputAmounts)
                .filter(([_, amount]) => validateAmount(amount))
                .map(([tokenId, amount]) => {
                  const token = swapState.outputTokens.find(t => t.iid === tokenId);
                  return `${amount} ${token?.symbol}`;
                })
                .join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Slippage:</span>
            <span className="text-gray-900 dark:text-white">{swapState.slippage}%</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {swapState.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{swapState.error}</p>
        </div>
      )}
    </div>
  );
}
