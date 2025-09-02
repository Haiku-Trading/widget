import React from 'react';
import { SwapWidget } from '@haiku/swap-widget';

export function BasicUsageExample() {
  const handleSwapComplete = (transaction: any) => {
    console.log('Swap completed:', transaction);
    // Handle successful swap
  };

  const handleError = (error: Error) => {
    console.error('Swap error:', error);
    // Handle error
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Haiku Swap Widget Demo
        </h1>
        
        <SwapWidget
          apiKey="demo-api-key"
          onSwapComplete={handleSwapComplete}
          onError={handleError}
          className="shadow-2xl"
        />
      </div>
    </div>
  );
}
