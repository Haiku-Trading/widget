import React from "react";

interface HyperstableIconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number
  height?: string | number
  size?: string | number // Convenience prop for square icons
}

export const HyperstableIcon: React.FC<HyperstableIconProps> = ({
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

  // Use inline styles for explicit sizes to ensure they override host page CSS
  const inlineStyle = widthValue && heightValue ? {
    width: widthValue,
    height: heightValue,
  } : undefined

  return (
    <svg
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={inlineStyle ? { ...props.style, ...inlineStyle } : props.style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 36 36.000001"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      {...props}
    >
      <defs>
        <clipPath id="219ab7889c">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <path
        fill="#18a2f7"
        d="M 32.214844 27.03125 L 19.734375 33.070312 L 18.328125 32.613281 L 18.328125 19 L 18.742188 14.945312 L 32.214844 9.285156 L 34.367188 9.285156 L 34.367188 22.671875 L 33.871094 25.425781 Z M 32.214844 27.03125 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="#5dbcff"
        d="M 1.46875 24.925781 L 1.46875 9.664062 L 2.632812 9.285156 L 12.6875 13.214844 L 17.835938 16.011719 L 17.835938 32.628906 L 16.757812 33.234375 L 2.632812 26.738281 Z M 1.46875 24.925781 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="#1fb1f5"
        d="M 14.699219 1.835938 L 17.871094 1.304688 L 31.144531 6.238281 L 32.730469 8.4375 L 17.871094 14.664062 L 4.183594 9.121094 L 3.597656 7.300781 Z M 14.699219 1.835938 "
        fillOpacity="1"
        fillRule="nonzero"
      />
      <path
        fill="#3f8cff"
        d="M 17.832031 18.734375 L 2.125 25.972656 L 16.835938 32.910156 L 19.828125 32.910156 L 33.875 25.972656 Z M 17.832031 18.734375 "
        fillOpacity="0.74"
        fillRule="nonzero"
      />
      <g clipPath="url(#219ab7889c)">
        <path
          fill="#ffffff"
          d="M 32.558594 6.011719 L 19.566406 0.398438 C 18.316406 -0.144531 16.898438 -0.132812 15.65625 0.425781 L 3.324219 5.96875 C 1.59375 6.746094 0.484375 8.460938 0.488281 10.347656 L 0.496094 14.140625 L 0.492188 24.664062 C 0.488281 26.550781 1.601562 28.261719 3.328125 29.035156 L 15.730469 34.601562 C 16.96875 35.160156 18.390625 35.167969 19.636719 34.628906 L 32.613281 29.019531 C 34.378906 28.257812 35.519531 26.523438 35.511719 24.609375 L 35.460938 10.390625 C 35.453125 8.488281 34.316406 6.769531 32.558594 6.011719 Z M 19.582031 2.800781 L 30.011719 7.308594 C 30.515625 7.527344 30.496094 8.242188 29.984375 8.433594 L 19.875 12.195312 C 18.464844 12.722656 16.90625 12.710938 15.5 12.167969 L 5.792969 8.402344 C 5.289062 8.210938 5.269531 7.507812 5.761719 7.285156 L 15.671875 2.832031 C 16.914062 2.273438 18.332031 2.261719 19.582031 2.800781 Z M 3.53125 9.886719 L 12.671875 13.429688 C 15.023438 14.34375 16.570312 16.59375 16.570312 19.101562 L 16.578125 31.632812 C 16.578125 32.070312 16.121094 32.367188 15.714844 32.183594 L 5.539062 27.617188 C 3.8125 26.839844 2.699219 25.128906 2.703125 23.246094 L 2.707031 14.136719 L 2.699219 10.457031 C 2.699219 10.027344 3.132812 9.734375 3.53125 9.886719 Z M 18.789062 31.671875 L 18.785156 19.175781 C 18.78125 16.636719 20.367188 14.363281 22.761719 13.472656 L 32.421875 9.871094 C 32.820312 9.722656 33.246094 10.015625 33.25 10.4375 L 33.292969 23.167969 C 33.300781 25.082031 32.160156 26.816406 30.394531 27.582031 L 19.644531 32.230469 C 19.238281 32.402344 18.789062 32.109375 18.789062 31.671875 Z M 18.789062 31.671875 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};
