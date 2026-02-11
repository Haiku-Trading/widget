import React from 'react'

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

export const CheckIcon: React.FC<CheckIconProps> = (props) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M10.1494 3.61719L4.64941 9.11719L2.14941 6.61719" stroke="currentColor" strokeWidth="1.28571" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
