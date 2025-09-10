import React from 'react'

interface DividerIconProps extends React.SVGProps<SVGSVGElement> {}

export const DividerIcon: React.FC<DividerIconProps> = (props) => {
  return (
    <svg width="8" height="1" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path fillRule="evenodd" clipRule="evenodd" d="M0 1.75V0.25H8V1.75H0Z" fill="currentColor"/>

    </svg>
  )
}
