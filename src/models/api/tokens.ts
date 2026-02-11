import { Address } from 'viem'
import { TokenType } from '../../enums/token-type'

export type APIToken = {
  /**
   * @deprecated Use network instead.
   */
  chainId: number
  network: number
  iid: string
  address: Address
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey: string
  logoURI?: string
  primaryColor?: string
  tokenCategory?: string
  protocol: string
  underlying_iid: string
  reserve_factor: number
  type: TokenType
}

export type CollateralAPIToken = {
  iid: string
  /**
   * @deprecated Use network property instead.
   */
  chainId: number
  network: number
  address: Address
  symbol: string
  name: string
  decimals: number
  priceUSD: string
  coinKey: string
  logoURI: string
  primaryColor: string
  tokenCategory: string
  protocol: string
  underlying_iid: string
  reserve_factor: number
  max_ltv: number
  liquidation_threshold: number
  liquidation_penalty: number
  type: TokenType
}

export type VarDebtAPIToken = {
  iid: string
  address: Address
  network: number
  // WARN: This field does not come from the API. It needs to be added via serialization.
  chainId: number
  protocol: string
  underlying_iid: string
  reserve_factor: number
  decimals: number
  name: string
  symbol: string
  primaryColor?: string
  tokenCategory: string
  coinKey: string
  priceUSD: string
  type: TokenType
}

export type APITokens = {
  tokenList: {
    tokens: APIToken[]
    collateralTokens: CollateralAPIToken[]
    varDebtTokens: VarDebtAPIToken[]
  }
  tokenCategories: string[]
}
