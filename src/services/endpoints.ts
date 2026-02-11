const ENDPOINT = {
  TOKENS: '/tokenList',
  PRICES: '/prices',
  INTENTROUTE: '/widget/quote',
  BUILDINTENT: '/widget/solve',
  MIGRATEVAULT: '/migrateVault',
}

export function getEndpoint(key: keyof typeof ENDPOINT): string {
  return ENDPOINT[key]
}
