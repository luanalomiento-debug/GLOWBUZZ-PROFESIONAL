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
  const {
    currentSection,
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Inicio', subtitle: 'Resumen de actividad y rendimiento de tu perfil.' },
    profile: { title: 'Mi perfil', subtitle: 'Editá cómo te descubren y conocen las clientas en Glow Buzz.' },
    content: { title: 'Contenido & Portfolio', subtitle: 'Tu vidriera visual de trabajos propios y resultados de clientas.' },
    bookings: { title: 'Reservas', subtitle: 'Historial y gestión de citas generadas por Glow Buzz.' },
    agenda: { title: 'Agenda', subtitle: 'Organizá tus turnos o integrá tu software habitual.' },
    clients: { title: 'Clientas', subtitle: 'Directorio simplificado de clientas y recurrencia.' },
    reviews: { title: 'Reseñas & Reputación', subtitle: 'Opiniones verificadas que construyen confianza.' },
    stats: { title: 'Estadísticas & Métricas', subtitle: 'Embudo de descubrimiento, interés y conversión.' },
    team: { title: 'Equipo', subtitle: 'Profesionales y colaboradoras de tu negocio.' },
    boost: { title: 'Glow Boost', subtitle: 'Promocioná tus mejores trabajos para llegar a más clientas.' },
    billing: { title: 'Plan y facturación', subtitle: 'Administrá tu suscripción, prueba y retorno de inversión.' },
    settings: { title: 'Configuración', subtitle: 'Ajustes generales de tu cuenta y preferencias.' },
  };

  const currentInfo = sectionTitles[currentSection] || {
    title: 'Panel de negocio',
    subtitle: 'Glow Buzz Business',
  };

  return (
    <div className="min-h-screen bg-[#FFF8F9] flex">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#571C31]/10 bg-[#FFF8F9]/90 backdrop-blur-xs sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left section: mobile hamburger & page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#571C31] hover:bg-[#F5DCE5]/40 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <h1 className=" text-base sm:text-lg font-bold text-[#181416] tracking-tight">
                {currentInfo.title}
              </h1>
            </div>

            <div className="sm:hidden">
              <GlowBuzzLogo size="sm" showBusinessBadge={false} />
            </div>
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
