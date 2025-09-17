# Widget Development Setup

This document explains how to use the new Vite development server for faster widget development.

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   cd widget
   pnpm install
   ```

2. **Start the Vite development server**:
   ```bash
   pnpm dev:vite
   ```

3. **Open your browser** to `http://localhost:3001`

## What You Get

- ⚡ **Hot Module Replacement (HMR)** - Changes appear instantly without page refresh
- 🚀 **Fast rebuilds** - Vite is much faster than Rollup for development
- 🗺️ **Source maps** - Easy debugging in browser dev tools
- 🎨 **Multiple theme examples** - Test different themes side by side
- 🔗 **Wallet connection** - Full widget functionality with RainbowKit

## Development Workflow

1. Make changes to any widget component in `src/components/`
2. Save the file
3. See changes instantly in the browser (no rebuild needed!)
4. Test with different themes and wallet connections

## Available Scripts

- `pnpm dev:vite` - Start Vite development server with HMR
- `pnpm dev` - Start Rollup in watch mode (slower, for production builds)
- `pnpm build` - Build production bundle with Rollup
- `pnpm build:dev` - Build development bundle with Rollup

## File Structure

- `index.html` - Development HTML file
- `vite.config.ts` - Vite configuration
- `src/dev-main.tsx` - Development entry point with providers
- `src/index.ts` - Main widget export (used by demo app)

## Environment Variables

The development server automatically loads environment variables from `env.development.json`. These are injected at build time for the Vite dev server.

## Tips

- Use browser dev tools to inspect components and styles
- The development server runs on port 3001 to avoid conflicts with the demo app (port 5173)
- All theme examples are loaded so you can test styling changes across different themes
- Wallet connection is ready - just click "Connect Wallet" to test full functionality
