import React from "react";

interface Chain1135IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const Chain1135Icon: React.FC<Chain1135IconProps> = ({
  width,
  height,
  size,
  ...props
}) => {
  // Convert size to pixels if it's a number
  const svgWidth = size ?? width;
  const svgHeight = size ?? height;

  // Ensure numeric values are converted to pixel strings
  const widthValue = typeof svgWidth === "number" ? `${svgWidth}px` : svgWidth;
  const heightValue =
    typeof svgHeight === "number" ? `${svgHeight}px` : svgHeight;

  // Use inline styles for explicit sizes to ensure they override host page CSS
  const inlineStyle =
    widthValue && heightValue
      ? {
          width: widthValue,
          height: heightValue,
        }
      : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={inlineStyle ? { ...props.style, ...inlineStyle } : props.style}
      zoomAndPan="magnify"
      viewBox="0 0 375 374.999991"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      {...props}
    >
      <defs>
        <filter x="0%" y="0%" width="100%" height="100%" id="92ebe26e88">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            color-interpolation-filters="sRGB"
          />
        </filter>
        <filter x="0%" y="0%" width="100%" height="100%" id="5a4d356582">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
            color-interpolation-filters="sRGB"
          />
        </filter>
        <clipPath id="baa8a1e992">
          <path
            d="M 187.5 0 C 83.945312 0 0 83.945312 0 187.5 C 0 291.054688 83.945312 375 187.5 375 C 291.054688 375 375 291.054688 375 187.5 C 375 83.945312 291.054688 0 187.5 0 Z M 187.5 0 "
            clip-rule="nonzero"
          />
        </clipPath>
        <clipPath id="9c01b3fe5e">
          <path
            d="M 0 0 L 375 0 L 375 375 L 0 375 Z M 0 0 "
            clip-rule="nonzero"
          />
        </clipPath>
        <clipPath id="d836a248ea">
          <path
            d="M 187.5 0 C 83.945312 0 0 83.945312 0 187.5 C 0 291.054688 83.945312 375 187.5 375 C 291.054688 375 375 291.054688 375 187.5 C 375 83.945312 291.054688 0 187.5 0 Z M 187.5 0 "
            clip-rule="nonzero"
          />
        </clipPath>
        <clipPath id="8f39bbfe74">
          <rect x="0" width="375" y="0" height="375" />
        </clipPath>
        <mask id="ec14ef2da6">
          <g filter="url(#92ebe26e88)">
            <g
              filter="url(#5a4d356582)"
              transform="matrix(1.300725, 0, 0, 1.300205, 52.873364, 28.809665)"
            >
              <image
                x="0"
                y="0"
                width="207"
                xlinkHref="data:image/png;base64,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"
                height="244"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        </mask>
      </defs>
      <g clip-path="url(#baa8a1e992)">
        <g transform="matrix(1, 0, 0, 1, 0, 0)">
          <g clip-path="url(#8f39bbfe74)">
            <g clip-path="url(#9c01b3fe5e)">
              <g clip-path="url(#d836a248ea)">
                <rect
                  x="-82.5"
                  width="540"
                  fill="#ffffff"
                  height="539.999987"
                  y="-82.499998"
                  fill-opacity="1"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
      <g mask="url(#ec14ef2da6)">
        <g transform="matrix(1.300725, 0, 0, 1.300205, 52.873364, 28.809665)">
          <image
            x="0"
            y="0"
            width="207"
            xlinkHref="data:image/png;base64,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"
            height="244"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </svg>
  );
};
