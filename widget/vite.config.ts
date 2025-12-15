import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'

// Environment configuration - hardcoded for public deployment
const isDev = process.env.NODE_ENV === 'development'
const useDist = process.env.USE_DIST === 'true'
const envConfig = {
  TURN_OFF_EIP7702: "false",
  VERCEL_ENV: isDev ? "development" : "production",
  API_BASE_URL: isDev ? "http://localhost:5001/v1" : "https://api.haiku.trade/v1",
  SOLVER_PERMIT2_TYPE: "permit",
  ARB_RPC: "https://arb1.arbitrum.io/rpc",
  BASE_RPC: "https://mainnet.base.org",
  BERACHAIN_RPC: "https://artio.rpc.berachain.com",
  BSC_RPC: "https://bsc-dataseed.binance.org",
  SONIC_RPC: "https://rpc.soniclabs.com",
  ETH_RPC: "https://eth.llamarpc.com",
  HYPE_RPC: "https://rpc.hyperliquid.xyz",
  POLYGON_RPC: "https://polygon-rpc.com",
  OPTIMISM_RPC: "https://mainnet.optimism.io",
  UNICHAIN_RPC: "https://rpc.unichain.org",
  SEI_RPC: "https://evm-rpc.sei-apis.com",
  AVAX_RPC: "https://api.avax.network/ext/bc/C/rpc",
  GNOSIS_RPC: "https://rpc.gnosischain.com",
  SCROLL_RPC: "https://rpc.scroll.io",
  KATANA_RPC: "https://rpc.katana.roninchain.com",
  APECHAIN_RPC: "https://rpc.apechain.io",
  WORLDCHAIN_RPC: "https://worldchain-rpc.com"
}

export default defineConfig({
  plugins: [
    react(),
    // Plugin to serve index-dist.html when USE_DIST is set
    useDist ? {
      name: 'use-dist-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            req.url = '/index-dist.html'
          }
          next()
        })
      },
    } : null,
  ].filter(Boolean),
  define: {
    // Define environment variables for Vite
    ...Object.fromEntries(
      Object.entries(envConfig).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value)
      ])
    ),
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
    // Allow importing from dist folder when using dist-based dev
    ...(useDist ? {
      dedupe: ['react', 'react-dom'], // Ensure React is not duplicated
    } : {}),
  },
  css: {
    // Use dev PostCSS config (unscoped) for dev pages
    postcss: './postcss.config.dev.js',
  },
  server: {
    port: 3001,
    open: true,
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    host: '0.0.0.0',
  },
  build: {
    // For development, we don't need to build
    // This config is mainly for the dev server
    outDir: 'dist-vite',
    sourcemap: true,
    // Production build configuration
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', 'viem', '@wagmi/core'],
          rainbowkit: ['@rainbow-me/rainbowkit'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  optimizeDeps: {
    // Include React and React-DOM for development
    include: [
      'react',
      'react-dom',
      'eventemitter3',
      '@rainbow-me/rainbowkit',
      '@tanstack/react-query',
      'wagmi',
      'viem',
    ],
    // Force pre-bundling of problematic modules
    force: true,
  },
  // Handle CommonJS modules
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
})
