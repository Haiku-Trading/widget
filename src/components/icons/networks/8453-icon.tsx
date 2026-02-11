import React from 'react'

interface Chain8453IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number
  height?: string | number
  size?: string | number // Convenience prop for square icons
}

export const Chain8453Icon: React.FC<Chain8453IconProps> = ({ 
  width, 
  height, 
  size,
  ...props 
}) => {
  // Convert size to pixels if it's a number
  const svgWidth = size ?? width
  const svgHeight = size ?? height
  
  // Ensure numeric values are converted to pixel strings
  const widthValue = typeof svgWidth === 'number' ? `${svgWidth}px` : svgWidth
  const heightValue = typeof svgHeight === 'number' ? `${svgHeight}px` : svgHeight
  
  // Build style object for inline styles (highest CSS specificity)
  const style: React.CSSProperties = {}
  if (widthValue) style.width = widthValue
  if (heightValue) style.height = heightValue

  return (
    <svg 
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={style}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >

<rect width="32" height="32" rx="16" fill="#0052FF"/>
<g clipPath="url(#clip0_8336_24851)">
<path d="M15.975 26.6594C21.8767 26.6594 26.6605 21.8842 26.6605 15.9927C26.6605 10.1013 21.8767 5.32608 15.975 5.32608C10.3763 5.32608 5.78368 9.62517 5.32715 15.0959H19.4507V16.8896H5.32715C5.78368 22.3603 10.3763 26.6594 15.975 26.6594Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_8336_24851">
<rect width="21.3333" height="21.3333" fill="white" transform="translate(5.33301 5.33334)"/>
</clipPath>
</defs>

    </svg>
  )
}
