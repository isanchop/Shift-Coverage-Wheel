import React, { FC, SVGProps } from 'react';

export const MorningIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 18h18M6 18a6 5 0 0 1 12 0m-6-9.5v2m6.5.5-1.3 1.3M5.5 11l1.3 1.3" />
  </svg>
);

export const AfternoonIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 3v2" />
    <path d="M21 12h-2" />
    <path d="M12 21v-2" />
    <path d="M5 12H3" />
    <path d="M18.364 5.636 16.95 7.05" />
    <path d="M18.364 18.364 16.95 16.95" />
    <path d="M5.636 18.364 7.05 16.95" />
    <path d="M5.636 5.636 7.05 7.05" />
  </svg>
);

export const NightIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 12a8 8 0 1 1-8-8 6 6 0 0 0 8 8" />
  </svg>
);
