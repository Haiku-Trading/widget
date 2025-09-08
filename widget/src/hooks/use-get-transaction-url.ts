import { useConfig } from 'wagmi'

export function useGetTransactionURL(): (chainID?: number, txHash?: string) => string
export function useGetTransactionURL(chainID?: number, txHash?: string): string
export function useGetTransactionURL(chainID?: number, txHash?: string) {
  const config = useConfig()

  function getTransactionURL(chainID: number, txHash: string) {
    const network = config.chains.find((chain) => chain.id === chainID)
    if (network) {
      const txURL = new URL(`/tx/${txHash}`, network.blockExplorers?.default.url)
      return txURL.toString()
    }
    return ''
  }

  if (!!chainID && !!txHash) return getTransactionURL(chainID, txHash)
  return getTransactionURL
}
