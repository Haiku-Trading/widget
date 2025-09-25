import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment configuration
const isDev = process.env.NODE_ENV === 'development'
const envFile = isDev ? 'env.development.json' : 'env.production.json'
const envPath = join(__dirname, envFile)
const envConfig = JSON.parse(readFileSync(envPath, 'utf8'))

export default defineConfig({
  plugins: [react()],
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
  },
  css: {
    postcss: './postcss.config.js',
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
