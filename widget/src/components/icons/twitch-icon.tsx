import React from 'react'

interface TwitchIconProps extends React.SVGProps<SVGSVGElement> {}

export const TwitchIcon: React.FC<TwitchIconProps> = (props) => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<g clipPath="url(#clip0_1308_2168)">
<path fillRule="evenodd" clipRule="evenodd" d="M9.26316 7.66683H10.807V4.00016H9.26316V7.66683ZM5.40351 7.66683H6.94737V4.00016H5.40351V7.66683ZM13.1228 8.62539V1.80016H2.31579V10.6002H5.40351V12.7658L7.37965 10.6002H11.0695L13.1228 8.62539ZM10.7352 12.8002H7.71389L5.70225 15.0002H3.85965V12.8002H0V2.88548L1.00351 0.333496H14.6667V9.26025L10.7352 12.8002Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1308_2168">
<rect width="14.6667" height="14.6667" fill="currentColor" transform="translate(0 0.333496)"/>
</clipPath>
</defs>

    </svg>
  )
}
