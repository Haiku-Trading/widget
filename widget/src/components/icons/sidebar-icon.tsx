import React from 'react'

interface SidebarIconProps extends React.SVGProps<SVGSVGElement> {}

export const SidebarIcon: React.FC<SidebarIconProps> = (props) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<g clip-path="url(#clip0_912_4310)">
<path fillRule="evenodd" clipRule="evenodd" d="M12.8 11.6081C12.8 12.0366 12.4526 12.384 12.0242 12.384H5.21413V1.20135H12.0242C12.4526 1.20135 12.8 1.54871 12.8 1.97719V11.6081ZM4.57382 0.00134659H2.39321C1.30198 0.00134659 0.417362 0.885963 0.417362 1.97719V11.6081C0.417362 12.6994 1.30198 13.584 2.39321 13.584H12.0242C13.1154 13.584 14 12.6994 14 11.6081V1.97719C14 0.885963 13.1154 0.00134659 12.0242 0.00134659H4.65443C4.64111 0.000463486 4.62767 1.43051e-05 4.61413 1.43051e-05C4.60058 1.43051e-05 4.58714 0.000463486 4.57382 0.00134659ZM4.01413 1.20135V12.384H2.39321C1.96472 12.384 1.61736 12.0366 1.61736 11.6081V1.97719C1.61736 1.54871 1.96472 1.20135 2.39321 1.20135H4.01413Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_912_4310">
<rect width="13.5826" height="13.584" fill="white" transform="matrix(-1 0 0 -1 14 13.584)"/>
</clipPath>
</defs>

    </svg>
  )
}
