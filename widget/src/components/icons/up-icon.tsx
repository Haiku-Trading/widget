import React from 'react'

interface UpIconProps extends React.SVGProps<SVGSVGElement> {}

export const UpIcon: React.FC<UpIconProps> = (props) => {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

  <path
    d="M10.8967 9.02688L9.02425 7.15438L7.88092 6.00521C7.39675 5.52105 6.60925 5.52105 6.12508 6.00521L3.10342 9.02688C2.70675 9.42355 2.99258 10.1002 3.54675 10.1002H6.81925H10.4534C11.0134 10.1002 11.2934 9.42355 10.8967 9.02688Z"
    fill="#23BA97"
    />
  
    </svg>
  )
}
