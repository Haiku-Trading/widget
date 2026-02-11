import {
  APICollateralToken,
  APIToken,
  APIVarDebtToken,
  APIVaultToken,
  APIWeightedLiquidityToken,
  APIConcentratedLiquidityToken,
} from '../services/get-tokens'

export interface TokenListData {
  tokens: APIToken[]
  collateralTokens: APICollateralToken[]
  varDebtTokens: APIVarDebtToken[]
  vaultTokens: APIVaultToken[]
  weightedLiquidityTokens: APIWeightedLiquidityToken[]
  concentratedLiquidityTokens?: APIConcentratedLiquidityToken[]
}

export type AnyAPIToken = APIToken | APICollateralToken | APIVarDebtToken | APIVaultToken | APIWeightedLiquidityToken | APIConcentratedLiquidityToken

/**
 * Resolves an array of token iids to actual token objects from the token list data
 * @param iids Array of token iids to resolve
 * @param tokenData The complete token list data
 * @param hiddenChains Optional array of hidden chain IDs to filter out
 * @param hiddenProtocols Optional array of hidden protocol names to filter out
 * @returns Array of resolved token objects
 */
export function resolveTokensFromIids(
  iids: string[],
  tokenData: TokenListData,
  hiddenChains?: number[],
  hiddenProtocols?: string[]
): AnyAPIToken[] {
  if (!iids || iids.length === 0) {
    return []
  }

  const resolvedTokens: AnyAPIToken[] = []
  const notFoundIids: string[] = []

  // Combine all token types into a single array for searching
  const allTokens: AnyAPIToken[] = [
    ...tokenData.tokens,
    ...tokenData.collateralTokens,
    ...tokenData.varDebtTokens,
    ...tokenData.vaultTokens,
    ...tokenData.weightedLiquidityTokens,
    ...(tokenData.concentratedLiquidityTokens || []),
  ]

  for (const iid of iids) {
    const token = allTokens.find(t => t.iid.toLowerCase() === iid.toLowerCase())
    
    if (token) {
      // Check if token should be hidden based on chain/protocol filters
      const isHiddenByChain = hiddenChains?.includes(token.network)
      const isHiddenByProtocol = token.protocol && hiddenProtocols?.includes(token.protocol)
      
      if (!isHiddenByChain && !isHiddenByProtocol) {
        resolvedTokens.push(token)
      } else {
        console.warn(`Token ${iid} is hidden by configuration (chain: ${token.network}, protocol: ${token.protocol})`)
      }
    } else {
      notFoundIids.push(iid)
    }
  }

  if (notFoundIids.length > 0) {
    console.warn(`Could not resolve the following token iids: ${notFoundIids.join(', ')}`)
  }

  return resolvedTokens
}

/**
 * Resolves a record of token iids with amounts/weights to actual token objects
 * @param tokenMap Record of token iid -> amount/weight
 * @param tokenData The complete token list data
 * @param hiddenChains Optional array of hidden chain IDs to filter out
 * @param hiddenProtocols Optional array of hidden protocol names to filter out
 * @returns Array of resolved token objects with their amounts/weights
 */
export function resolveTokensFromMap(
  tokenMap: Record<string, number>,
  tokenData: TokenListData,
  hiddenChains?: number[],
  hiddenProtocols?: string[]
): Array<{ token: AnyAPIToken; amount: number }> {
  if (!tokenMap || Object.keys(tokenMap).length === 0) {
    return []
  }

  const resolvedTokens: Array<{ token: AnyAPIToken; amount: number }> = []
  const notFoundIids: string[] = []

  // Combine all token types into a single array for searching
  const allTokens: AnyAPIToken[] = [
    ...tokenData.tokens,
    ...tokenData.collateralTokens,
    ...tokenData.varDebtTokens,
    ...tokenData.vaultTokens,
    ...tokenData.weightedLiquidityTokens,
    ...(tokenData.concentratedLiquidityTokens || []),
  ]

  for (const [iid, amount] of Object.entries(tokenMap)) {
    const token = allTokens.find(t => t.iid.toLowerCase() === iid.toLowerCase())
    
    if (token) {
      // Check if token should be hidden based on chain/protocol filters
      const isHiddenByChain = hiddenChains?.includes(token.network)
      const isHiddenByProtocol = token.protocol && hiddenProtocols?.includes(token.protocol)
      
      if (!isHiddenByChain && !isHiddenByProtocol) {
        resolvedTokens.push({ token, amount })
      } else {
        console.warn(`Token ${iid} is hidden by configuration (chain: ${token.network}, protocol: ${token.protocol})`)
      }
    } else {
      notFoundIids.push(iid)
    }
  }

  if (notFoundIids.length > 0) {
    console.warn(`Could not resolve the following token iids: ${notFoundIids.join(', ')}`)
  }

  return resolvedTokens
}

/**
 * Resolves a single token iid to a token object
 * @param iid Token iid to resolve
 * @param tokenData The complete token list data
 * @param hiddenChains Optional array of hidden chain IDs to filter out
 * @param hiddenProtocols Optional array of hidden protocol names to filter out
 * @returns Resolved token object or null if not found
 */
export function resolveTokenFromIid(
  iid: string,
  tokenData: TokenListData,
  hiddenChains?: number[],
  hiddenProtocols?: string[]
): AnyAPIToken | null {
  const resolved = resolveTokensFromIids([iid], tokenData, hiddenChains, hiddenProtocols)
  return resolved.length > 0 ? resolved[0] : null
}
