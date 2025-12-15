# Haiku Swap Widget

A powerful, self-contained swap widget for DeFi applications that allows users to easily integrate Haiku's swap functionality into their websites. The widget includes built-in HTTP client and session management.

## Features

- 🚀 **Easy Integration** - Simple React component that works with any React application
- 🎨 **Fully Customizable** - Theme support with light/dark modes and custom colors
- 🔗 **Multi-Chain Support** - Works with 13+ supported networks including Ethereum, Berachain, and more
- 💰 **Smart Routing** - Advanced swap routing for optimal prices and gas efficiency
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Secure** - Built with security best practices and wallet integration
- ⚡ **Self-Contained** - Includes HTTP client and session management
- 🎛️ **Flexible Configuration** - Control chains, protocols, and token preselection

## Requirements

The widget requires the following providers to be set up in your host application:

- **WagmiProvider**: For wallet connection and blockchain interactions
- **QueryClientProvider**: For React Query state management
- **RainbowKitProvider**: For wallet connection UI (optional but recommended)

The widget will use your existing wallet connection and share the same state with your application.

## Installation

```bash
npm install @haiku-trade/widget
# or
yarn add @haiku-trade/widget
# or
pnpm add @haiku-trade/widget
```

## Peer Dependencies

The widget requires the following peer dependencies to be installed in your project:

### Required Dependencies

```bash
npm install react@>=18.0.0 react-dom@>=18.0.0 wagmi@>=2.0.0 @tanstack/react-query@>=5.0.0
```

### Optional Dependencies (Recommended)

For the best experience, we also recommend installing RainbowKit for wallet connection UI:

```bash
npm install @rainbow-me/rainbowkit@>=2.0.0
```

### Complete Installation

Here's the complete installation command for a new project:

```bash
# Install the widget and all required dependencies
npm install @haiku-trade/widget react@>=18.0.0 react-dom@>=18.0.0 wagmi@>=2.0.0 @tanstack/react-query@>=5.0.0 @rainbow-me/rainbowkit@>=2.0.0

# Or with yarn
yarn add @haiku-trade/widget react@>=18.0.0 react-dom@>=18.0.0 wagmi@>=2.0.0 @tanstack/react-query@>=5.0.0 @rainbow-me/rainbowkit@>=2.0.0

# Or with pnpm
pnpm add @haiku-trade/widget react@>=18.0.0 react-dom@>=18.0.0 wagmi@>=2.0.0 @tanstack/react-query@>=5.0.0 @rainbow-me/rainbowkit@>=2.0.0
```

### Quick Setup for Different Project Types

#### New React Project (Create React App, Vite, Next.js)
```bash
# Create a new project
npx create-react-app my-defi-app
# or
npm create vite@latest my-defi-app -- --template react-ts
# or
npx create-next-app@latest my-defi-app

# Install the widget and dependencies
npm install @haiku-trade/widget wagmi@^2.0.0 @tanstack/react-query@^5.0.0 @rainbow-me/rainbowkit@^2.0.0
```

#### Existing React Project
```bash
# Check if you already have the required dependencies
npm list react wagmi @tanstack/react-query

# Install missing dependencies
npm install wagmi@^2.0.0 @tanstack/react-query@^5.0.0 @rainbow-me/rainbowkit@^2.0.0

# Install the widget
npm install @haiku-trade/widget
```

#### TypeScript Project
Make sure you have TypeScript types installed:
```bash
npm install --save-dev @types/react @types/react-dom
```

## Quick Start

The Haiku Swap Widget requires WagmiProvider and QueryClientProvider from the host application. Here's how to set it up:

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
          <HaikuWidget />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Configuration Options

The widget accepts a `config` prop with the following options:

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

### Theme Configuration

The widget supports custom theming through the `theme` prop:

```tsx
import { HaikuWidget, WidgetConfig } from '@haiku-trade/widget'

const config: WidgetConfig = {
  theme: {
    mode: 'dark', // 'light' | 'dark' | 'auto'
    light: {
      primaryColor: '#3B82F6', // Hex color for primary elements
      secondaryColor: '#10B981' // Hex color for secondary elements
    },
    dark: {
      primaryColor: '#60A5FA', // Hex color for primary elements in dark mode
      secondaryColor: '#34D399' // Hex color for secondary elements in dark mode
    }
  }
}

function App() {
  return <HaikuWidget config={config} />
}
```

#### Theme Properties

- **`mode`**: Controls the color scheme
  - `'light'`: Forces light mode
  - `'dark'`: Forces dark mode  
  - `'auto'`: Uses system preference (default)
- **`light`**: Color palette for light mode
- **`dark`**: Color palette for dark mode

#### Color Palette Properties

- **`primaryColor`**: Hex color for primary elements (buttons, links, etc.)
- **`secondaryColor`**: Hex color for secondary elements
- **`accentColor`**: Hex color for accent elements
- **`successColor`**: Hex color for success states
- **`warningColor`**: Hex color for warning states
- **`errorColor`**: Hex color for error states

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

## Examples

### Basic Usage with Configuration

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
  };

  return <HaikuWidget config={config} />;
}
```

### Preselected Tokens

```tsx
import { HaikuWidget, WidgetConfig } from '@haiku-trade/widget';

function App() {
  const config: WidgetConfig = {
    preselectedInputs: {
      'base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 1.0, // 1 ETH on Base
    },
    preselectedOutputs: {
      'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 0.6, // 60% USDC
      'base:0x4200000000000000000000000000000000000006': 0.4, // 40% WETH
    },
    lockedInputs: true, // Prevent changing input tokens
  };

  return <HaikuWidget config={config} />;
}
```

### Chain-Restricted Configuration

```tsx
import { HaikuWidget, WidgetConfig } from '@haiku-trade/widget';

function App() {
  const config: WidgetConfig = {
    hiddenChains: [1, 137, 42161], // Hide Ethereum, Polygon, Arbitrum
    hiddenProtocols: ['SUSHISWAP', 'CURVE'],
    multiInput: false, // Single input only
    multiOutput: true,
  };

  return <HaikuWidget config={config} />;
}
```

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

## Development

Run hot-reloading locally from source:
`pnpm run dev:vite`

Run hot-reloading locally from compiled dist folder:
`pnpm run dev`
`pnpm run dev:dist`


### Project Structure

```
src/
├── components/          # React components
├── providers/          # Context providers
├── stores/             # State management
├── hooks/              # Custom hooks
├── services/           # API services
├── types/              # TypeScript types
├── utils/              # Utility functions
└── styles.css          # Global styles
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+



## Support

For support and questions, please contact the Haiku team or open an issue in this repository.
