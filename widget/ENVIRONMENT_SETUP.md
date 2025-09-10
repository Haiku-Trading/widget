# Environment Configuration

This widget uses build-time environment variable replacement to handle different configurations for development and production environments.

## Setup

1. **Copy the template files:**
   ```bash
   cp env.development.json.template env.development.json
   cp env.production.json.template env.production.json
   ```

2. **Update the configuration files** with your specific values:
   - `env.development.json` - Development environment settings
   - `env.production.json` - Production environment settings

## Environment Variables

### Required Variables

- `API_BASE_URL` - Base URL for the API
- `VERCEL_ENV` - Environment identifier ("development" or "production")

### Feature Flags

- `TURN_OFF_EIP7702` - Enable/disable EIP-7702 functionality ("true" or "false")

### RPC URLs

All RPC URLs are optional and will fall back to default public endpoints if not specified:

- `ARB_RPC` - Arbitrum RPC URL
- `BASE_RPC` - Base RPC URL
- `BERACHAIN_RPC` - Berachain RPC URL
- `BSC_RPC` - BSC RPC URL
- `SONIC_RPC` - Sonic RPC URL
- `ETH_RPC` - Ethereum RPC URL
- `HYPE_RPC` - HyperEVM RPC URL
- `POLYGON_RPC` - Polygon RPC URL
- `OPTIMISM_RPC` - Optimism RPC URL
- `UNICHAIN_RPC` - Unichain RPC URL
- `SEI_RPC` - Sei EVM RPC URL
- `AVAX_RPC` - Avalanche RPC URL
- `GNOSIS_RPC` - Gnosis RPC URL
- `SCROLL_RPC` - Scroll RPC URL
- `KATANA_RPC` - Katana RPC URL
- `APECHAIN_RPC` - Apechain RPC URL
- `WORLDCHAIN_RPC` - Worldchain RPC URL

## Build Commands

- `pnpm run build:dev` - Build with development environment variables
- `pnpm run build` - Build with production environment variables
- `pnpm run dev` - Development build with watch mode

## Security Notes

- The actual environment JSON files (`env.development.json`, `env.production.json`) are gitignored
- Only the template files (`.template`) are committed to the repository
- Never commit sensitive API keys or private RPC URLs to the repository
