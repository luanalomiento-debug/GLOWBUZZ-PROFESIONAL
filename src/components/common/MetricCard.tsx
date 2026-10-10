import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  locked?: boolean;
  badge?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  trend,
  icon,
  locked = false,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#571C31]/10 p-5 relative overflow-hidden transition-all duration-200 hover:border-[#B82E5F]/30 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <span className=" text-xs font-semibold text-[#571C31]/70 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-[#FFF8F9] text-[#B82E5F] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-700' : 'text-stone-500'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#571C31]/60 mt-1.5">{subtitle}</p>
      )}

      {badge && (
        <span className="inline-block mt-2 text-[10px] font-semibold text-[#B82E5F] bg-[#F5DCE5]/60 px-2 py-0.5 rounded-md">
          {badge}
        </span>
      )}

      {locked && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs font-bold text-[#571C31] bg-[#F5DCE5] px-2.5 py-1 rounded-lg">
            Disponible con Glow Boost
          </span>
        </div>
      )}
    </div>
  );
};
