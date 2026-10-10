import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardSection } from '../../types';
import { GlowBuzzLogo } from '../common/GlowBuzzLogo';
import {
  Home,
  User,
  Image as ImageIcon,
  Calendar,
  Clock,
  Users,
  Star,
  BarChart3,
  UserCheck,
  Zap,
  CreditCard,
  Settings,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    currentSection,
    setCurrentSection,
    businessProfile,
    setPreviewAsClientModalOpen,
  } = useApp();

  const navigationItems: {
    id: DashboardSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { id: 'profile', label: 'Mi perfil', icon: <User className="w-4 h-4" /> },
    { id: 'content', label: 'Contenido', icon: <ImageIcon className="w-4 h-4" />, badge: 'Feed' },
    { id: 'bookings', label: 'Reservas', icon: <Calendar className="w-4 h-4" /> },
    { id: 'agenda', label: 'Agenda', icon: <Clock className="w-4 h-4" /> },
    { id: 'clients', label: 'Clientas', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reseñas', icon: <Star className="w-4 h-4" />, badge: '4.8 ★' },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'team',
      label: 'Equipo',
      icon: <UserCheck className="w-4 h-4" />,
      badge: businessProfile.businessType === 'studio' ? '2' : undefined,
    },
    { id: 'boost', label: 'Glow Boost', icon: <Zap className="w-4 h-4" />, badge: 'Nuevo' },
    { id: 'billing', label: 'Plan y facturación', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (section: DashboardSection) => {
    setCurrentSection(section);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#FFF8F3] border-r border-[#571C31]/10 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-[#571C31]/10 flex items-center justify-between">
        <GlowBuzzLogo size="sm" />
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-[#571C31]/60 hover:text-[#571C31] p-1 rounded-lg"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Business Quick Card */}
      <div className="px-4 py-3 mx-3 my-3 rounded-2xl bg-white border border-[#571C31]/10 flex items-center gap-3">
        <img
          src={businessProfile.avatarUrl}
          alt={businessProfile.name}
          className="w-9 h-9 rounded-xl object-cover border border-[#B82E5F]/20 flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-['Space_Grotesk'] text-xs font-bold text-[#181416] truncate">
            {businessProfile.name}
          </p>
          <p className="text-[11px] font-['Manrope'] text-[#571C31]/65 truncate">
            {businessProfile.location}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-['Space_Grotesk'] font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#B82E5F] text-[#FFF8F3] shadow-xs'
                  : 'text-[#571C31]/75 hover:text-[#571C31] hover:bg-[#F5DCE5]/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-[#571C31]/60'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F5DCE5] text-[#571C31]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Client Preview CTA */}
      <div className="p-4 border-t border-[#571C31]/10 bg-[#FFF8F3]/80">
        <button
          onClick={() => {
            setPreviewAsClientModalOpen(true);
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-[#F5DCE5]/50 border border-[#B82E5F]/30 text-[#B82E5F] text-xs font-['Space_Grotesk'] font-bold transition-all shadow-2xs"
        >
          <span>Ver como clienta</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-[#571C31]/50 font-['Manrope']">
            Glow Buzz Business v1.0
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block flex-shrink-0 sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* Mobile drawer sidebar */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#181416]/40 backdrop-blur-2xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
