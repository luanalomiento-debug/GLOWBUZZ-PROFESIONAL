import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { GlowBuzzLogo } from '../common/GlowBuzzLogo';
import {
  Menu,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { setCurrentSection } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="md:hidden h-16 border-b border-[#571C31]/10 bg-white/90 backdrop-blur-xs sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Solo móvil: menú y logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#571C31] hover:bg-[#F5DCE5]/40 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentSection('home')}
              aria-label="Ir al inicio"
              className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B82E5F]"
            >
              <GlowBuzzLogo size="sm" showBusinessBadge={false} />
            </button>
          </div>

        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
