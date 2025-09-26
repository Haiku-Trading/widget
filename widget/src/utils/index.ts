
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }


const compactFormat = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'USD',
  roundingMode: 'floor',
  maximumFractionDigits: 1,
  trailingZeroDisplay: 'stripIfInteger',
})

const fullValueFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const usdFormatter = {
  compact: {
    ...compactFormat,
    format: (value: string | number) => compactFormat.format(Number(value)),
  },
  fullValue: {
    ...fullValueFormat,
    format: (value: string | number) => fullValueFormat.format(Number(value)),
  },
}

export const tokenFormatter = {
  fullValue: (decimals: number) => {
    const numberFormat = new Intl.NumberFormat('en-us', {
      roundingMode: 'floor',
      maximumFractionDigits: Number(decimals),
    })

    return {
      ...numberFormat,
      // Don't remove "as number". JavaScript rounds the value up when using Number(value) causing the exact number not to be shown in some cases. And it seems to have no problem sending a string to the format() function
      format: (value: string | number) => {
        return new Intl.NumberFormat('en-us', {
          roundingMode: 'floor',
          maximumFractionDigits: decimals,
          trailingZeroDisplay: 'stripIfInteger',
        }).format(value as number)
      },
    }
  },
}

// Chain utilities
export { getChainIcon } from './chain-utils'

// Protocol utilities
export { getProtocolIcon } from './protocol-utils'

// Theme utilities
export { colorToHsl, isValidColor, generateThemeCSS, applyThemeToElement, generateColorScale, getContrastColor } from './theme-utils'

// Token resolution utilities
export { resolveTokensFromIids, resolveTokensFromMap, resolveTokenFromIid, type TokenListData, type AnyAPIToken } from './token-resolution'

// React 19 compatibility utilities
export { isReact19, useSafeEffect, useStableCallback, useDebouncedState, useSafeStoreSubscription } from './react-19-compat'
