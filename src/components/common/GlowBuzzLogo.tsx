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
  const iconSize = { sm: 30, md: 38, lg: 48, xl: 64 }[size];

  const textSizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Mismo ícono GB que la app de usuarias */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect x="5" y="14" width="90" height="82" rx="26" fill="#B82E5F" />
        <rect x="18" y="27" width="64" height="2.5" rx="1.25" fill="#FFF8F3" fillOpacity="0.4" />
        <rect x="26" y="2" width="10" height="18" rx="5" fill="#571C31" />
        <rect x="64" y="2" width="10" height="18" rx="5" fill="#571C31" />
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fill="#FFF8F3"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="-0.04em"
        >
          GB
        </text>
        <circle cx="73" cy="74" r="5" fill="#FFF8F3" />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight ${textSizeClass}`} style={{ letterSpacing: '-0.02em' }}>
            <span className="text-[#B82E5F]">Glow</span>
            <span className="text-[#571C31]">Buzz</span>
          </div>
          {showBusinessBadge && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#571C31]/70 mt-0.5">
              Business
            </span>
          )}
        </div>
      )}
    </div>
  );
};
