import { TokenType } from '../enums/token-type'

export type TokenCategory = 'collateral' | 'varDebt' | 'token' | 'weightedLiquidity' | 'vault' | 'concentratedLiquidity'

type TradeAlert = {
  id: TradeAlertId
  description: string
}

export const categoriesNames: Record<string, string> = {
  token: 'Token',
  collateral: 'Lend',
  varDebt: 'Debt',
  weightedLiquidity: 'Pool',
  vault: 'Vault',
  concentratedLiquidity: 'CLAMM',
}
export const categoriesOrigNames: Record<string, string> = {
  token: 'Tokens',
  collateral: 'Lending',
  varDebt: 'Debts',
  weightedLiquidity: 'Pools',
  vault: 'Vaults',
  concentratedLiquidity: 'CLAMM',
}

export const categoriesNamesByType: Record<TokenType, string> = {
  [TokenType.Token]: 'Token',
  [TokenType.Collateral]: 'Lend',
  [TokenType.VarDebt]: 'Debt',
  [TokenType.WeightedLiquidity]: 'Liquidity',
  [TokenType.Vault]: 'Vault',
  [TokenType.ConcentratedLiquidity]: 'Concentrated',
}

export const categoriesTypesBadge: Record<TokenType, 'success' | 'failed' | 'info' | 'primary'> = {
  [TokenType.Token]: 'info',
  [TokenType.Collateral]: 'success',
  [TokenType.VarDebt]: 'failed',
  [TokenType.WeightedLiquidity]: 'success',
  [TokenType.Vault]: 'success',
  [TokenType.ConcentratedLiquidity]: 'primary',
}

export const tokenBadge: Record<TokenCategory, 'success' | 'failed' | 'info' | 'primary'> = {
  collateral: 'success',
  varDebt: 'failed',
  token: 'info',
  weightedLiquidity: 'primary',
  vault: 'success',
  concentratedLiquidity: 'primary',
}

export enum TradeAlertId {
  RemoveCollateralWithDebt = 'remove-collateral-with-debt',
  AddDebtWithoutCollateral = 'add-debt-without-collateral',
  ExceedSafeBorrowLimit = 'exceed-safe-borrow-limit',
}

const TradeAlerts: TradeAlert[] = [
  {
    id: TradeAlertId.RemoveCollateralWithDebt,
    description:
      'Removing this collateral may impact your Loan-to-Value (LTV) ratio and trigger liquidation. To prevent this, consider repaying your debt first. Please review your positions before proceeding.',
  },
  {
    id: TradeAlertId.AddDebtWithoutCollateral,
    description:
      'Debt positions must be backed by collateral. Please add sufficient collateral to proceed.',
  },
  {
    id: TradeAlertId.ExceedSafeBorrowLimit,
    description:
      'You are attempting to borrow more than your collateral allows, which could lead to liquidation. Adjust your transaction to stay within the safe borrowing limit.',
  },
]

export const getTradeAlertMessage = (id: TradeAlertId): TradeAlert | undefined => {
  return TradeAlerts.find((alert) => alert.id === id)
}

export const mappingChainNameToChainId: Record<string, number> = {
  arb: 42161,
  base: 8453,
  bera: 80094,
  bsc: 56,
  sonic: 146,
  eth: 1,
  poly: 137,
  hype: 999,
  opt: 10,
  uni: 130,
  sei: 1329,
  avax: 43114,
  gnosis: 100,
  scroll: 534352,
  katana: 747474,
  ape: 33139,
  worldchain: 480,
  plasma: 9745,
  bob: 60808,
  lisk: 1135,
  monad: 143
}

export const INVALIDATE_QUERIES_DELAY = 8000

export const baseSlippages = [
  {
    id: 'base-slippage-1',
    value: '0.001',
    label: '0.10%',
  },
  {
    id: 'base-slippage-2',
    value: '0.003',
    label: '0.30%',
  },
  {
    id: 'base-slippage-3',
    value: '0.01',
    label: '1%',
  },
]

