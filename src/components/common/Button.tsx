import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'blush' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-['Manrope'] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B82E5F] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      'bg-[#B82E5F] hover:bg-[#A02450] text-[#FFF8F3] shadow-xs hover:shadow-sm border border-[#B82E5F]',
    secondary:
      'bg-[#571C31] hover:bg-[#3E1222] text-[#FFF8F3] shadow-xs border border-[#571C31]',
    outline:
      'bg-transparent hover:bg-[#F5DCE5]/40 text-[#571C31] border border-[#571C31]/25 hover:border-[#571C31]/50',
    ghost:
      'bg-transparent hover:bg-[#F5DCE5]/30 text-[#571C31] border border-transparent',
    blush:
      'bg-[#F5DCE5] hover:bg-[#ebd0da] text-[#571C31] border border-[#F5DCE5]',
    danger:
      'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-5 py-3 rounded-xl gap-2.5',
  }[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
