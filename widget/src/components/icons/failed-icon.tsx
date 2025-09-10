import React from 'react'

interface FailedIconProps extends React.SVGProps<SVGSVGElement> {}

export const FailedIcon: React.FC<FailedIconProps> = (props) => {
  return (
    <svg width="62" height="60" viewBox="0 0 62 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M0.459473 30C0.459473 13.4315 13.8909 0 30.4595 0H31.5405C48.1091 0 61.5406 13.4315 61.5406 30C61.5406 46.5685 48.1091 60 31.5405 60H30.4595C13.8909 60 0.459473 46.5685 0.459473 30Z" fill="#FB3748"/>
<path d="M40.5945 20.4053L21.4053 39.5945M21.4053 20.4053L40.5945 39.5945" stroke="white" strokeWidth="2.74595" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
