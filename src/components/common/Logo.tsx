import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  white?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  white = false,
}) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 30;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Professional Shield Logo with Integrated Pulse Symbol */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-lg ${
          white ? 'bg-white/10 text-white' : 'bg-slate-900 text-teal-400'
        }`}
        style={{ width: iconSize + 8, height: iconSize + 8 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Shield Outline & Subtle Fill */}
          <path
            d="M16 3L6 7.5V14.5C6 21.2 10.3 27.2 16 29C21.7 27.2 26 21.2 26 14.5V7.5L16 3Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.12"
          />
          {/* Integrated Pulse / EKG Wave across the shield center */}
          <path
            d="M8.5 16H12.5L14.2 11.5L17.8 20.5L19.5 16H23.5"
            stroke={white ? '#FFFFFF' : '#2DD4BF'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Small Rx cross dot in upper right corner of shield */}
          <circle cx="21" cy="9.5" r="1.2" fill={white ? '#38BDF8' : '#2DD4BF'} />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-bold tracking-tight ${textSize} ${
              white ? 'text-white' : 'text-slate-900'
            }`}
          >
            Rx<span className={white ? 'text-teal-300' : 'text-teal-600'}>Bridge</span>
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-xs mt-1 font-medium tracking-tight ${
              white ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            From refill stuck to refill resolved
          </span>
        )}
      </div>
    </div>
  );
};
