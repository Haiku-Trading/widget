const ENDPOINT = {
  TOKENS: '/tokenList',
  PRICES: '/prices',
  INTENTROUTE: '/quoteIntent',
  BUILDINTENT: '/solveIntent',
  MIGRATEVAULT: '/migrateVault',
}

export function getEndpoint(key: keyof typeof ENDPOINT): string {
  return ENDPOINT[key]
}
