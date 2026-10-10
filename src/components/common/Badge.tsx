import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cherry' | 'bordo' | 'blush' | 'neutral' | 'success' | 'warning' | 'sponsored';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    cherry: 'bg-[#B82E5F]/10 text-[#B82E5F] border-[#B82E5F]/20',
    bordo: 'bg-[#571C31]/10 text-[#571C31] border-[#571C31]/20',
    blush: 'bg-[#F5DCE5] text-[#571C31] border-[#eecad6]',
    neutral: 'bg-stone-100 text-[#181416]/80 border-stone-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    sponsored: 'bg-[#FFF8F3] text-[#B82E5F] border-[#B82E5F]/40 font-bold uppercase tracking-wider',
  }[variant];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium border select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
