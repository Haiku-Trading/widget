import { HttpClient } from '../models/http-client'
import { TokenType } from '../enums/token-type'

export type Category = 'token' | 'collateral' | 'varDebt' | 'weightedLiquidity' | 'vault'

export async function getTokens(httpClient: HttpClient) {
  const data = await httpClient.get<TokenListResponse>(`/tokenList`)
  return data
}

export type TokenListResponse = {
  tokenCategories: Category[]
  tokenList: TokenList
}

export type TokenList = {
  tokens: APIToken[]
  collateralTokens: APICollateralToken[]
  varDebtTokens: APIVarDebtToken[]
  weightedLiquidityTokens: APIWeightedLiquidityToken[]
  vaultTokens: APIVaultToken[]
}

export type AnyAPIToken =
  | APIToken
  | APICollateralToken
  | APIVarDebtToken
  | APIWeightedLiquidityToken
  | APIVaultToken

export type APIToken = {
  /**
   * @deprecated Use network property instead.
   */
  chainId?: number
  address: string
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey?: string
  logoURI?: string
  network: number
  primaryColor: string
  tokenCategory: Category
  iid: string
  url?: string
  // TODO: remove this later
  type: TokenType
  locked?: boolean
  percentage?: number
  showSlider?: boolean
  minApr?: string
  maxApr?: string
  protocol?: string
  imgSrc?: string[]
  balance?: string
  apy?: string
  metadata?: {
    priceUSD: string
    mcap: string
    mcapPercentage24h: string
    fdv: string
    price24h: string
    pricePercentage24h: string
    volume24h: string,
    tvl?: string
  }
  minApy?: string
  maxApy?: string
}

export type APICollateralToken = {
  /**
   * @deprecated Use network property instead.
   */
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey: string
  logoURI?: string
  network: number
  primaryColor: string
  tokenCategory: Category
  iid: string
  protocol: string
  underlying_iid: string
  liquidation_penalty: number
  max_ltv?: number
  liquidation_threshold?: number
  url?: string
  apy?: string
  // TODO: remove this later
  type: TokenType
  locked?: boolean
  percentage?: number
  showSlider?: boolean
}

export type APIVarDebtToken = {
  iid: string
  address: string
  protocol: string
  underlying_iid: string
  network: number
  reserve_factor: number
  decimals: number
  name: string
  symbol: string
  primaryColor: string
  tokenCategory: Category
  logoURI: string
  priceUSD: string
  url?: string
  // TODO: remove this later
  type: TokenType
  locked?: boolean
  percentage?: number
  showSlider?: boolean
}

export type APIWeightedLiquidityToken = {
  iid: string
  name: string
  symbol: string
  address: string
  protocol: string
  underlying_iids: string[]
  weights: number[]
  network: number
  decimals: number
  poolId: string
  tokenCategory: Category
  primaryColor: string
  priceUSD: string
  url?: string
  type: TokenType
  locked?: boolean
  percentage?: number
  showSlider?: boolean
  minApr?: string
  maxApr?: string
  logosUrl?: string[]
}

export type APIVaultToken = {
  iid: string
  address: string
  underlying_iid: string
  decimals: number
  protocol: string
  network: number
  tokenCategory: Category
  primaryColor: string
  color: string
  name: string
  symbol: string
  priceUSD: string
  url?: string
  type: TokenType
  locked?: boolean
  percentage?: number
  showSlider?: boolean
  minApr?: string
  maxApr?: string
}
