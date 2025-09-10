import React from 'react'

interface RestartIconProps extends React.SVGProps<SVGSVGElement> {}

export const RestartIcon: React.FC<RestartIconProps> = (props) => {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M8 2.5C11.3137 2.5 14 5.18629 14 8.5C14 11.8137 11.3137 14.5 8 14.5C4.68629 14.5 2 11.8137 2 8.5C2 6.61516 2.86911 4.9333 4.22844 3.83333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M2 3.5H4.66667V6.16667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
