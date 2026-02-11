/* eslint-disable @typescript-eslint/no-explicit-any */
import { useHttpClient } from '../providers/http-client' 
import { useQuery } from '@tanstack/react-query'

export type TransactionDataType = {
  protocolTxLink: string;
  txLink: string;
  txHash: string;
  protocol: string;
  chainId: number;
  fromAddress: string;
  toAddress: string;
  status: 'PENDING' | 'DONE' | 'NOT_FOUND' | 'FAILED' | 'REFUNDED';
}

export type TransactionDataTypeResponse = {
  sourceTx: TransactionDataType,
  destinationTx: TransactionDataType,
  sender: string,
  recipient: string,
  fromAmount?: {
    chainId: number,
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    amount: string | number,
    amountUSD: string | number,
    type: string,
    logoURI: string
  },
  toAmount?: {
    chainId: number,
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    amount: string | number,
    amountUSD: string | number,
    type: string,
    logoURI: string
  }
  refundAmount?: {
    chainId: number,
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    amount: string | number,
    amountUSD: string | number,
    type: string,
    logoURI: string
  }
  metadata: any
} | undefined

export function useTransactionQuery(protocol: string, hash: string) {

  const httpClient = useHttpClient()

  const query = useQuery({
    queryKey: ['transactionQuery', protocol, hash],
    queryFn: async () => {
      if (!protocol || !hash) return null
      
      await new Promise((resolve) => setTimeout(resolve, 2500))

      const response = await httpClient.get<TransactionDataTypeResponse>(`/ui/transactionData?protocol=${protocol}&txHash=${hash}`)
      return response
    },
    enabled: Boolean(protocol) && Boolean(hash), // fetch if we have a user ID
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 48 * 60 * 60 * 1000, // Keep data in cache for 48 hours
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  return {
    ...query,
    // Manual refresh function
    refresh: () => query.refetch(),
  }

}
