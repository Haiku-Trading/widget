# Haiku Swap Widget

A standalone, embeddable trading interface widget that can be integrated into any website or application.

## Features

- **Wallet Integration**: Built-in support for multiple wallets via RainbowKit
- **Multi-Chain Support**: Supports Ethereum, Polygon, Arbitrum, Optimism, Base, and Sepolia
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Customizable**: Configurable themes, colors, and supported chains
- **Self-Contained**: All dependencies bundled, no external requirements

## Installation

```bash
npm install @haiku/swap-widget
# or
yarn add @haiku/swap-widget
# or
pnpm add @haiku/swap-widget
```

## Quick Start

```tsx
import { HaikuSwapWidget } from '@haiku/swap-widget';

function App() {
  return (
    <HaikuSwapWidget 
      apiKey="your-api-key-here"
      theme="light"
      defaultChainId={1}
    />
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
- **11155111** - Sepolia Testnet

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
