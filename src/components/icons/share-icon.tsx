import React from 'react'

interface ShareIconProps extends React.SVGProps<SVGSVGElement> {}

export const ShareIcon: React.FC<ShareIconProps> = (props) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M14.5 6.5L14.5 2.5M14.5 2.5H10.5M14.5 2.5L9.16667 7.83333M7.16667 3.83333H5.7C4.5799 3.83333 4.01984 3.83333 3.59202 4.05132C3.21569 4.24307 2.90973 4.54903 2.71799 4.92535C2.5 5.35318 2.5 5.91323 2.5 7.03333V11.3C2.5 12.4201 2.5 12.9802 2.71799 13.408C2.90973 13.7843 3.21569 14.0903 3.59202 14.282C4.01984 14.5 4.5799 14.5 5.7 14.5H9.96667C11.0868 14.5 11.6468 14.5 12.0746 14.282C12.451 14.0903 12.7569 13.7843 12.9487 13.408C13.1667 12.9802 13.1667 12.4201 13.1667 11.3V9.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
