import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`${/(^|\s)bg-/.test(className) ? '' : 'bg-white'} rounded-2xl border border-[#571C31]/10 p-5 shadow-soft transition-all duration-200 ${
        hoverable ? 'hover:border-[#B82E5F]/30 hover:shadow-lifted cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
