import { type Config, getWalletClient } from '@wagmi/core'
import { WalletClient } from 'viem'

/**
 * Safely gets a wallet client for a specific chain.
 * 
 * Some connectors (especially certain ConnectKit connectors) don't implement
 * connector.getChainId(), which causes errors when calling getWalletClient(config, { chainId }).
 * 
 * This function avoids calling connector.getChainId() by:
 * 1. First trying to get the wallet client without specifying chainId (uses current connection)
 * 2. Verifying the chain matches the expected chainId
 * 3. If it doesn't match, it means we need to switch chains first (caller should handle that)
 * 
 * @param config - Wagmi config
 * @param chainId - The expected chain ID
 * @param maxRetries - Maximum number of retries if chain doesn't match (default: 3)
 * @param retryDelay - Delay between retries in ms (default: 100)
 * @returns Promise<WalletClient> - The wallet client for the specified chain
 * @throws Error if the chain doesn't match after retries
 */
export async function getWalletClientSafely(
  config: Config,
  chainId: number,
  maxRetries: number = 3,
  retryDelay: number = 100
): Promise<WalletClient> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Get wallet client without specifying chainId - uses current connection's chainId
      // This avoids calling connector.getChainId() which may not be available
      const walletClient = await getWalletClient(config)
      
      // Verify the chain matches what we expect
      if (walletClient.chain?.id === chainId) {
        return walletClient
      }
      
      // If chain doesn't match and we have retries left, wait and try again
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        continue
      }
      
      // Last attempt failed - throw error with helpful message
      throw new Error(
        `Chain mismatch: expected chain ${chainId}, but wallet is on chain ${walletClient.chain?.id}. ` +
        `Please ensure your wallet is connected to chain ${chainId} before executing this transaction.`
      )
    } catch (error) {
      // If it's the last attempt, re-throw
      if (attempt === maxRetries - 1) {
        throw error
      }
      // Otherwise wait and retry
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
  
  // Should never reach here, but TypeScript needs it
  throw new Error(`Failed to get wallet client for chain ${chainId}`)
}

/**
 * Gets a wallet client after switching chains.
 * This is a convenience wrapper that combines chain switching with safe wallet client retrieval.
 * 
 * @param config - Wagmi config
 * @param chainId - The target chain ID
 * @param switchChainAsync - Function to switch chains (from useSwitchChain hook)
 * @param currentChainId - Current chain ID (optional, for optimization)
 * @returns Promise<WalletClient> - The wallet client for the specified chain
 */
export async function getWalletClientAfterSwitch(
  config: Config,
  chainId: number,
  switchChainAsync: (params: { chainId: number }) => Promise<unknown>,
  currentChainId?: number
): Promise<WalletClient> {
  // Only switch if we're not already on the target chain
  if (currentChainId !== undefined && currentChainId !== chainId) {
    await switchChainAsync({ chainId })
  } else if (currentChainId === undefined) {
    // If we don't know the current chain, try to get wallet client first
    // If it's already on the right chain, no need to switch
    try {
      const walletClient = await getWalletClient(config)
      if (walletClient.chain?.id !== chainId) {
        await switchChainAsync({ chainId })
      }
    } catch {
      // If we can't get the wallet client, try switching anyway
      await switchChainAsync({ chainId })
    }
  }
  
  // After switching, get the wallet client safely
  return getWalletClientSafely(config, chainId, 5, 100)
}

