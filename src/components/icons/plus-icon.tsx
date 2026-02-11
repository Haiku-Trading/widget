import React from 'react'

interface PlusIconProps extends React.SVGProps<SVGSVGElement> {}

export const PlusIcon: React.FC<PlusIconProps> = (props) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M6.1961 2.47055V9.52937M2.66669 5.99996H9.72551" stroke="currentColor" strokeWidth="1.17647" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
