import React from 'react'

interface MagniferIconProps extends React.SVGProps<SVGSVGElement> {}

export const MagniferIcon: React.FC<MagniferIconProps> = (props) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M7.25 0.743652C10.976 0.743652 14 3.76765 14 7.49365C14 11.2197 10.976 14.2437 7.25 14.2437C3.524 14.2437 0.5 11.2197 0.5 7.49365C0.5 3.76765 3.524 0.743652 7.25 0.743652ZM7.25 12.7437C10.1502 12.7437 12.5 10.3939 12.5 7.49365C12.5 4.59265 10.1502 2.24365 7.25 2.24365C4.349 2.24365 2 4.59265 2 7.49365C2 10.3939 4.349 12.7437 7.25 12.7437ZM13.6137 12.7969L15.7355 14.9179L14.6742 15.9792L12.5532 13.8574L13.6137 12.7969Z" fill="#666666"/>

    </svg>
  )
}
