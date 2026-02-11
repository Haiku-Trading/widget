import React from 'react'

interface ErrorIconProps extends React.SVGProps<SVGSVGElement> {}

export const ErrorIcon: React.FC<ErrorIconProps> = (props) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

<path d="M8.00049 7.99991V10.6666M8.00049 13.3332H8.00715M7.07737 4.59439L1.59411 14.0655C1.28997 14.5908 1.1379 14.8535 1.16038 15.069C1.17998 15.2571 1.2785 15.4279 1.4314 15.5391C1.60671 15.6666 1.91022 15.6666 2.51723 15.6666H13.4837C14.0908 15.6666 14.3943 15.6666 14.5696 15.5391C14.7225 15.4279 14.821 15.2571 14.8406 15.069C14.8631 14.8535 14.711 14.5908 14.4069 14.0655L8.92361 4.59439C8.62056 4.07095 8.46904 3.80923 8.27135 3.72132C8.09892 3.64465 7.90206 3.64465 7.72962 3.72132C7.53194 3.80923 7.38041 4.07095 7.07737 4.59439Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

    </svg>
  )
}
