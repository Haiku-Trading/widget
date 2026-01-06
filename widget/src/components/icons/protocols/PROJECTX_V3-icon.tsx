import React from "react";

interface ProjectXV3IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const ProjectXV3Icon: React.FC<ProjectXV3IconProps> = ({
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
      viewBox="0 0 36 36.000001"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      {...props}
    >
      <defs>
        <filter x="0%" y="0%" width="100%" height="100%" id="85ec08bc37">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <filter x="0%" y="0%" width="100%" height="100%" id="baac1d1f79">
          <feColorMatrix
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
            colorInterpolationFilters="sRGB"
          />
        </filter>
        <clipPath id="0261f2b4fa">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="2d152648ab">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="44c506d891">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="9e8daa1969">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="be6a015405">
          <rect x="0" width="36" y="0" height="36" />
        </clipPath>
        <clipPath id="4c163b4385">
          <path
            d="M 4 4 L 31.71875 4 L 31.71875 31 L 4 31 Z M 4 4 "
            clipRule="nonzero"
          />
        </clipPath>
        <mask id="5131c7a197">
          <g filter="url(#85ec08bc37)">
            <g
              filter="url(#baac1d1f79)"
              transform="matrix(0.173311, 0, 0, 0.173311, 3.989188, 3.502705)"
            >
              <image
                x="0"
                y="0"
                width="160"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAAAAACupDjxAAAAAmJLR0QA/4ePzL8AAARfSURBVHic7ZvPbhxFEMa/6pldO7trC4gjJEsR3CIOeRdeglfIBQ5IPAe5cOICRwTiyI1nyAWEACnijyPb693t/jjMODg7Pdlyd3tmZdXPJ6+6u76p7qnpmq4BDMMwDMMwDMMwDMMwDMMwjDRE18zFfw4ZnUmd6X1H58H68w/WgBOAzR8ZQqgvvvhLdvlB+PDTOScigtdNCXD245c7++o5+INRnvTN/f84PIn3/WZ3XwCodQr/fX/VGY7V0mOnE4hwceg7E+UPznWWlQId6u5iEJULgMrFFpKys1KgRFbrbVbQdmd9X+V1pCMQZSiLkyVQZ7qnUV4EVhvJ8o6GPA8WbRYnbw3mmC47xeOhFNgTFgZ43g/hwfhlKC8uz4N33lcrcLwZzl6D6RqHuIuH2BTrNwuJ7QTRvYx6SJ1A9fO+61KPCz9R9o6h9GCcjm53WgcRcY17CALu/MOshaAUGCIJHN2WZeF73z9eOhFpNhEEKAzVA0rg1pwSm6ICD6INDwRvJj5ycnTUbUZh5150qHSWdQL5YnopTT4XSLbumK+uthYd1+imHxDKL38ewk0qJ0KCFPDh7yUFrj6uiTbnbAwAwMT9vS2QsUSFoXr29cI750SuY6dUS13ar5ziM12znrgtOMN54q2SFAd5/b/aqKDadAZRoRS4PVrP6L3xUsDER3fZ7VbPQyNn611W4Fs8mErhDWtcCPdG4P57sDwmEGiDTCKFBfYJ2ReBvTr2RuC+e/AOEtGBpjidgcJMuvL0pCm6cy7/JEkX2HUKcdW3SR7Bg3I69STYbOIDAynrxzkZcJxEgcLTn06uAtv0kgwMAXL4qPhL62QPVo/mi8jP3BuBm8t5LMOUuMIxbhKJH4X1bVlTSY+Dd35C0pAsMO+AS8/9FTgUAwkcIWmyKW65vwJvdwSx94n7CE+SoSqb7q8HhyJ9ikuqeAvpHryVwnQz2v3gzThBQEh/G41t/crrUQht6ZtW4NZwAWsPIGisiAN8c/J1o7n24pQCZ5O2eoskA4O7XEwAUR5nBRzheAM4iEgzBmS1UvXVhfjJt09XIiIgQ2DwQfz0I8jl87Mpro8OG5qDsjZIkiDXi0+O8OvLKYM4J04AhkAef/VZwQLHyYtIhaLny3c0nY9/o490f160wPECm5vDERARTN79p9514OY2J3NIoLyZkW6mS51lpcAKrrMBJBDgd00TQdcNM1QfxyoDVKwZlVXKPRSt+pBYBabWhraSNE5G5956ju12Wbn8fakf7Cl9yfGgkgEKHHsEDlEapbHR2yYjfiRK6e07gAfLvxsv7cE4Wau/qAezth0j3iRZDDHFWZT14HjfHw3gwbx3EPq3/MlmGC86Uu7VlAI9fOSTIY0NAiGE7idDddkCxwVip3Dzand6K3QPIgupig4YQSfQ//D0KmwCQCIwQJxzjrPlK81HV6++m4Xa+/Zgr6kyqzH7ecQ7b2yGen9uGIZhGIZhGIZhGIZhGIZhZPEfWMCpVWRagUYAAAAASUVORK5CYII="
                height="160"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        </mask>
      </defs>
      <g clipPath="url(#0261f2b4fa)">
        <g clipPath="url(#2d152648ab)">
          <g transform="matrix(1, 0, 0, 1, 0.000000000000000056, 0.000000000000010582)">
            <g clipPath="url(#be6a015405)">
              <g clipPath="url(#44c506d891)">
                <g clipPath="url(#9e8daa1969)">
                  <path
                    fill="#ffffff"
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
      <g clipPath="url(#4c163b4385)">
        <g mask="url(#5131c7a197)">
          <g transform="matrix(0.173311, 0, 0, 0.173311, 3.989188, 3.502705)">
            <image
              x="0"
              y="0"
              width="160"
              xlinkHref="data:image/png;base64,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"
              height="160"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
