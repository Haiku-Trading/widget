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
| `theme` | `WidgetTheme` | `{}` | Theme configuration object |

### Theme Configuration

The widget supports custom theming through the `theme` prop:

```tsx
import { HaikuWidget, WidgetTheme } from '@haiku/swap-widget'

const theme: WidgetTheme = {
  mode: 'light', // 'light' | 'dark' | 'auto'
  primaryColor: '#3B82F6', // Hex color for primary elements
  secondaryColor: '#10B981' // Hex color for secondary elements
}

function App() {
  return <HaikuWidget theme={theme} />
}
```

#### Theme Properties

- **`mode`**: Controls the color scheme
  - `'light'`: Forces light mode
  - `'dark'`: Forces dark mode  
  - `'auto'`: Uses system preference (default)
- **`primaryColor`**: Hex color for primary elements (buttons, links, etc.)
- **`secondaryColor`**: Hex color for secondary elements

#### Theme Examples

```tsx
// Brand colors
const brandTheme: WidgetTheme = {
  primaryColor: '#FF6B6B', // Your brand red
  secondaryColor: '#4ECDC4' // Your brand teal
}

// Dark mode
const darkTheme: WidgetTheme = {
  mode: 'dark',
  primaryColor: '#8B5CF6', // Purple
  secondaryColor: '#F59E0B' // Amber
}

// Auto mode (follows system preference)
const autoTheme: WidgetTheme = {
  mode: 'auto',
  primaryColor: '#EF4444' // Red
}
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