export const chainsConfig: {
  [key: number]: {
    chainId: number
    network: string
    slug: string
    dexScreenId?: string
  }
} = {
  42161: {
    chainId: 42161,
    network: 'Arbitrum',
    slug: 'arb',
    dexScreenId: 'arbitrum',
  },
  8453: {
    chainId: 8453,
    network: 'Base',
    slug: 'base',
    dexScreenId: 'base',
  },
  80094: {
    chainId: 80094,
    network: 'Berachain',
    slug: 'bera',
    dexScreenId: 'berachain',
  },
  56: {
    chainId: 56,
    network: 'BSC',
    slug: 'bsc',
    dexScreenId: 'bsc',
  },
  146: {
    chainId: 146,
    network: 'Sonic',
    slug: 'sonic',
    dexScreenId: 'sonic',
  },
  1: {
    chainId: 1,
    network: 'Ethereum',
    slug: 'eth',
    dexScreenId: 'ethereum',
  },
  999: {
    chainId: 999,
    network: 'HyperEVM',
    slug: 'hype',
    dexScreenId: 'hyperliquid',
  },
  137: {
    chainId: 137,
    network: 'Polygon',
    slug: 'poly',
    dexScreenId: 'polygon',
  },
  10: {
    chainId: 10,
    network: 'Optimism',
    slug: 'opt',
    dexScreenId: 'optimism',
  },
  130: {
    chainId: 130,
    network: 'Unichain',
    slug: 'uni',
    dexScreenId: 'unichain',
  },
  1329: {
    chainId: 1329,
    network: 'Sei EVM',
    slug: 'sei',
    dexScreenId: undefined,
  },
  43114: {
    chainId: 43114,
    network: 'Avalanche',
    slug: 'avax',
    dexScreenId: 'avalanche',
  },
  100: {
    chainId: 100,
    network: 'Gnosis',
    slug: 'gnosis',
    dexScreenId: 'gnosis',
  },
  534352: {
    chainId: 534352,
    network: 'Scroll',
    slug: 'scroll',
    dexScreenId: 'scroll',
  },
  747474: {
    chainId: 747474,
    network: 'Katana',
    slug: 'katana',
    dexScreenId: 'katana',
  },
  33139: {
    chainId: 33139,
    network: 'Apechain',
    slug: 'ape',
    dexScreenId: 'apechain',
  },
  480: {
    chainId: 480,
    network: 'Worldchain',
    slug: 'worldchain',
    dexScreenId: 'worldchain',
  },
  9745: {
    chainId: 9745,
    network: 'Plasma',
    slug: 'plasma',
    dexScreenId: 'plasma',
  },
  60808: {
    chainId: 60808,
    network: 'Bob',
    slug: 'bob',
    dexScreenId: 'bob',
  },
  1135: {
    chainId: 1135,
    network: 'Lisk',
    slug: 'lisk',
    dexScreenId: 'lisk',
  },
  143: {
    chainId: 143,
    network: 'Monad',
    slug: 'monad',
    dexScreenId: 'monad',
  },
}

export enum Protocol {
  AaveV3 = 'AAVE_V3',
  BalancerV2 = 'BALANCER_V2',
  Berahub = 'BERAHUB',
  Infrared = 'INFRARED',
  KodiakIsland = 'KODIAK_ISLAND',
  Bex = 'BEX',
  BeraPaw = 'BERAPAW',
  BeraBorrow = 'BERABORROW',
  KodiakBaults = 'KODIAK_BAULTS',
  Curve = 'CURVE',
  UniswapV2 = 'UNISWAP_V2',
  Morpho = 'MORPHO',
  Hypurrfi = 'HYPURRFI',
  HyperLend = 'HYPERLEND',
  Pendle = 'PENDLE',
  Yei = "YEI",
  DragonswapV2 = 'DRAGONSWAP_V2',
  HyperswapV2 = 'HYPERSWAP_V2',
  UniswapV3 = 'UNISWAP_V3',
  Hyperstable = 'HYPERSTABLE',
  Bend = 'BEND',
  Fluid = 'FLUID',
  QuickswapV3 = 'QUICKSWAP_V3',
  YearnFinance = 'YEARN_FINANCE',
  HybraV2 = 'HYBRA_V2',
  HybraV3 = 'HYBRA_V3',
  HyperswapV3 = 'HYPERSWAP_V3',
  Kinetiq = 'KINETIQ',
  LaminarV3 = 'LAMINAR_V3',
  ProjectXV3 = 'PROJECTX_V3',
  StakedHype = 'STAKED_HYPE',
}

