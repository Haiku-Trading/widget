# Widget Configuration

The Haiku Swap Widget now supports advanced configuration options to customize the available chains and protocols.

## Configuration Interface

```typescript
interface WidgetConfig {
  theme?: WidgetTheme
  hiddenChains?: number[]      // Array of chain IDs to hide
  hiddenProtocols?: string[]   // Array of protocol symbols to hide
}
```

## Usage Examples

### Basic Configuration

```tsx
import { HaikuWidget, WidgetConfig } from '@haiku/swap-widget'

const config: WidgetConfig = {
  theme: {
    mode: 'dark',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  },
  hiddenChains: [1, 10],           // Hide Ethereum and Optimism
  hiddenProtocols: ['AAVE_V3']     // Hide Aave V3 protocol
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HaikuWidget config={config} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Available Chain IDs

Common chain IDs you can hide:
- `1` - Ethereum
- `10` - Optimism  
- `56` - BNB Smart Chain
- `100` - Gnosis
- `137` - Polygon
- `42161` - Arbitrum
- `43114` - Avalanche
- `8453` - Base
- `534352` - Scroll
- `80094` - Berachain
- `1329` - Sei
- `480` - Worldchain
- `747474` - Katana

### Available Protocol Symbols

Common protocol symbols you can hide:
- `AAVE_V3` - Aave V3
- `BALANCER_V2` - Balancer V2
- `BERAHUB` - BeraHub
- `BEX` - Bex
- `BERABORROW` - BeraBorrow
- `BERAPAW` - BeraPaw
- `INFRARED` - Infrared
- `KODIAK_ISLAND` - Kodiak Island
- `KODIAK_BAULTS` - Kodiak Baults
- `CURVE` - Curve
- `UNISWAP_V2` - Uniswap V2
- `MORPHO` - Morpho
- `HYPURRFI` - Hypurrfi
- `HYPERLEND` - HyperLend
- `PENDLE` - Pendle
- `YEI` - Yei
- `DRAGONSWAP_V2` - Dragonswap V2
- `HYPERSWAP_V2` - Hyperswap V2

## Backward Compatibility

The widget maintains full backward compatibility. You can still use the old `theme` prop:

```tsx
// Old way (still works)
<HaikuWidget theme={myTheme} />

// New way (recommended)
<HaikuWidget config={{ theme: myTheme }} />
```

## Implementation Details

- **Chain Filtering**: Hidden chains are filtered from both the chain selector dropdown and token lists
- **Protocol Filtering**: Hidden protocols are filtered from both the protocol selector dropdown and token lists  
- **Token Filtering**: Tokens from hidden chains/protocols are automatically excluded from the token selection dialog
- **Performance**: Filtering is applied early in the data pipeline for optimal performance
- **Caching**: Filtered results are cached to avoid unnecessary re-computations

## Migration Guide

If you're currently using the `theme` prop, you can migrate to the new `config` prop:

```tsx
// Before
<HaikuWidget theme={myTheme} />

// After  
<HaikuWidget config={{ theme: myTheme }} />
```

The new configuration system is fully backward compatible, so you can migrate at your own pace.
