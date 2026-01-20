import { useMutation, useQueryClient } from '@tanstack/react-query'
import { migrateVault, MigrateVaultPayload } from '../services/solve-intent'
import { useAccount, useClient, useConfig, useSwitchChain } from 'wagmi'
import { Chain } from '../enums/chains'
import { WalletClient } from 'viem'
import { providers } from 'ethers5'
import { getWalletClientSafely, getWalletClientAfterSwitch } from '../utils/wagmi-utils'

export function useMigrateVaultMutation() {
  const account = useAccount()
  const config = useConfig()
  const { switchChainAsync } = useSwitchChain()
  const chainId = Chain.BeraChain
  const client = useClient()
  const queryClient = useQueryClient()

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


  return useMutation({
    mutationFn: async (payload: MigrateVaultPayload) => {
      if (!account.address) {
        console.log('Account not found')
        throw Error('Account not found')
      }
      if (!client) {
        console.log('Client not found')
        throw Error('Client not found')
      }
      // Use safe wallet client getter to avoid connector.getChainId() errors
      const walletClient = chainId !== account.chainId
        ? await getWalletClientAfterSwitch(config, chainId, switchChainAsync, account.chainId)
        : await getWalletClientSafely(config, chainId)
      const wallet = walletClientToSigner(walletClient)

      const transactions = await migrateVault(payload, null)

      try {
        let receipt
        if (Array.isArray(transactions)) {
          const { id } = await walletClient.sendCalls({
            version: '2.0.0',
            forceAtomic: true,
            calls: transactions.map((call) => ({
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
          const tx = await wallet.sendTransaction(transactions)
          receipt = await tx.wait()
        }

        return {
          transactionHash: receipt.transactionHash,
          receipt,
        }
      } catch (error) {
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [account.address, 'llm-token-balances'],
      })
    },
    onError: (error: unknown, response) => {
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
    },
  })
}