export const protocolsConfig: {
  [key in Protocol]: {
    name: string
    symbol: string
    url: string
    supportedChains: number[]
  }
} = {
  [Protocol.AaveV3]: {
    name: 'Aave V3',
    symbol: 'AAVE_V3',
    url: 'https://app.aave.com/',
    supportedChains: [42161, 8453, 56, 146, 1, 137, 10, 43114, 100, 534352],
  },
  [Protocol.BalancerV2]: {
    name: 'Balancer V2',
    symbol: 'BALANCER_V2',
    url: 'https://balancer.fi/',
    supportedChains: [42161, 8453, 1, 43114, 100, 10, 137],
  },
  [Protocol.Berahub]: {
    name: 'Berahub',
    symbol: 'BERAHUB',
    url: 'https://hub.berachain.com/',
    supportedChains: [80094],
  },
  [Protocol.Infrared]: {
    name: 'Infrared',
    symbol: 'INFRARED',
    url: 'https://infrared.finance/',
    supportedChains: [80094],
  },
  [Protocol.KodiakIsland]: {
    name: 'Kodiak Island',
    symbol: 'KODIAK_ISLAND',
    url: 'https://app.kodiak.finance/',
    supportedChains: [80094],
  },
  [Protocol.Bex]: {
    name: 'Bex',
    symbol: 'BEX',
    url: 'https://hub.berachain.com',
    supportedChains: [80094],
  },
  [Protocol.BeraPaw]: {
    name: 'BeraPaw',
    symbol: 'BERAPAW',
    url: 'https://www.berapaw.com/',
    supportedChains: [80094],
  },
  [Protocol.BeraBorrow]: {
    name: 'BeraBorrow',
    symbol: 'BERABORROW',
    url: 'https://app.beraborrow.com/',
    supportedChains: [80094],
  },
  [Protocol.KodiakBaults]: {
    name: 'Kodiak Baults',
    symbol: 'KODIAK_BAULTS',
    url: 'https://app.kodiak.finance/#/liquidity/pools?chain=berachain_mainnet',
    supportedChains: [80094],
  },
  [Protocol.Curve]: {
    name: 'Curve',
    symbol: 'CURVE',
    url: 'https://www.curve.finance/',
    supportedChains: [42161, 8453, 1, 999, 56, 146, 43114, 100, 10, 137],
  },
  [Protocol.UniswapV2]: {
    name: 'Uniswap V2',
    symbol: 'UNISWAP_V2',
    url: 'https://app.uniswap.org/',
    supportedChains: [42161, 8453, 1, 56, 130, 137, 10, 43114, 480],
  },
  [Protocol.Morpho]: {
    name: 'Morpho',
    symbol: 'MORPHO',
    url: 'https://app.hyperbeat.org/earn',
    supportedChains: [999, 1, 8453, 137, 130, 747474, 42161],
  },
  [Protocol.Hypurrfi]: {
    name: 'Hypurrfi',
    symbol: 'HYPURRFI',
    url: 'https://app.hypurr.fi/',
    supportedChains: [999],
  },
  [Protocol.HyperLend]: {
    name: 'HyperLend',
    symbol: 'HYPERLEND',
    url: 'https://app.hyperlend.finance/',
    supportedChains: [999],
  },
  [Protocol.Pendle]: {
    name: 'Pendle',
    symbol: 'PENDLE',
    url: 'https://app.pendle.finance/',
    supportedChains: [80094, 1, 8453, 42161, 999, 10, 146, 56],
  },
  [Protocol.Yei]: {
    name: 'Yei',
    symbol: 'YEI',
    url: 'https://app.yei.finance/',
    supportedChains: [1329],
  },
  [Protocol.DragonswapV2]: {
    name: 'Dragonswap V2',
    symbol: 'DRAGONSWAP_V2',
    url: 'https://dragonswap.app/',
    supportedChains: [1329],
  },
  [Protocol.HyperswapV2]: {
    name: 'Hyperswap V2',
    symbol: 'HYPERSWAP_V2',
    url: 'https://app.hyperswap.xyz/',
    supportedChains: [999],
  },
  [Protocol.UniswapV3]: {
    name: 'Uniswap V3',
    symbol: 'UNISWAP_V3',
    url: 'https://app.uniswap.org/',
    supportedChains: [42161, 8453, 1, 56, 130, 137, 10, 43114, 480],
  },
  [Protocol.Hyperstable]: {
    name: 'Hyperstable',
    symbol: 'HYPERSTABLE',
    url: 'https://app.hyperstable.finance/',
    supportedChains: [999],
  },
  [Protocol.Bend]: {
    name: 'Bend',
    symbol: 'BEND',
    url: 'https://www.benddao.xyz/',
    supportedChains: [1, 8453],
  },
  [Protocol.Fluid]: {
    name: 'Fluid',
    symbol: 'FLUID',
    url: 'https://fluid.lending/',
    supportedChains: [1, 8453, 42161],
  },
  [Protocol.QuickswapV3]: {
    name: 'Quickswap V3',
    symbol: 'QUICKSWAP_V3',
    url: 'https://quickswap.exchange/',
    supportedChains: [137],
  },
  [Protocol.YearnFinance]: {
    name: 'Yearn Finance',
    symbol: 'YEARN_FINANCE',
    url: 'https://yearn.fi/',
    supportedChains: [1, 42161, 8453, 10, 137],
  },
  [Protocol.HybraV2]: {
    name: 'Hybra V2',
    symbol: 'HYBRA_V2',
    url: 'https://app.hybra.finance/',
    supportedChains: [999],
  },
  [Protocol.HybraV3]: {
    name: 'Hybra V3',
    symbol: 'HYBRA_V3',
    url: 'https://app.hybra.finance/',
    supportedChains: [999],
  },
  [Protocol.HyperswapV3]: {
    name: 'Hyperswap V3',
    symbol: 'HYPERSWAP_V3',
    url: 'https://app.hyperswap.xyz/',
    supportedChains: [999],
  },
  [Protocol.Kinetiq]: {
    name: 'Kinetiq',
    symbol: 'KINETIQ',
    url: 'https://app.kinetiq.finance/',
    supportedChains: [999],
  },
  [Protocol.LaminarV3]: {
    name: 'Laminar V3',
    symbol: 'LAMINAR_V3',
    url: 'https://app.laminar.finance/',
    supportedChains: [999],
  },
  [Protocol.ProjectXV3]: {
    name: 'ProjectX V3',
    symbol: 'PROJECTX_V3',
    url: 'https://app.projectx.finance/',
    supportedChains: [999],
  },
  [Protocol.StakedHype]: {
    name: 'Staked Hype',
    symbol: 'STAKED_HYPE',
    url: 'https://app.stakedhype.finance/',
    supportedChains: [999],
  },
}

export const mappingErrorCodeMessage: Record<string, string> = {
  '200000': 'Bridge fee has changed. Please try again with a new quote.',
  '100000': 'No route found or not enough liquidity for your trade.',
  '100001': 'Quote expired or not found. Please try again.',
  '100002': 'A signature is needed to complete this bridge.',
  '100003': 'Amount is too low. Please enter a larger amount to bridge.',
  '100004':
    'Infrared and BeraPaw vaults require a smart account. Please switch to a smart account to continue.',
  '100005': 'Token is not supported. Please check the token address or query our token list.',
  '100006':
    'Infrared and BeraPaw vaults are not supported for bridging. Please try using a Berachain-native token.',
  '100008':
    'Debt in the input is not supported for EOA accounts. Please try again with a smart account wallet.',
  '100009':
    'You need to select an additional collateral token when your input includes a var debt token.',
  '500': 'This intent could not be solved right now. Please try again in a few minutes',
  '403': 'Network Error',
  '400': 'Request failed with status code 400',
}

