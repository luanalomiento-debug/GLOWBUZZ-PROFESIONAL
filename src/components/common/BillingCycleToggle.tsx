import React from 'react';
import { BillingCycle } from '../../types';
import { ANNUAL_DISCOUNT_PERCENT } from '../../data/plans';

interface BillingCycleToggleProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

/** Selector Mensual / Anual para comparar el precio de los planes. */
export const BillingCycleToggle: React.FC<BillingCycleToggleProps> = ({ value, onChange }) => {
  const options: { id: BillingCycle; label: string }[] = [
    { id: 'monthly', label: 'Mensual' },
    { id: 'annual', label: 'Anual' },
  ];

  return (
    <div
      role="group"
      aria-label="Frecuencia de pago"
      className="inline-flex items-center p-1 rounded-full bg-[#F5DCE5]/50 border border-[#571C31]/10"
    >
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isActive ? 'bg-white text-[#571C31] shadow-sm' : 'text-[#571C31]/70 hover:text-[#571C31]'
            }`}
          >
            {option.label}
            {option.id === 'annual' && (
              <span className="text-[10px] font-bold text-[#B82E5F] bg-[#F5DCE5] px-1.5 py-0.5 rounded-full">
                -{ANNUAL_DISCOUNT_PERCENT}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
