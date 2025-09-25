# Haiku Swap Widget

A powerful, customizable swap widget for DeFi applications that allows users to easily integrate Haiku's swap functionality into their websites. The widget is a self-contained React component with built-in HTTP client and session management.

## Features

- 🚀 **Easy Integration** - Simple React component that works with any React application
- 🎨 **Fully Customizable** - Theme support with light/dark modes and custom colors
- 🔗 **Multi-Chain Support** - Works with Ethereum, Berachain, and 13+ supported networks
- 💰 **Smart Routing** - Advanced swap routing for optimal prices and gas efficiency
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Secure** - Built with security best practices and wallet integration
- ⚡ **Self-Contained** - Includes HTTP client and session management
- 🎛️ **Flexible Configuration** - Control chains, protocols, and token preselection

## Installation

```bash
npm install @haiku-trade/widget
# or
yarn add @haiku-trade/widget
# or
pnpm add @haiku-trade/widget
```

## Quick Start

### Basic Usage

```tsx
import { HaikuWidget } from '@haiku-trade/widget';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base } from 'wagmi/chains';

// Create your Wagmi configuration
const wagmiConfig = getDefaultConfig({
  appName: "My DeFi App",
  projectId: "your-walletconnect-project-id", // Get from https://cloud.walletconnect.com
  chains: [mainnet, arbitrum, base],
});

// Create your query client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div>
            <h1>My DeFi App</h1>
            <HaikuWidget />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Advanced Configuration

```tsx
import { HaikuWidget, WidgetConfig } from '@haiku-trade/widget';

function App() {
  const config: WidgetConfig = {
    theme: {
      mode: 'dark',
      light: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
      },
      dark: {
        primaryColor: '#60A5FA',
        secondaryColor: '#A78BFA',
      },
    },
    hiddenChains: [56, 137], // Hide BSC and Polygon
    hiddenProtocols: ['SUSHISWAP', 'CURVE'],
    multiInput: true,
    multiOutput: true,
    lockedInputs: false,
    lockedOutputs: false,
    preselectedInputs: {
      'uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 1.0, // 1 ETH
    },
    preselectedOutputs: {
      'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 0.5, // 50% USDC
      'base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 0.5, // 50% ETH
    },
  };

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HaikuWidget config={config} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Configuration Options

### WidgetConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `WidgetTheme` | `undefined` | Theme configuration with light/dark modes |
| `hiddenChains` | `number[]` | `undefined` | Array of chain IDs to hide from selection |
| `hiddenProtocols` | `string[]` | `undefined` | Array of protocol names to hide |
| `multiInput` | `boolean` | `true` | Allow multiple input tokens |
| `multiOutput` | `boolean` | `true` | Allow multiple output tokens |
| `lockedInputs` | `boolean` | `false` | Lock input tokens from being changed |
| `lockedOutputs` | `boolean` | `false` | Lock output tokens from being changed |
| `preselectedInputs` | `Record<string, number>` | `undefined` | Pre-selected input tokens with amounts |
| `preselectedOutputs` | `Record<string, number>` | `undefined` | Pre-selected output tokens with weights |

### WidgetTheme

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `'light' \| 'dark' \| 'auto'` | Theme mode preference |
| `light` | `ColorPalette` | Color palette for light mode |
| `dark` | `ColorPalette` | Color palette for dark mode |

### ColorPalette

| Property | Type | Description |
|----------|------|-------------|
| `primaryColor` | `string` | Primary brand color (hex, rgb, or css color) |
| `secondaryColor` | `string` | Secondary brand color |
| `accentColor` | `string` | Accent color for highlights |
| `successColor` | `string` | Success state color |
| `warningColor` | `string` | Warning state color |
| `errorColor` | `string` | Error state color |

## Supported Chains

The widget supports the following blockchain networks:

- **Ethereum** (Chain ID: 1)
- **Optimism** (Chain ID: 10)
- **BSC** (Chain ID: 56)
- **Gnosis** (Chain ID: 100)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Avalanche** (Chain ID: 43114)
- **Base** (Chain ID: 8453)
- **Scroll** (Chain ID: 534352)
- **Berachain** (Chain ID: 80094)
- **Sei** (Chain ID: 1329)
- **Worldchain** (Chain ID: 480)
- **Katana** (Chain ID: 747474)

## Wallet Integration

The widget automatically integrates with popular Web3 wallets:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- And more...

## API Integration

The widget includes a built-in HTTP client that communicates with Haiku's swap infrastructure to:

- Fetch token lists and balances
- Get real-time swap quotes
- Execute swaps with optimal routing
- Track transaction status

## Examples

### Light Theme with Custom Colors

```tsx
<HaikuWidget 
  config={{
    theme: {
      mode: 'light',
      light: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#34d399',
      },
    },
  }}
/>
```

### Chain-Restricted Configuration

```tsx
<HaikuWidget 
  config={{
    hiddenChains: [1, 137, 42161], // Hide Ethereum, Polygon, Arbitrum
    hiddenProtocols: ['SUSHISWAP', 'CURVE'],
    multiInput: false, // Single input only
    multiOutput: true,
  }}
/>
```

### Preselected Tokens

```tsx
<HaikuWidget 
  config={{
    preselectedInputs: {
      'base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 1.0, // 1 ETH on Base
    },
    preselectedOutputs: {
      'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 0.6, // 60% USDC
      'base:0x4200000000000000000000000000000000000006': 0.4, // 40% WETH
    },
    lockedInputs: true, // Prevent changing input tokens
  }}
/>
```

### Auto Theme with Custom Dark Colors

```tsx
<HaikuWidget 
  config={{
    theme: {
      mode: 'auto', // Follows system preference
      dark: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#a78bfa',
        accentColor: '#c4b5fd',
      },
    },
  }}
/>
```

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

```bash
git clone https://github.com/haiku/swap-widget.git
cd swap-widget
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

### Playground

The widget includes a development playground for testing configurations:

```bash
npm run dev:vite
```

This starts a development server with an interactive playground where you can:
- Test different theme configurations
- Experiment with chain and protocol restrictions
- Try preselected tokens
- Copy generated configurations

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## What's Included

The widget is self-contained and includes:

- **Trading Interface**: Complete swap interface with token selection
- **HTTP Client**: Built-in API client for Haiku's swap infrastructure
- **Session Management**: Internal session and trade state management
- **Multi-chain Support**: Works with any chains configured in your Wagmi setup
- **Wallet Integration**: Uses your existing Wagmi/RainbowKit setup
- **Theme System**: Light/dark mode support with custom color palettes

## What You Need to Provide

- **Wagmi Provider**: For wallet connection and blockchain interactions
- **QueryClient Provider**: For data fetching and caching
- **RainbowKit Provider**: For wallet connection UI (optional but recommended)

## Support

- 📧 **Email**: support@haiku.trade
- 💬 **Discord**: [Join our Discord](https://discord.gg/haiku)
- 📖 **Documentation**: [docs.haiku.trade](https://docs.haiku.trade)
- 🐛 **Issues**: [GitHub Issues](https://github.com/haiku/swap-widget/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Built with ❤️ by the Haiku team

