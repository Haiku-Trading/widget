import React from 'react'

interface TradeIconProps extends React.SVGProps<SVGSVGElement> {}

export const TradeIcon: React.FC<TradeIconProps> = (props) => {
  return (
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M3.33325 14.7507H16.6666M16.6666 14.7507L13.3333 11.4173M16.6666 14.7507L13.3333 18.084M16.6666 6.41732H3.33325M3.33325 6.41732L6.66659 3.08398M3.33325 6.41732L6.66659 9.75065" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
