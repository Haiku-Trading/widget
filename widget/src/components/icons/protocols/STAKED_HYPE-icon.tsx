import React from "react";

interface StakedHypeIconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const StakedHypeIcon: React.FC<StakedHypeIconProps> = ({
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
      zoomAndPan="magnify"
      viewBox="0 0 36 36.000001"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={inlineStyle ? { ...props.style, ...inlineStyle } : props.style}
      {...props}
    >
      <defs>
        <filter x="0%" y="0%" width="100%" height="100%" id="37b6243708">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <filter x="0%" y="0%" width="100%" height="100%" id="7e71170191">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <clipPath id="682b026da2">
          <path
            d="M 0.488281 0.292969 L 35.21875 0.292969 L 35.21875 35.027344 L 0.488281 35.027344 Z M 0.488281 0.292969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="5a929054f3">
          <path
            d="M 17.851562 0.292969 C 8.261719 0.292969 0.488281 8.070312 0.488281 17.660156 C 0.488281 27.25 8.261719 35.027344 17.851562 35.027344 C 27.445312 35.027344 35.21875 27.25 35.21875 17.660156 C 35.21875 8.070312 27.445312 0.292969 17.851562 0.292969 Z M 17.851562 0.292969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="56dd4f9257">
          <path
            d="M 0.488281 0.292969 L 35.21875 0.292969 L 35.21875 35.027344 L 0.488281 35.027344 Z M 0.488281 0.292969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="37332365f0">
          <path
            d="M 17.851562 0.292969 C 8.261719 0.292969 0.488281 8.070312 0.488281 17.660156 C 0.488281 27.25 8.261719 35.027344 17.851562 35.027344 C 27.445312 35.027344 35.21875 27.25 35.21875 17.660156 C 35.21875 8.070312 27.445312 0.292969 17.851562 0.292969 Z M 17.851562 0.292969 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="1cf7d6e6bf">
          <rect x="0" width="36" y="0" height="36" />
        </clipPath>
        <clipPath id="7a22b3be4e">
          <path
            d="M 4 6 L 31.71875 6 L 31.71875 29.773438 L 4 29.773438 Z M 4 6 "
            clipRule="nonzero"
          />
        </clipPath>
        <mask id="2e7e440a29">
          <g filter="url(#37b6243708)">
            <g
              filter="url(#7e71170191)"
              transform="matrix(0.288851, 0, 0, 0.293672, 3.989189, 5.692769)"
            >
              <image
                x="0"
                y="0"
                width="96"
                xlinkHref="data:image/png;base64,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"
                height="82"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        </mask>
      </defs>
      <g clipPath="url(#682b026da2)">
        <g clipPath="url(#5a929054f3)">
          <g transform="matrix(1, 0, 0, 1, 0.000000000000000056, 0.000000000000010575)">
            <g clipPath="url(#1cf7d6e6bf)">
              <g clipPath="url(#56dd4f9257)">
                <g clipPath="url(#37332365f0)">
                  <path
                    fill="#ffffff"
                    d="M 0.488281 0.292969 L 35.21875 0.292969 L 35.21875 35.027344 L 0.488281 35.027344 Z M 0.488281 0.292969 "
                    fill-opacity="1"
                    fill-rule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#7a22b3be4e)">
        <g mask="url(#2e7e440a29)">
          <g transform="matrix(0.288851, 0, 0, 0.293672, 3.989189, 5.692769)">
            <image
              x="0"
              y="0"
              width="96"
              xlinkHref="data:image/png;base64,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"
              height="82"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
