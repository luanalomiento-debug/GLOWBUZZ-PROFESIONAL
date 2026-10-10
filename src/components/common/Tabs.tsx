import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  badge?: string;
}

interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`flex items-center gap-1 border-b border-[#571C31]/10 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-3.5 sm:px-4 text-sm font-['Space_Grotesk'] font-semibold whitespace-nowrap transition-all duration-150 border-b-2 -mb-px select-none ${
              isActive
                ? 'border-[#B82E5F] text-[#B82E5F]'
                : 'border-transparent text-[#571C31]/60 hover:text-[#571C31] hover:border-[#571C31]/20'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-[#F5DCE5] text-[#571C31]'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[10px] bg-[#B82E5F] text-white px-1.5 py-0.5 rounded-sm">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
