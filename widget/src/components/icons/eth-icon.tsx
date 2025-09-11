import React from 'react'

interface EthIconProps extends React.SVGProps<SVGSVGElement> {}

export const EthIcon: React.FC<EthIconProps> = (props) => {
  return (
    <svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

  <rect y="0.37207" width="38" height="37.9996" rx="18.9998" fill="#4781FB" />
  <path
    d="M20.054 6.70557V16.0715L27.4387 19.6087L20.054 6.70557Z"
    fill="white"
    fillOpacity="0.602"
    />
  <path d="M20.0522 6.70557L12.6665 19.6087L20.0522 16.0715V6.70557Z" fill="white" />
  <path
    d="M20.054 25.6747V32.0386L27.4436 21.0793L20.054 25.6747Z"
    fill="white"
    fillOpacity="0.602"
    />
  <path d="M20.0522 32.0386V25.6736L12.6665 21.0793L20.0522 32.0386Z" fill="white" />
  <path
    d="M20.054 24.1989L27.4387 19.6026L20.054 16.0674V24.1989Z"
    fill="white"
    fillOpacity="0.2"
    />
  <path
    d="M12.6665 19.6026L20.0522 24.1989V16.0674L12.6665 19.6026Z"
    fill="white"
    fillOpacity="0.602"
    />
  
    </svg>
  )
}
