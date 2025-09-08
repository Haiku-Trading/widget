import { APIToken } from '../services/get-tokens'
import { APIWeightedLiquidityToken } from '../services/get-tokens'

export const enrichWeightedTokensWithLogos = (
  weightedLiquidityTokens: APIWeightedLiquidityToken[],
  tokens: APIToken[],
) => {
  // Map iid (lowercase) -> token object
  const tokenByIid = new Map(tokens.map((t) => [String(t.iid).toLowerCase(), t]))

  return weightedLiquidityTokens.map((w) => {
    const imgSrc = (w.underlying_iids || []).map((iid) => {
      if (!iid) return null
      const token = tokenByIid.get(String(iid).toLowerCase())
      if (!token) return null

      // Prefer common image fields if present
      return token.logoURI || ''
    })

    // return new object (non-mutating)
    return { ...w, imgSrc }
  })
}
