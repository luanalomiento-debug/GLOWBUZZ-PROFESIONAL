import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Button } from '../common/Button';
import { GlowBuzzLogo } from '../common/GlowBuzzLogo';
import {
  Menu,
  Eye,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    businessProfile,
    currentSection,
    setPreviewAsClientModalOpen,
    restartOnboarding,
    resetAllDemoData,
  } = useApp();
  const { showToast } = useToast();
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

  const handleResetDemo = () => {
    resetAllDemoData();
    showToast('Datos reiniciados', 'Se cargaron los datos iniciales de Berna Studio.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] flex">
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#571C31]/10 bg-[#FFF8F3]/90 backdrop-blur-xs sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4">
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
              <h1 className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-[#181416] tracking-tight">
                {currentInfo.title}
              </h1>
            </div>

            <div className="sm:hidden">
              <GlowBuzzLogo size="sm" showBusinessBadge={false} />
            </div>
          </div>

          {/* Right section: Plan badge, Ver como clienta, and Demo switches */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Plan Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5DCE5] border border-[#B82E5F]/20 text-[11px] font-['Space_Grotesk'] font-bold text-[#571C31]">
              <Sparkles className="w-3.5 h-3.5 text-[#B82E5F]" />
              <span>
                {businessProfile.plan === 'pro' ? 'Glow Pro' : 'Glow Start'}
              </span>
              <span className="text-[#571C31]/60 font-normal">
                · {businessProfile.trialDaysLeft}d de prueba
              </span>
            </div>

            {/* Ver como clienta CTA */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewAsClientModalOpen(true)}
              leftIcon={<Eye className="w-3.5 h-3.5 text-[#B82E5F]" />}
              className="hidden sm:inline-flex"
            >
              Ver como clienta
            </Button>

            {/* Quick Demo Utilities for university defense */}
            <div className="flex items-center gap-1 border-l border-[#571C31]/10 pl-2 sm:pl-3">
              <button
                onClick={restartOnboarding}
                title="Reiniciar Onboarding (para probar el flujo inicial)"
                className="text-[11px] font-['Space_Grotesk'] font-semibold text-[#571C31]/70 hover:text-[#B82E5F] hover:bg-[#F5DCE5]/40 px-2 py-1 rounded-lg transition-colors"
              >
                Probar Onboarding
              </button>
              <button
                onClick={handleResetDemo}
                title="Reiniciar datos demo a Berna Studio"
                className="p-1.5 text-[#571C31]/50 hover:text-[#571C31] hover:bg-[#F5DCE5]/40 rounded-lg transition-colors"
                aria-label="Reiniciar datos demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
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
