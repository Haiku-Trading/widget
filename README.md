# Haiku Swap Widget

A self-contained swap widget for DeFi applications. Integrate [Haiku's](https://haiku.trade/) multi-chain multi-token declarative transaction functionality into your website with a single React component.

Just specify inputs and outputs and the Haiku widget does the rest.

## Installation

1. Install peer dependencies
```bash
npm install react react-dom wagmi viem @wagmi/core @tanstack/react-query
```

2. Install Haiku widget
```bash
npm install @haiku-trade/widget
```

3. Optionally, install RainbowKit for wallet connection UI:

```bash
npm install @rainbow-me/rainbowkit
```

## Provider Requirements

The widget must be rendered inside the following providers from your host application:

| Provider | Package | Required | Purpose |
|----------|---------|----------|---------|
| `WagmiProvider` | `wagmi` | Yes | The widget uses your app's existing wallet connection to sign transactions and read on-chain data. It does not create its own wallet connection. |
| `QueryClientProvider` | `@tanstack/react-query` | Yes | The widget uses your app's query client for data fetching, caching, and state management. |
| `RainbowKitProvider` | `@rainbow-me/rainbowkit` | No (recommended) | Provides wallet connection UI. You can use any wallet connection solution compatible with Wagmi. |

The widget shares wallet and query state with your application -- if a user is already connected in your app, the widget will use that same connection.

## Quick Start

```tsx
import { HaikuWidget } from '@haiku-trade/widget';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base } from 'wagmi/chains';

const wagmiConfig = getDefaultConfig({
  appName: "My DeFi App",
  projectId: "your-walletconnect-project-id", // Get from https://cloud.walletconnect.com
  chains: [mainnet, arbitrum, base],
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HaikuWidget widgetKey="your-widget-key" />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `widgetKey` | `string` | Yes | Your Haiku widget API key |
| `config` | `WidgetConfig` | No | Widget configuration (see below) |

## Configuration

Pass a `config` prop to customize the widget:

```tsx
<HaikuWidget widgetKey="your-widget-key" config={config} />
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | `WidgetTheme` | See below | Theme with light/dark mode support |
| `hiddenChains` | `number[]` | `undefined` | Chain IDs to hide from the UI |
| `hiddenProtocols` | `string[]` | `undefined` | Protocol names to hide |
| `multiInput` | `boolean` | `true` | Allow multiple input tokens |
| `multiOutput` | `boolean` | `true` | Allow multiple output tokens |
| `lockedInputs` | `boolean` | `false` | Prevent users from changing input tokens |
| `lockedOutputs` | `boolean` | `false` | Prevent users from changing output tokens |
| `preselectedInputs` | `Record<string, number>` | `undefined` | Pre-selected input tokens (token IID -> amount) |
| `preselectedOutputs` | `Record<string, number>` | `undefined` | Pre-selected output tokens (token IID -> weight) |
| `tokenSelect` | `'simple' \| 'default'` | `'default'` | Token selector UI style |
| `bridgeMode` | `'open' \| 'fast' \| 'economy'` | `undefined` | Bridge routing preference |

### Theme

```tsx
const config: WidgetConfig = {
  theme: {
    mode: 'dark', // 'light' | 'dark' | 'auto'
    light: {
      primaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      primaryText: '#020817',
      secondaryText: '#666666',
      borderColor: '#e2e8f0',
      mutedBackground: '#f5f5f5',
    },
    dark: {
      primaryColor: '#60A5FA',
      backgroundColor: '#0F172A',
      primaryText: '#f8fafc',
      secondaryText: '#b2bdcc',
      borderColor: '#1d283a',
      mutedBackground: '#1e293b',
    },
  },
};
```

All color palette properties (all optional):

| Property | Description |
|----------|-------------|
| `primaryColor` | Primary elements (buttons, links) |
| `secondaryColor` | Secondary elements |
| `accentColor` | Accent elements |
| `successColor` | Success states |
| `warningColor` | Warning states |
| `errorColor` | Error states |
| `backgroundColor` | Widget background |
| `button` | Button background |
| `paper` | Card/paper background |
| `borderColor` | Borders |
| `mutedBackground` | Muted/subtle backgrounds |
| `primaryText` | Primary text |
| `secondaryText` | Secondary/muted text |
| `swapButton` | Swap button color |
| `iconsHeader` | Header icon color |
| `swapIcon` | Swap direction icon color |

## Examples

### Preselected Tokens

```tsx
const config: WidgetConfig = {
  preselectedInputs: {
    'base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 1.0, // 1 ETH on Base
  },
  preselectedOutputs: {
    'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 0.6, // 60% USDC
    'base:0x4200000000000000000000000000000000000006': 0.4, // 40% WETH
  },
  lockedInputs: true,
};

<HaikuWidget widgetKey="your-widget-key" config={config} />
```

### Restrict to Specific Chains

```tsx
const config: WidgetConfig = {
  hiddenChains: [1, 137, 42161], // Hide Ethereum, Polygon, Arbitrum
  multiInput: false,
};

<HaikuWidget widgetKey="your-widget-key" config={config} />
```

## Supported Chains

| Chain | Chain ID |
|-------|----------|
| Ethereum | 1 |
| Optimism | 10 |
| BSC | 56 |
| Gnosis | 100 |
| Unichain | 130 |
| Polygon | 137 |
| Monad | 143 |
| Sonic | 146 |
| Worldchain | 480 |
| HyperEVM | 999 |
| Lisk | 1135 |
| Sei | 1329 |
| Base | 8453 |
| Plasma | 9745 |
| ApeChain | 33139 |
| Arbitrum | 42161 |
| Avalanche | 43114 |
| Bob | 60808 |
| Berachain | 80094 |
| Scroll | 534352 |
| Katana | 747474 |

## Requirements

- React 18+ or 19+
- Wagmi v2+
- viem v2+
- @tanstack/react-query v5+
- @rainbow-me/rainbowkit v2+ (optional, recommended)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

For questions or issues, please open an issue in this repository.
