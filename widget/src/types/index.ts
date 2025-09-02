export interface Token {
  iid: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  primaryColor?: string;
  network: number;
  type: TokenType;
  address?: string;
  chainId?: number;
}

export enum TokenType {
  Collateral = 'Collateral',
  VarDebt = 'VarDebt',
  StableDebt = 'StableDebt',
  Reward = 'Reward',
  Native = 'Native',
  ERC20 = 'ERC20',
}

export interface SwapQuote {
  inputTokens: Token[];
  outputTokens: Token[];
  inputAmounts: Record<string, string>;
  outputAmounts: Record<string, string>;
  usdInputTotal: string;
  usdOutputTotal: string;
  slippage: number;
  gasEstimate?: string;
  route?: string;
}

export interface SwapTransaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  inputTokens: Token[];
  outputTokens: Token[];
  inputAmounts: Record<string, string>;
  outputAmounts: Record<string, string>;
  timestamp: number;
  blockNumber?: number;
}

export interface WidgetConfig {
  apiKey: string;
  theme?: ThemeConfig;
  supportedChains?: number[];
  defaultTokens?: Token[];
  slippageTolerance?: number;
  displayMode?: 'compact' | 'full' | 'drawer';
  onSwapComplete?: (tx: SwapTransaction) => void;
  onQuoteUpdate?: (quote: SwapQuote) => void;
  onError?: (error: Error) => void;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  customCSS?: string;
}

export interface SwapState {
  inputTokens: Token[];
  outputTokens: Token[];
  inputAmounts: Record<string, string>;
  outputAmounts: Record<string, string>;
  slippage: number;
  isLoading: boolean;
  error?: string;
  quote?: SwapQuote;
}

export interface WalletState {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  balance?: string;
}
