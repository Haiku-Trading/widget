import React from 'react'
import Switch from './../../icons/switch.svg'

type SwapDividerProps = {
  onSwap?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
export function SwapDivider({ onSwap }: SwapDividerProps) {
  return (
    <div className="w-full flex items-center flex-col justify-center h-11 relative">
      <div className="w-full">
        <svg
          width="100%"
          height="3"
          viewBox="0 0 473 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M472 2.25C472.414 2.25 472.75 1.91421 472.75 1.5C472.75 1.08579 472.414 0.75 472 0.75V2.25ZM0 2.25H472V0.75H0V2.25Z"
            fill="url(#paint0_linear_912_3342)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_912_3342"
              x1="0"
              y1="2"
              x2="472"
              y2="2"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.01" stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.54" stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <button
        onClick={onSwap}
        className="bg-foreground size-11 text-divider absolute rounded-2xl flex items-center justify-center  hover:rotate-180 transition-transform duration-300"
      >
        <Switch />
      </button>
    </div>
  )
}
