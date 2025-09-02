# Haiku Swap Widget

A powerful, customizable swap widget for DeFi applications that allows users to easily integrate Haiku's swap functionality into their websites.

## Features

- 🚀 **Easy Integration** - Simple React component that works with any React application
- 🎨 **Fully Customizable** - Theme support with custom colors, fonts, and styling
- 🔗 **Multi-Chain Support** - Works with Ethereum, Berachain, and other supported networks
- 💰 **Smart Routing** - Advanced swap routing for optimal prices and gas efficiency
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Secure** - Built with security best practices and wallet integration
- ⚡ **Lightweight** - Minimal bundle size with tree-shaking support

## Installation

```bash
npm install @haiku/swap-widget
# or
yarn add @haiku/swap-widget
# or
pnpm add @haiku/swap-widget
```

## Quick Start

### Basic Usage

```tsx
import { SwapWidget } from '@haiku/swap-widget';

function App() {
  return (
    <div>
      <h1>My DeFi App</h1>
      <SwapWidget 
        apiKey="your-api-key-here"
        onSwapComplete={(tx) => console.log('Swap completed:', tx)}
      />
    </div>
  );
}
```

### Advanced Configuration

```tsx
import { SwapWidget } from '@haiku/swap-widget';

function App() {
  return (
    <SwapWidget 
      apiKey="your-api-key-here"
      theme={{
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif',
      }}
      supportedChains={[1, 137, 1329]} // Ethereum, Polygon, Berachain
      defaultTokens={[
        { iid: 'eth:1', symbol: 'ETH', name: 'Ethereum', decimals: 18, network: 1, type: 'Native' },
        { iid: 'usdc:1', symbol: 'USDC', name: 'USD Coin', decimals: 6, network: 1, type: 'ERC20' }
      ]}
      slippageTolerance={0.5}
      displayMode="full"
      onSwapComplete={(tx) => console.log('Swap completed:', tx)}
      onQuoteUpdate={(quote) => console.log('Quote updated:', quote)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

## Configuration Options

### WidgetConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiKey` | `string` | **Required** | Your Haiku API key for authentication |
| `theme` | `ThemeConfig` | `undefined` | Custom theme configuration |
| `supportedChains` | `number[]` | `undefined` | Array of supported chain IDs |
| `defaultTokens` | `Token[]` | `undefined` | Pre-selected tokens for input/output |
| `slippageTolerance` | `number` | `0.5` | Default slippage tolerance in percentage |
| `displayMode` | `'compact' \| 'full' \| 'drawer'` | `'full'` | Widget display mode |
| `onSwapComplete` | `function` | `undefined` | Callback when swap is completed |
| `onQuoteUpdate` | `function` | `undefined` | Callback when quote is updated |
| `onError` | `function` | `undefined` | Callback when errors occur |

### ThemeConfig

| Property | Type | Description |
|----------|------|-------------|
| `primaryColor` | `string` | Primary brand color (hex, rgb, or css color) |
| `secondaryColor` | `string` | Secondary brand color |
| `backgroundColor` | `string` | Widget background color |
| `textColor` | `string` | Primary text color |
| `borderRadius` | `string` | Border radius for rounded corners |
| `fontFamily` | `string` | Custom font family |
| `customCSS` | `string` | Additional custom CSS rules |

## Supported Chains

The widget supports the following blockchain networks:

- **Ethereum** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Base** (Chain ID: 8453)
- **BSC** (Chain ID: 56)
- **Berachain** (Chain ID: 1329)
- **Berachain Testnet** (Chain ID: 747474)

## Wallet Integration

The widget automatically integrates with popular Web3 wallets:

- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- And more...

## API Integration

The widget communicates with Haiku's swap infrastructure to:

- Fetch token lists and balances
- Get real-time swap quotes
- Execute swaps with optimal routing
- Track transaction status

## Examples

### Compact Mode

```tsx
<SwapWidget 
  apiKey="your-api-key"
  displayMode="compact"
  className="max-w-sm"
/>
```

### Custom Styling

```tsx
<SwapWidget 
  apiKey="your-api-key"
  theme={{
    primaryColor: '#10b981',
    borderRadius: '20px',
    customCSS: `
      .haiku-swap-widget {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
    `
  }}
/>
```

### Chain-Restricted

```tsx
<SwapWidget 
  apiKey="your-api-key"
  supportedChains={[1329]} // Berachain only
  defaultTokens={[
    // Berachain tokens
  ]}
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

### Linting

```bash
npm run lint
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

- 📧 **Email**: support@haiku.fi
- 💬 **Discord**: [Join our Discord](https://discord.gg/haiku)
- 📖 **Documentation**: [docs.haiku.fi](https://docs.haiku.fi)
- 🐛 **Issues**: [GitHub Issues](https://github.com/haiku/swap-widget/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

Built with ❤️ by the Haiku team

