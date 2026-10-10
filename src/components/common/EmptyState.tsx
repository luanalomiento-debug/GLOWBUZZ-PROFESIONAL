import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#571C31]/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/15 text-[#B82E5F] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h4 className=" text-lg font-bold text-[#181416] tracking-tight mb-2">
        {title}
      </h4>
      <p className=" text-sm text-[#571C31]/75 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
