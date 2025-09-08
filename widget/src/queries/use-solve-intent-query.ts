import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { solveIntent, SolveIntentPayload } from '../services/solve-intent'
import { useHttpClient } from '../providers/http-client'
import { tradeKeys } from '.'
import { useClassicSolveIntentPayload } from '../hooks/use-solve-intent-payload'
import { useConfig } from 'wagmi'
import { getWalletClient } from '@wagmi/core'
import { mappingChainNameToChainId } from '../constants/constants'
import { useEIP7702 } from '../hooks/use-eip-7702'
import { AxiosError } from 'axios'
import { mappingErrorCodeMessage } from '../constants/constants'
import { useSolveIntentErrorStore } from '../stores/solve-intent-error'
import { useTransactionConfirmingStore } from '../stores/tx-confirming'

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

function getChainIdFromPositions(positions: Record<string, string>) {
  const chainNameSet = new Set(Object.keys(positions).map((key) => key.split(':')[0]))
  return mappingChainNameToChainId[Array.from(chainNameSet)[0]]
}

export function useSolveIntentQuery(
  payload: SolveIntentPayload, 
  isRefetch: boolean = true,
  identityToken?: string
) {
  const httpClient = useHttpClient()
  const config = useConfig()
  const { eip7702 } = useEIP7702()
  const payloadKey = Buffer.from(JSON.stringify(payload)).toString('base64');
  const { solveIntentErrors, updateSolveIntentErrors, cleanSolveIntentErrors } = useSolveIntentErrorStore()
  const existingPayload = solveIntentErrors[payloadKey];

  // prettier-ignore
  const isAllInputValuesNonZero = Object.values(payload.intent.inputPositions).length > 0 && Object.values(payload.intent.inputPositions).every((value) => Number(value) > 0)
  // prettier-ignore
  const isAllOutputValuesNonZero = Object.values(payload.intent.targetWeights).length > 0 && Object.values(payload.intent.targetWeights).every((value) => Number(value) > 0)

  return useQuery({
    queryKey: tradeKeys.solveIntent(payload),
    queryFn: async ({ signal }) => {
      await sleep(200)
      if (existingPayload && (Date.now() - Number(existingPayload.lastCall)) < 20000) {
        throw new Error(existingPayload.errorMessage)
      }
      if (!payload.intent.receiver) return null
      if (!signal.aborted) {
        let isEIP7702 = false
        try {
          const chainId = getChainIdFromPositions(payload.intent.inputPositions)
          const walletClient = await getWalletClient(config, { chainId })
          const capabilities = await walletClient.getCapabilities({
            account: walletClient.account,
            chainId,
          })

          isEIP7702 =
            (capabilities?.atomic?.status === 'supported' ||
              capabilities?.atomic?.status === 'ready') &&
            eip7702
        } catch {
          // If the wallet does not support EIP-7702, we will not use it
        }

        try {
          const response = await solveIntent(
            payload,
            httpClient,
            signal,
            identityToken || undefined,
            isEIP7702,
          )

          cleanSolveIntentErrors()
          return response
        } catch (error) {
          if (
            error instanceof AxiosError &&
            mappingErrorCodeMessage[error?.response?.data?.errorCode]
          ) {
            updateSolveIntentErrors(
              payloadKey,
              mappingErrorCodeMessage[error?.response?.data?.errorCode],
              Date.now().toString(),
            )
            throw new Error(mappingErrorCodeMessage[error?.response?.data?.errorCode])
          }
          throw error
        }
      }
      return null
    },
    staleTime: isRefetch ? 0 : Infinity,
    placeholderData: keepPreviousData,
    enabled: !!payload.intent.receiver && isAllInputValuesNonZero && isAllOutputValuesNonZero,
    refetchInterval: isRefetch ? 20000 : false,
  })
}

/* -------------------------------------------------------------------------------------------------
 * useClassicSolveIntentQuery
 * -----------------------------------------------------------------------------------------------*/

export function useClassicSolveIntentQuery(identityToken?: string) {
  const { isConfirming } = useTransactionConfirmingStore()
  return useSolveIntentQuery(useClassicSolveIntentPayload(), !isConfirming, identityToken)
}
