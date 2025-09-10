import React from 'react'

interface XMarkIconProps extends React.SVGProps<SVGSVGElement> {}

export const XMarkIcon: React.FC<XMarkIconProps> = (props) => {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M4.52718 5.50895L9.50928 10.491M4.52718 10.491L9.50928 5.50895" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
