/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js'
import { BrowserProvider, ethers, formatUnits, toBigInt } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { Account, Chain, Client, erc20Abi, Transport } from 'viem'
import { useAccount } from 'wagmi'
import { useGetTokensQuery } from '../queries'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { TokenType } from '../enums/token-type'

type DepositedTokensProps = {
  tokenAddress?: string
  amount: string
} | null

const getTokenDecimals = async (
  provider: BrowserProvider,
  tokenAddress: string,
): Promise<number> => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider)
    return await tokenContract.decimals()
  } catch (error) {
    console.error(`Failed to get decimals for token ${tokenAddress}:`, error)
    return 18
  }
}

// TODO: Fixed dynamic decimals for token calculation amounts
export const useDepositValues = (txUrl: string, client: Client<Transport, Chain, Account>) => {
  const { address } = useAccount()
  const [depositedTokens, setDepositedTokens] = useState<DepositedTokensProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { chain, transport } = client

  const network = useMemo(
    () => ({
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    }),
    [chain],
  )

  const getTokensQuery = useGetTokensQuery()
  const collateralTokens = useMemo(
    () => getTokensQuery?.data?.tokenList.collateralTokens || [],
    [getTokensQuery?.data?.tokenList.collateralTokens],
  )

  useEffect(() => {
    const fetchDepositValues = async () => {
      try {
        setLoading(true)
        setError(null)

        const txHash = txUrl.split('/').pop()
        if (!txHash) {
          throw new Error('Invalid transaction URL')
        }

        const provider = new BrowserProvider(transport, network)

        const receipt = await provider.getTransactionReceipt(txHash)
        if (!receipt) {
          throw new Error('Transaction receipt not found')
        }

        const tokens = await Promise.all(
          receipt.logs.map(async (log) => {
            if (!log.data || log.data === '0x') {
              return null
            }
            const tokenAddress = log.address
            const rawAmount = toBigInt(log.data)
            const decimals = await getTokenDecimals(provider, tokenAddress)
            const amount = formatUnits(rawAmount, decimals)

            return {
              tokenAddress,
              amount,
            }
          }),
        )

        setDepositedTokens(tokens.filter((token) => token !== null))
      } catch (err) {
        setError(`${(err as Error)?.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDepositValues()
  }, [collateralTokens, network, transport, txUrl])

  return { depositedTokens, loading, error }
}

export function useSwapOutputTotal() {
  const solveIntentQuery = useClassicSolveIntentQuery()
  const tokensQuery = useGetTokensQuery()

  const allTokens = [
    ...(tokensQuery.data?.tokenList.tokens || []),
    ...(tokensQuery.data?.tokenList.collateralTokens || []),
    ...(tokensQuery.data?.tokenList.varDebtTokens || []),
    ...(tokensQuery.data?.tokenList.weightedLiquidityTokens || []),
    ...(tokensQuery.data?.tokenList.vaultTokens || []),
  ]

  const outputTotal = solveIntentQuery.data?.balances.reduce((acc, balance) => {
    // Using pre-calculated amountMinUSD from balances instead of calculating from outputTokenUsdPrices
    const tokenAmount = balance.amountMinUSD

    // Find the token to check if it's a varDebt token
    const findToken = allTokens.find(
      (token) =>
        `${token.network}:${token.address.toLowerCase()}` ===
        `${balance.token.chainId}:${balance.token.address.toLowerCase()}`,
    )

    // Apply minus for varDebt tokens since they represent debt
    return findToken?.type === TokenType.VarDebt
      ? BigNumber(acc).minus(tokenAmount).toString()
      : BigNumber(tokenAmount).plus(acc).toString()
  }, '0')

  return outputTotal || '0'
}

export function useSwapInputTotal() {
  const solveIntentQuery = useClassicSolveIntentQuery()
  const tokensQuery = useGetTokensQuery()

  const allTokens = [
    ...(tokensQuery.data?.tokenList.tokens || []),
    ...(tokensQuery.data?.tokenList.collateralTokens || []),
    ...(tokensQuery.data?.tokenList.varDebtTokens || []),
    ...(tokensQuery.data?.tokenList.weightedLiquidityTokens || []),
    ...(tokensQuery.data?.tokenList.vaultTokens || []),
  ]

  const inputTotal = solveIntentQuery.data?.funds.reduce((acc, fund) => {
    const findToken = allTokens.find(
      (token) =>
        `${token.network}:${token.address.toLowerCase()}` ===
        `${fund.token.chainId}:${fund.token.address.toLowerCase()}`,
    )
    if (!findToken) return acc
    const tokenPrice = findToken.priceUSD
    const tokenAmount = fund.amount

    return BigNumber(tokenAmount).multipliedBy(tokenPrice).plus(acc).toString()
  }, '0')

  return inputTotal || '0'
}
