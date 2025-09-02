import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains';
import { QueryClient as WagmiQueryClient } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { HaikuConfig } from '../types/config';
import { HttpClientProvider } from './http';
import { TradeStoreProvider } from './trade-store-provider';

interface HaikuContextValue {
  config: HaikuConfig;
}

const HaikuContext = createContext<HaikuContextValue | null>(null);

export const useHaikuConfig = () => {
  const context = useContext(HaikuContext);
  if (!context) {
    throw new Error('useHaikuConfig must be used within HaikuProvider');
  }
  return context;
};

interface HaikuProviderProps {
  children: ReactNode;
  config: HaikuConfig;
}

export function HaikuProvider({ children, config }: HaikuProviderProps) {
  const queryClient = new QueryClient();
  const wagmiQueryClient = new WagmiQueryClient();

  const supportedChains = config.supportedChains 
    ? config.supportedChains.map(chainId => {
        switch (chainId) {
          case 1: return mainnet;
          case 137: return polygon;
          case 42161: return arbitrum;
          case 10: return optimism;
          case 8453: return base;
          case 11155111: return sepolia;
          default: return mainnet;
        }
      })
    : [mainnet, polygon, arbitrum, optimism, base];

  // Ensure we have at least one chain and type it correctly
  const chains: readonly [typeof mainnet, ...typeof mainnet[]] = [
    supportedChains[0] || mainnet,
    ...supportedChains.slice(1)
  ] as readonly [typeof mainnet, ...typeof mainnet[]];

  const wagmiConfig = createConfig({
    chains,
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
      [base.id]: http(),
      [sepolia.id]: http(),
    } as Record<number, ReturnType<typeof http>>,
  });

  return (
    <HaikuContext.Provider value={{ config }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <HttpClientProvider>
              <TradeStoreProvider>
                {children}
              </TradeStoreProvider>
            </HttpClientProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HaikuContext.Provider>
  );
}
