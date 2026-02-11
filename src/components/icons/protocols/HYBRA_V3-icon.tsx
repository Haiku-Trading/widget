import React from "react";

interface HybraV3IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const HybraV3Icon: React.FC<HybraV3IconProps> = ({
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
        <filter x="0%" y="0%" width="100%" height="100%" id="ce630d91f4">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <filter x="0%" y="0%" width="100%" height="100%" id="c6b2401c53">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <clipPath id="e0aa2dce39">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="bf4581351a">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="c1b85a1b64">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="dffadd5254">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b5945e9589">
          <rect x="0" width="36" y="0" height="36" />
        </clipPath>
        <clipPath id="ca0ffc0ab0">
          <path
            d="M 4 4 L 31.71875 4 L 31.71875 31 L 4 31 Z M 4 4 "
            clipRule="nonzero"
          />
        </clipPath>
        <mask id="83d8f4290f">
          <g filter="url(#ce630d91f4)">
            <g
              filter="url(#c6b2401c53)"
              transform="matrix(0.180063, 0, 0, 0.180063, 3.989188, 3.502705)"
            >
              <image
                x="0"
                y="0"
                width="154"
                xlinkHref="data:image/png;base64,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"
                height="154"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        </mask>
      </defs>
      <g clipPath="url(#e0aa2dce39)">
        <g clipPath="url(#bf4581351a)">
          <g transform="matrix(1, 0, 0, 1, 0.000000000000000056, 0.000000000000010582)">
            <g clipPath="url(#b5945e9589)">
              <g clipPath="url(#c1b85a1b64)">
                <g clipPath="url(#dffadd5254)">
                  <path
                    fill="#000000"
                    d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#ca0ffc0ab0)">
        <g mask="url(#83d8f4290f)">
          <g transform="matrix(0.180063, 0, 0, 0.180063, 3.989188, 3.502705)">
            <image
              x="0"
              y="0"
              width="154"
              xlinkHref="data:image/png;base64,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"
              height="154"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
