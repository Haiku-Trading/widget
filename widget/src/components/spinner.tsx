import { ComponentPropsWithoutRef } from 'react'
import { cn } from '../utils'

type SpinnerProps = {
  variant?: 'primary' | 'secondary'
} & ComponentPropsWithoutRef<'svg'>

export function Spinner(props: SpinnerProps) {
  const { className, variant = 'primary', ...svgProps } = props

  return (
    <>
      {variant === 'primary' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className={cn('text-foreground h-4 w-4 animate-spin', className)}
          {...svgProps}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="animate-spin mt-1"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1.6875V3.5625M9 13.5V16.5M4.3125 9H1.6875M15.9375 9H14.8125M13.8428 13.8428L13.3125 13.3125M13.9982 4.06184L12.9375 5.1225M3.69118 14.3088L5.8125 12.1875M3.84651 3.90651L5.4375 5.4975"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  )
}
