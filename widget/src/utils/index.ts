import BigNumber from 'bignumber.js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: string | number, decimals: number = 2): string {
  const num = new BigNumber(value);
  if (num.isNaN()) return '0.00';
  
  return num.toFormat(decimals);
}

export function formatUSD(value: string | number): string {
  const num = new BigNumber(value);
  if (num.isNaN()) return '$0.00';
  
  if (num.isGreaterThan(1000000)) {
    return `$${num.dividedBy(1000000).toFormat(2)}M`;
  }
  if (num.isGreaterThan(1000)) {
    return `$${num.dividedBy(1000).toFormat(2)}K`;
  }
  
  return `$${num.toFormat(2)}`;
}

export function validateAmount(amount: string): boolean {
  const num = new BigNumber(amount);
  return !num.isNaN() && num.isGreaterThan(0);
}

export function calculateSlippage(amount: string, slippagePercent: number): string {
  const num = new BigNumber(amount);
  const slippage = num.multipliedBy(slippagePercent).dividedBy(100);
  return num.minus(slippage).toString();
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getChainName(chainId: number): string {
  const chainNames: Record<number, string> = {
    1: 'Ethereum',
    10: 'Optimism',
    56: 'BSC',
    137: 'Polygon',
    42161: 'Arbitrum',
    8453: 'Base',
    1329: 'Berachain',
    747474: 'Berachain Testnet',
  };
  
  return chainNames[chainId] || `Chain ${chainId}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
