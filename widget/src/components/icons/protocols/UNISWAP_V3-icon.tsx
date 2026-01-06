import React from "react";

interface UniswapV3IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const UniswapV3Icon: React.FC<UniswapV3IconProps> = ({
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
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={inlineStyle ? { ...props.style, ...inlineStyle } : props.style}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Placeholder SVG - Replace with actual UNISWAP_V3 logo */}
      <rect width="32" height="32" rx="16" fill="#E5E7EB" />
      <text
        x="16"
        y="20"
        fontSize="10"
        fontWeight="bold"
        fill="#6B7280"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
      >
        UNI V3
      </text>
    </svg>
  );
};

