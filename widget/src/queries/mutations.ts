import * as common from '@mozaic-fi/intent-swapper-sdk-common'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getWalletClient } from '@wagmi/core'
import { providers } from 'ethers5'
import { WalletClient } from 'viem'
import { useAccount, useClient, useConfig, useSwitchChain } from 'wagmi'
import { INVALIDATE_QUERIES_DELAY } from '../constants/constants'
import { useSessionStore } from '../providers/session'
import { buildIntent, SolveIntentResponse } from '../services/solve-intent'
import { useHttpClient } from '../providers/http-client'

type FeedbackPayload = {
  operation?: string
  session_id?: string
  message_id?: string
  sentiment?: 1 | -1 // 1 for positive, -1 for negative
  category?: string
  body?: string
  quote_id?: string
  quote_status?: 'transaction_success' | 'transaction_fail'
  tx_hash?: string
  tx_data?: Record<string, unknown>
}

export function useFeedbackMutation() {
  const httpClient = useHttpClient()
  
  return useMutation({
    mutationFn: async ({ 
      operation = 'feedbackMessage', 
      ...payload 
    }: FeedbackPayload) => {
      const data = await httpClient.post(
        `/saveSessionData`,
        { operation, payload },
        { 
          headers: { 
            'api-key': '003f827f-b1da-4135-ac68-9a24fdd67599',
          } 
        },
      )
      return data
    },
  })
}


/**
 * Utility function to detect if an error is a user rejection (not a technical error)
 * User rejections should not be treated as transaction failures
 */
function isUserRejectedError(error: unknown): boolean {
  if (!error) return false

  const e = error as { code?: number; message?: string }
  console.log('e', e)

  return (
    e.code === 4001 || // MetaMask user rejection code
    (e.message?.toLowerCase().includes('user rejected') ?? false) ||
    (e.message?.toLowerCase().includes('user denied') ?? false) ||
    (e.message?.toLowerCase().includes('user cancelled') ?? false) ||
    (e.message?.toLowerCase().includes('user canceled') ?? false)
  )
}

