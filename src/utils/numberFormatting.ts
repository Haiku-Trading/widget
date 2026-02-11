

const SUBSCRIPT_MAP: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
};

function toSubscript(num: number): string {
  return num.toString().split('').map(d => SUBSCRIPT_MAP[d] || d).join('');
}

type BigNumberLike = {
  toString(): string;
  toNumber?(): number;
};

export function formatWithZeroCountSubscript(num: number | string | BigNumberLike, decimalScale: number): string {
  let numValue: number;
  let str: string;

  if (typeof num === 'string') {
    str = num;
    numValue = parseFloat(num);
    if (isNaN(numValue)) return str;
  } else if (typeof num === 'number') {
    if (!isFinite(num) || isNaN(num)) return num.toString();
    numValue = num;
    str = num.toString();
  } else if (num && typeof num.toString === 'function') {
    str = num.toString();
    numValue = num.toNumber ? num.toNumber() : parseFloat(str);
    if (isNaN(numValue)) return str;
  } else {
    return String(num);
  }

  if (numValue >= 1 || numValue <= -1) {
    // Format decimal for numbers >= 1 or <= -1
    if (str.includes('.')) {
      const [intPart, decimalPart] = str.split('.');
      const truncatedDecimal = decimalPart.slice(0, decimalScale);
      return `${intPart}.${truncatedDecimal}`;
    }
    return str;
  }

  if (!str.includes('.')) return str;

  const [intPart, decimalPart] = str.split('.');

  let zeroCount = 0;
  let rest = '';

  for (const ch of decimalPart) {
    if (ch === '0' && rest === '') {
      zeroCount++;
    } else {
      rest += ch;
    }
  }

  if (zeroCount === 0 || zeroCount < 5) return str.slice(0, 10);

  if (rest === '') return `${intPart}.${'0'.repeat(zeroCount)}`;

  const subscript = toSubscript(zeroCount - 1);

  return `${intPart}.0${subscript}${rest.slice(0,4)}`;
}

/**
 * Get the appropriate number of decimal places for token amount display based on token price
 * @param priceUSD - The token price in USD
 * @returns Number of decimal places to show
 */
export const getTokenAmountDecimals = (priceUSD: number): number => {
  if (priceUSD <= 100) return 2      // Tokens under $100: 2 decimal places
  if (priceUSD <= 1000) return 3     // Tokens $101-1000: 3 decimal places
  if (priceUSD <= 10000) return 6    // Tokens $1001-10000: 6 decimal places
  return 8                           // Tokens over $10000: 8 decimal places
}

/**
 * Format token amount with appropriate decimal places based on token price
 * @param amount - The token amount to format
 * @param priceUSD - The token price in USD
 * @returns Formatted token amount string
 */
export const formatTokenAmount = (amount: number, priceUSD: number): string => {
  const decimals = getTokenAmountDecimals(priceUSD)
  const formatted = amount.toFixed(decimals)
  
  // Check if the formatted result is all zeros after the decimal point
  // (e.g., "0.00", "0.000", "0.00000000", etc.)
  if (amount > 0 && /^0\.0+$/.test(formatted)) {
    return formatWithZeroCountSubscript(amount, 4)
  }
  
  // Remove trailing zeros from the formatted result
  return formatted.replace(/\.?0+$/, '')
}