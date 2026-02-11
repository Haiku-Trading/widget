import { isAddress } from 'viem'

/**
 * Validates if a wallet address is valid (ie. a string, not undefined or null etc)
 * @param address - The wallet address to validate
 * @returns true if the address is valid, false otherwise
 */
export function isValidWalletAddress(address: string | undefined | null): boolean {
  if (!address) return false
  return isAddress(address)
} 