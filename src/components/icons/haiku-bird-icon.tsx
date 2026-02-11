import React from 'react'

interface HaikuBirdIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const HaikuBirdIcon: React.FC<HaikuBirdIconProps> = (props) => {
  return (
    <img
      src="https://app.haiku.trade/icons/haiku-bird.gif"
      alt="Haiku Bird"
      {...props}
    />
  )
}
