import { defineChain } from 'viem'
import { cookieStorage, createStorage, http } from 'wagmi'
import { arbitrum, base, bsc, sonic, mainnet, polygon, optimism, unichain, avalanche, gnosis, scroll, apeChain, sei, worldchain } from 'wagmi/chains'
import { createConfig } from 'wagmi'

// Custom chains for the widget
export const berachain = defineChain({
  id: 80094,
  name: 'Berachain',
  nativeCurrency: { name: 'BERA Token', symbol: 'BERA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.berachain.com/'] },
  },
  blockExplorers: {
    default: { name: 'Berascan', url: 'https://berascan.com/' },
  },
})

export const hyperevm = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HyperEVM', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperliquid.xyz/evm'] },
  },
  blockExplorers: {
    default: { name: 'Hyperscan', url: 'https://www.hyperscan.com' },
  },
})

export const katana = defineChain({
  id: 747474,
  name: 'Katana',
  nativeCurrency: { name: 'Katana', symbol: 'KAT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.katana.network'] },
  },
  blockExplorers: {
    default: { name: 'Katanascan', url: 'https://katanascan.com' },
  },
})

export const plasma = defineChain({
  id: 9745,
  name: 'Plasma',
  nativeCurrency: { name: 'Plasma', symbol: 'XPL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.plasma.dxchain.com'] },
  },
  blockExplorers: {
    default: { name: 'PlasmaScan', url: 'https://plasmascan.to' },
  },
})

// Function to get chains based on environment
const getChainsForEnvironment = () => {
  const productionReadyChains = [arbitrum, base, berachain, bsc, sonic, mainnet, hyperevm, polygon, gnosis, scroll, apeChain, avalanche, worldchain, katana, sei, plasma] as const
  
  // In production, only include these chains
  if (process.env.VERCEL_ENV === 'production') {
    return productionReadyChains
  }
  
  // In development, include all chains
  return [...productionReadyChains, optimism, unichain] as const
}

export const wagmiConfig = createConfig({
  chains: getChainsForEnvironment(),
  transports: {
    [arbitrum.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.ARB_RPC
        : undefined,
    ),
    [base.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.BASE_RPC
        : undefined,
    ),
    [berachain.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.BERACHAIN_RPC
        : undefined,
    ),
    [bsc.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.BSC_RPC
        : undefined,
    ),
    [sonic.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.SONIC_RPC
        : undefined,
    ),
    [mainnet.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.ETH_RPC
        : undefined,
    ),
    [hyperevm.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.HYPE_RPC
        : undefined,
    ),
    [polygon.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.POLYGON_RPC
        : undefined,
    ),
    [optimism.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.OPTIMISM_RPC
        : undefined,
    ),
    [unichain.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.UNICHAIN_RPC
        : undefined,
    ),
    [sei.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.SEI_RPC
        : undefined,
    ),
    [avalanche.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.AVAX_RPC
        : undefined,
    ),
    [gnosis.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.GNOSIS_RPC
        : undefined,
    ),
    [scroll.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.SCROLL_RPC
        : undefined,
    ),
    [katana.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.KATANA_RPC
        : undefined,
    ),
    [apeChain.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.APECHAIN_RPC
        : undefined,
    ),
    [worldchain.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.WORLDCHAIN_RPC
        : undefined,
    ),
    [plasma.id]: http(
      process.env.VERCEL_ENV === 'development'
        ? process.env.PLASMA_RPC
        : undefined,
    ),
  },
  ssr: false, // Disable SSR for standalone widget
  storage: createStorage({
    storage: cookieStorage,
  }),
})
