import React from 'react'

interface DownIconProps extends React.SVGProps<SVGSVGElement> {}

export const DownIcon: React.FC<DownIconProps> = (props) => {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M10.8967 6.71677L9.02425 8.58927L7.88092 9.73844C7.39675 10.2226 6.60925 10.2226 6.12508 9.73844L3.10342 6.71677C2.70675 6.3201 2.99258 5.64344 3.54675 5.64344H6.81925H10.4534C11.0134 5.64344 11.2934 6.3201 10.8967 6.71677Z" fill="#FB3748"/>

    </svg>
  )
}
