import React from 'react'

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
