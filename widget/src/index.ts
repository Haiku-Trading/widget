// Main widget component
export { SwapWidget } from './components/SwapWidget';

// Individual components for advanced usage
export { TokenSelector } from './components/TokenSelector';
export { SwapButton } from './components/SwapButton';

// Providers
export { SwapWidgetProvider, useSwapWidget } from './providers/SwapWidgetProvider';

// Types
export type {
  Token,
  TokenType,
  SwapQuote,
  SwapTransaction,
  WidgetConfig,
  ThemeConfig,
  SwapState,
  WalletState,
} from './types';

// Utilities
export {
  cn,
  formatNumber,
  formatUSD,
  validateAmount,
  calculateSlippage,
  shortenAddress,
  getChainName,
  debounce,
} from './utils';
