# Haiku Swap Widget Demo App

This is a demo application for testing the Haiku Swap Widget locally during development.

## Features

- **Wallet Connection**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more via RainbowKit
- **Multi-Chain Support**: Test the widget across 18+ supported networks
- **Real Widget Integration**: Uses the actual `@haiku-trade/widget` package from the workspace
- **Local Development**: Perfect for testing widget functionality before publishing to npm

## Getting Started

1. **Install dependencies** (from root directory):
   ```bash
   pnpm install
   ```

2. **Build the widget** (from root directory):
   ```bash
   pnpm build:widget
   ```

3. **Start the demo app** (from root directory):
   ```bash
   pnpm dev
   ```

4. **Open your browser** to `http://localhost:3000`

## Supported Networks

- Ethereum (1)
- Optimism (10)
- BNB Smart Chain (56)
- Gnosis (100)
- Polygon (137)
- Arbitrum (42161)
- Avalanche (43114)
- Base (8453)
- Scroll (534352)

## Development

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Wallet Connection**: RainbowKit + wagmi
- **Widget**: Local `@haiku-trade/widget` package

## Notes

- This app imports the widget directly from the workspace, simulating how developers will use it after npm installation
- All wallet connections and blockchain interactions are fully functional
- Perfect for testing widget behavior across different networks and wallet providers