export const useSwapMutation = (chainIdInput: number) => {
  const account = useAccount()
  const client = useClient()
  const config = useConfig()
  const queryClient = useQueryClient()
  const { switchChainAsync } = useSwitchChain()
  const sessionId = useSessionStore((state) => state.sessionId)
  const feedbackMutation = useFeedbackMutation()

  function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient

    if (!account || !chain) {
      throw Error('Account or chain not found')
    }

    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
  }

  const mutation = useMutation({
    mutationFn: async (payload: SolveIntentResponse & { 
      chainId?: number
    }) => {
      if (!account.address) {
        throw Error('Account not found')
      }
      if (!client) {
        throw Error('Client not found')
      }

      const { chainId = chainIdInput, ...response } = payload

      let userBridgeSignature: string | undefined

      if (response.destinationBridge) {
        const { unsignedTypeV4Digest, chainId: chainIdOutput } = response.destinationBridge
        if (chainIdOutput !== account.chainId) {
          await switchChainAsync({ chainId: chainIdOutput })
        }
        const walletClientOutput = await getWalletClient(config, { chainId: chainIdOutput })
        const walletOutput = walletClientToSigner(walletClientOutput)

        try {
          userBridgeSignature = await walletOutput._signTypedData(
            unsignedTypeV4Digest.domain,
            unsignedTypeV4Digest.types,
            unsignedTypeV4Digest.values,
          )
        } catch (error) {
          // Check if this is a user rejection for bridge signature
          if (isUserRejectedError(error)) {
            // User rejection is not a technical error, so we don't track it as a failure
            if (process.env.VERCEL_ENV === 'development') {
              console.log('User rejected bridge signature:', error)
            }
            throw error // Re-throw to be handled by the main onError callback
          }

          throw error
        }

        await switchChainAsync({ chainId })
      }

      if (chainId !== account.chainId) {
        await switchChainAsync({ chainId })
      }

      const walletClient = await getWalletClient(config, { chainId })
      const wallet = walletClientToSigner(walletClient)

      if (response.approvals.length > 0) {
        try {
          await Promise.all(
            response.approvals.map(async (approval) => {
            const tx = await wallet.sendTransaction({
              to: approval.to,
              data: approval.data,
            })
            await tx.wait()
            }),
          )
        } catch (error) {
          // Check if this is a user rejection for approval transactions
          if (isUserRejectedError(error)) {
            // User rejection is not a technical error, so we don't track it as a failure
            if (process.env.VERCEL_ENV === 'development') {
              console.log('User rejected approval transaction:', error)
            }
            throw error // Re-throw to be handled by the main onError callback
          }

          throw error
        }
      }

      let transactionRequest: common.TransactionRequest | common.TransactionRequest[]

      let permitTwoSignature: string | undefined

      if (response.permit2Datas) {
        try {
          permitTwoSignature = await wallet._signTypedData(
            response.permit2Datas.domain,
            response.permit2Datas.types,
            response.permit2Datas.values,
          )
          if (!permitTwoSignature) {
            throw Error('Permit2 signature not found')
          }

        } catch (error) {
          // Check if this is a user rejection for Permit2 signature
          if (isUserRejectedError(error)) {
            // User rejection is not a technical error, so we don't track it as a failure
            if (process.env.VERCEL_ENV === 'development') {
              console.log('User rejected Permit2 signature:', error)
            }
            throw error // Re-throw to be handled by the main onError callback
          }

          throw error
        }
      }

      if (response.isComplexBridge) {
        if (!userBridgeSignature) {
          throw Error('User bridge signature not found')
        }
        const buildIntentUi = await buildIntent({
          quoteId: response.quoteId,
          userSignature: userBridgeSignature,
          permit2Signature: permitTwoSignature,
        })

        if (!buildIntentUi) {
          throw Error('Build intent data not found')
        }
        transactionRequest = buildIntentUi
      } else {
        const buildIntentUi = await buildIntent({
          quoteId: response.quoteId,
          permit2Signature: permitTwoSignature,
        })

        if (!buildIntentUi) {
          throw Error('Build intent data not found')
        }
        transactionRequest = buildIntentUi
      }

      try {
        let receipt
        if (Array.isArray(transactionRequest)) {
          const { id } = await walletClient.sendCalls({
            version: '2.0.0',
            forceAtomic: true,
            calls: transactionRequest.map((call) => ({
              to: call.to as `0x${string}`,
              value: call.value ? BigInt(call.value.toString()) : undefined,
              data: call.data as `0x${string}`,
            })),
          })
          const result = await walletClient.waitForCallsStatus({
            id,
          })
          if (result?.status === 'success') {
            receipt = result.receipts![0]
          } else {
            throw Error('Transaction failed')
          }
        } else {
          const tx = await wallet.sendTransaction(transactionRequest)
          receipt = await tx.wait()
        }

        return {
          transactionHash: receipt.transactionHash,
          receipt,
          quoteId: response.quoteId,
        }
      } catch (error) {
        console.log('Tx error', error)
        throw error
      }
    },
    onError: (error: unknown, response) => {
      // Check if this is a user rejection - if so, don't treat it as an error
      if (isUserRejectedError(error)) {
        // User rejection is not a technical error, so we don't track it as a failure
        // Just log it for debugging purposes in development
        if (process.env.VERCEL_ENV === 'development') {
          console.log('User rejected transaction:', error)
        }
        return
      }

      // Error is not a user rejection, so we need to track it as a failure
      // Safely extract error data
      const errorData = {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'UnknownError',
        // Safely check for ethers-specific properties
        ...(error && typeof error === 'object' && 'code' in error
          ? { code: (error as { code: number }).code }
          : {}),
        ...(error && typeof error === 'object' && 'reason' in error
          ? { reason: (error as { reason: string }).reason }
          : {}),
        ...(error && typeof error === 'object' && 'transaction' in error
          ? {
            txHash: (error as { transaction?: { hash?: string } }).transaction?.hash,
            from: (error as { transaction?: { from?: string } }).transaction?.from,
            to: (error as { transaction?: { to?: string } }).transaction?.to,
            gasLimit: (
              error as { transaction?: { gasLimit?: { toString(): string } } }
            ).transaction?.gasLimit?.toString(),
            value: (
              error as { transaction?: { value?: { toString(): string } } }
            ).transaction?.value?.toString(),
          }
          : {}),
      }

      feedbackMutation.mutate({
        operation: 'updateQuote',
        session_id: sessionId,
        quote_id: response.quoteId,
        quote_status: 'transaction_fail',
        tx_data: errorData,
      })

      // if (process.env.VERCEL_ENV !== 'development') {
      //   console.log('Error', error)
      // }
    },
    onSuccess: (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [account.address, 'balances'],
        })
        queryClient.invalidateQueries({
          queryKey: [account.address, 'llm-token-balances'],
        })
      }, INVALIDATE_QUERIES_DELAY)

      feedbackMutation.mutate({
        operation: 'updateQuote',
        session_id: sessionId,
        quote_id: data.quoteId,
        quote_status: 'transaction_success',
        tx_hash: data.transactionHash,
        tx_data: { ...data.receipt },
      })
    },
  })

  return mutation
}
