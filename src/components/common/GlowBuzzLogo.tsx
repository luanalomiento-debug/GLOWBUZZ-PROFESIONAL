import React from 'react';

interface GlowBuzzLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showBusinessBadge?: boolean;
  className?: string;
}

export const GlowBuzzLogo: React.FC<GlowBuzzLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showBusinessBadge = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: { w: 28, h: 32, fontSize: 10, ringH: 4, dotR: 2 },
    md: { w: 38, h: 44, fontSize: 13, ringH: 6, dotR: 2.5 },
    lg: { w: 48, h: 56, fontSize: 17, ringH: 7, dotR: 3.5 },
    xl: { w: 64, h: 74, fontSize: 22, ringH: 9, dotR: 4.5 },
  }[size];

  const textSizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Calendar Tile Monogram GB */}
      <div className="relative flex-shrink-0" style={{ width: iconDimensions.w, height: iconDimensions.h }}>
        <svg
          viewBox="0 0 44 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Top calendar rings */}
          <rect x="11" y="1" width="4.5" height="9" rx="2.25" fill="#571C31" />
          <rect x="28.5" y="1" width="4.5" height="9" rx="2.25" fill="#571C31" />

          {/* Calendar main tile body */}
          <rect x="2" y="5.5" width="40" height="42.5" rx="10" fill="#FFF8F3" stroke="#571C31" strokeWidth="2.5" />

          {/* Calendar header bar in Cherry */}
          <path
            d="M3.5 15.5C3.5 10 7.5 7 12 7H32C36.5 7 40.5 10 40.5 15.5V17.5H3.5V15.5Z"
            fill="#B82E5F"
          />

          {/* Reserved date dot on header bar */}
          <circle cx="34" cy="12.5" r="2.2" fill="#F5DCE5" />

          {/* Header divider line */}
          <line x1="3" y1="17.5" x2="41" y2="17.5" stroke="#571C31" strokeWidth="1.5" />

          {/* Monogram GB */}
          <text
            x="22"
            y="36"
            textAnchor="middle"
            fontFamily="'Unbounded', sans-serif"
            fontWeight="800"
            fontSize="15"
            letterSpacing="-0.5px"
            fill="#571C31"
          >
            GB
          </text>
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className={`font-['Unbounded'] font-extrabold tracking-tight ${textSizeClass}`}>
            <span className="text-[#B82E5F]">Glow</span>
            <span className="text-[#571C31]">Buzz</span>
          </div>
          {showBusinessBadge && (
            <span className="text-[10px] font-['Space_Grotesk'] font-semibold uppercase tracking-widest text-[#571C31]/70 mt-0.5">
              Business
            </span>
          )}
        </div>
      )}
    </div>
  );
};
