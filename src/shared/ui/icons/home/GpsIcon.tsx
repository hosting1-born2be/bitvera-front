import type { SVGProps } from 'react';

export const GpsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <path
        d="M20 32.5C26.9036 32.5 32.5 26.9036 32.5 20C32.5 13.0964 26.9036 7.5 20 7.5C13.0964 7.5 7.5 13.0964 7.5 20C7.5 26.9036 13.0964 32.5 20 32.5Z"
        stroke="#767676"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 25C22.7614 25 25 22.7614 25 20C25 17.2386 22.7614 15 20 15C17.2386 15 15 17.2386 15 20C15 22.7614 17.2386 25 20 25Z"
        stroke="#FF4500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 6.66671V3.33337"
        stroke="#FF4500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66732 20H3.33398"
        stroke="#FF4500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 33.3334V36.6667"
        stroke="#FF4500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.334 20H36.6673"
        stroke="#FF4500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
