import React from 'react'

interface MoonIconProps extends React.SVGProps<SVGSVGElement> {}

export const MoonIcon: React.FC<MoonIconProps> = (props) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<g clipPath="url(#clip0_4245_10635)">
<path d="M18.3334 13.2035C17.2389 13.6985 16.024 13.9741 14.7446 13.9741C9.92949 13.9741 6.02604 10.0706 6.02604 5.25547C6.02604 3.97615 6.30159 2.76118 6.79656 1.66669C3.77155 3.03471 1.66675 6.07894 1.66675 9.61476C1.66675 14.4299 5.5702 18.3334 10.3853 18.3334C13.9212 18.3334 16.9654 16.2286 18.3334 13.2035Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_4245_10635">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>

    </svg>
  )
}
