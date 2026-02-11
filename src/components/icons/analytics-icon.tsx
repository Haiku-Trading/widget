import React from 'react'

interface AnalyticsIconProps extends React.SVGProps<SVGSVGElement> {}

export const AnalyticsIcon: React.FC<AnalyticsIconProps> = (props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M15 16.6668V8.3335M10 16.6668V3.3335M5 16.6668V11.6668" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
