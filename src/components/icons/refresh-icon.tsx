import React from 'react'

interface RefreshIconProps extends React.SVGProps<SVGSVGElement> {}

export const RefreshIcon: React.FC<RefreshIconProps> = (props) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M1.66669 8.83333C1.66669 8.83333 1.76779 8.12563 4.69672 5.1967C7.62565 2.26777 12.3744 2.26777 15.3033 5.1967C16.341 6.23443 17.0111 7.5006 17.3135 8.83333M1.66669 8.83333V3.83333M1.66669 8.83333H6.66669M18.3334 12.1667C18.3334 12.1667 18.2323 12.8744 15.3033 15.8033C12.3744 18.7322 7.62565 18.7322 4.69672 15.8033C3.65899 14.7656 2.98893 13.4994 2.68654 12.1667M18.3334 12.1667V17.1667M18.3334 12.1667H13.3334" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
