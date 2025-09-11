# Haiku Swap Widget

A standalone, embeddable trading interface widget that can be integrated into any website or application.

## Features

- **Wallet Integration**: Built-in support for multiple wallets via RainbowKit
- **Multi-Chain Support**: Supports Ethereum, Polygon, Arbitrum, Optimism, Base, ...
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Customizable**: Configurable themes, colors, and supported chains
- **Host Integration**: Designed to work with your existing WagmiProvider and QueryClientProvider

## Requirements

The widget requires the following providers to be set up in your host application:

- **WagmiProvider**: For wallet connection and blockchain interactions
- **QueryClientProvider**: For React Query state management

The widget will use your existing wallet connection and share the same state with your application.

## Installation

```bash
npm install @haiku/swap-widget
# or
yarn add @haiku/swap-widget
# or
pnpm add @haiku/swap-widget
```

## Quick Start

The Haiku Swap Widget requires WagmiProvider and QueryClientProvider from the host application. Here's how to set it up:

```tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HaikuWidget } from '@haiku/swap-widget'
import { config } from './wagmi-config' // Your wagmi configuration

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HaikuWidget />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **Required** | Your Haiku API key |
| `baseUrl` | `string` | `https://api.haiku.trade/v1` | Custom API base URL |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Widget theme |
| `defaultChainId` | `number` | `1` (Ethereum) | Default selected chain |
| `supportedChains` | `number[]` | `[1, 137, 42161, 10, 8453]` | Supported chain IDs |
| `customStyles` | `object` | `{}` | Custom styling options |

### Custom Styles

```tsx
<HaikuSwapWidget 
  apiKey="your-api-key"
  customStyles={{
    primaryColor: '#3B82F6',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif'
  }}
/>
```

## Supported Chains

- **1** - Ethereum Mainnet
- **137** - Polygon
- **42161** - Arbitrum One
- **10** - Optimism
- **8453** - Base

## Advanced Usage

### Custom Provider Setup

If you need more control over the configuration, you can use the provider directly:

```tsx
import { HaikuProvider } from '@haiku/swap-widget';

function App() {
  const config = {
    apiKey: 'your-api-key',
    baseUrl: 'https://custom-api.haiku.trade/v1',
    theme: 'dark',
    supportedChains: [1, 137, 42161]
  };

  return (
    <HaikuProvider config={config}>
      {/* Your custom components */}
    </HaikuProvider>
  );
}
```

### Styling

The widget uses Tailwind CSS classes and CSS custom properties for theming. You can override styles by targeting the widget's CSS classes or by using the `customStyles` prop.

## Development

### Building the Widget

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with watch
npm run dev

# Type checking
npm run type-check
```

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

## License

MIT

## Support

For support and questions, please contact the Haiku team or open an issue in this repository.
