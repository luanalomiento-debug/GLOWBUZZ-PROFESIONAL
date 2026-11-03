import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  BusinessProfile,
  Service,
  PortfolioWork,
  Booking,
  TeamMember,
  Client,
  Review,
  ExternalAgendaIntegration,
  GlowBoostCampaign,
  DashboardSection,
  PlanType,
} from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import type { User } from '@supabase/supabase-js';
import { buildEmptyProfile, EMPTY_INTEGRATIONS } from '../data/emptyState';
import {
  canPublish,
  fetchRemoteBookings,
  loadBusinessState,
  publishBusiness,
  saveBusinessState,
  type PersistedState,
} from '../lib/sync';
import { useToast } from './ToastContext';
import { deriveClients } from '../lib/clients';
import { LoadingScreen } from '../components/common/LoadingScreen';

interface AppContextType {
  // State
  businessProfile: BusinessProfile;
  services: Service[];
  portfolio: PortfolioWork[];
  bookings: Booking[];
  team: TeamMember[];
  clients: Client[];
  reviews: Review[];
  integrations: ExternalAgendaIntegration[];
  boostCampaigns: GlowBoostCampaign[];
  currentSection: DashboardSection;
  onboardingStep: number;
  previewAsClientModalOpen: boolean;

  // Checklist computation
  checklistProgress: {
    total: number;
    completed: number;
    tasks: {
      id: string;
      title: string;
      done: boolean;
      targetSection: DashboardSection;
    }[];
  };

  // Actions
  setCurrentSection: (section: DashboardSection) => void;
  setOnboardingStep: (step: number) => void;
  setPreviewAsClientModalOpen: (open: boolean) => void;

  updateProfile: (updates: Partial<BusinessProfile>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  addPortfolioWork: (work: Omit<PortfolioWork, 'id' | 'views' | 'saves' | 'bookings' | 'date'>) => void;
  toggleWorkAddedToProfile: (id: string) => void;
  approvePortfolioWork: (id: string) => void;
  deletePortfolioWork: (id: string) => void;

  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  publishReleasedSlot: (bookingId: string) => void;

  addTeamMember: (member: Omit<TeamMember, 'id' | 'totalReviews' | 'totalBookings' | 'activeAppointments' | 'portfolioCount'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;

  replyToReview: (id: string, reply: string) => void;
  sendReviewRequest: (clientName: string, serviceName: string) => void;

  toggleIntegration: (id: ExternalAgendaIntegration['id']) => void;

  activateBoost: (campaign: Omit<GlowBoostCampaign, 'id' | 'status' | 'createdAt'>) => void;

  switchPlan: (plan: PlanType) => void;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Copia local de los datos de cada cuenta (la fuente de verdad es Supabase). */
const storageKey = (userId: string, name: string): string => `glowbuzz_business:${userId}:${name}`;

export const AppProvider: React.FC<{ user: User; children: React.ReactNode }> = ({ user, children }) => {
  const userId = user.id;
  const meta = (user.user_metadata ?? {}) as { owner_name?: string; owner_last_name?: string; phone?: string };

  // Estado inicial: la copia local de esta cuenta o, si es nueva, todo vacío.
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() =>
    loadFromStorage(
      storageKey(userId, 'profile'),
      buildEmptyProfile(userId, {
        email: user.email ?? '',
        ownerName: meta.owner_name,
        ownerLastName: meta.owner_last_name,
        phone: meta.phone,
      })
    )
  );
  const [services, setServices] = useState<Service[]>(() => loadFromStorage(storageKey(userId, 'services'), []));
  const [portfolio, setPortfolio] = useState<PortfolioWork[]>(() => loadFromStorage(storageKey(userId, 'portfolio'), []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage(storageKey(userId, 'bookings'), []));
  const [team, setTeam] = useState<TeamMember[]>(() => loadFromStorage(storageKey(userId, 'team'), []));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage(storageKey(userId, 'reviews'), []));
  const [integrations, setIntegrations] = useState<ExternalAgendaIntegration[]>(() =>
    loadFromStorage(storageKey(userId, 'integrations'), EMPTY_INTEGRATIONS)
  );
  const [boostCampaigns, setBoostCampaigns] = useState<GlowBoostCampaign[]>(() =>
    loadFromStorage(storageKey(userId, 'boost'), [])
  );

  const [currentSection, setCurrentSection] = useState<DashboardSection>('home');
  const [onboardingStep, setOnboardingStep] = useState<number>(3);
  const [previewAsClientModalOpen, setPreviewAsClientModalOpen] = useState<boolean>(false);

  // --- Datos de la cuenta: copia local + Supabase ---
  const { showToast } = useToast();
  const [hydrated, setHydrated] = useState(false);

  // Las clientas salen de las reservas: no hay que cargarlas a mano.
  const clients = useMemo(() => deriveClients(bookings), [bookings]);
  const bookingsRef = useRef(bookings);
  bookingsRef.current = bookings;

  // Copia local (rápida y sirve sin conexión).
  useEffect(() => saveToStorage(storageKey(userId, 'profile'), businessProfile), [userId, businessProfile]);
  useEffect(() => saveToStorage(storageKey(userId, 'services'), services), [userId, services]);
  useEffect(() => saveToStorage(storageKey(userId, 'portfolio'), portfolio), [userId, portfolio]);
  useEffect(() => saveToStorage(storageKey(userId, 'bookings'), bookings), [userId, bookings]);
  useEffect(() => saveToStorage(storageKey(userId, 'team'), team), [userId, team]);
  useEffect(() => saveToStorage(storageKey(userId, 'reviews'), reviews), [userId, reviews]);
  useEffect(() => saveToStorage(storageKey(userId, 'integrations'), integrations), [userId, integrations]);
  useEffect(() => saveToStorage(storageKey(userId, 'boost'), boostCampaigns), [userId, boostCampaigns]);

  // Al entrar: se trae lo guardado en la cuenta (así se ve igual desde cualquier dispositivo).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [saved, remoteBookings] = await Promise.all([loadBusinessState(userId), fetchRemoteBookings(userId)]);
      if (cancelled) return;
      if (saved.ok && saved.state) {
        const st = saved.state;
        if (st.businessProfile) setBusinessProfile({ ...buildEmptyProfile(userId, { email: user.email ?? '' }), ...st.businessProfile, email: user.email ?? st.businessProfile.email });
        if (st.services) setServices(st.services);
        if (st.portfolio) setPortfolio(st.portfolio);
        if (st.team) setTeam(st.team as TeamMember[]);
        if (st.reviews) setReviews(st.reviews);
        if (st.integrations) setIntegrations(st.integrations as ExternalAgendaIntegration[]);
        if (st.boostCampaigns) setBoostCampaigns(st.boostCampaigns as GlowBoostCampaign[]);
      }
      if (remoteBookings) {
        // Las reservas de la base mandan; se conservan las locales que todavía no se subieron.
        setBookings((local) => {
          const remoteIds = new Set(remoteBookings.map((b) => b.id));
          return [...remoteBookings, ...local.filter((b) => !remoteIds.has(b.id))];
        });
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Guarda en la cuenta y publica el catálogo poco después de cada cambio.
  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      void saveBusinessState(userId, { businessProfile, services, portfolio, team, reviews, integrations, boostCampaigns });
      if (businessProfile.onboardingCompleted && canPublish()) {
        void publishBusiness({ userId, profile: businessProfile, services, portfolio, bookings, reviews });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [hydrated, userId, businessProfile, services, portfolio, team, reviews, integrations, boostCampaigns, bookings]);

  // Trae las reservas nuevas que hacen las usuarias.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const pull = async () => {
      const remote = await fetchRemoteBookings(userId);
      if (!remote || cancelled) return;
      const known = new Set(bookingsRef.current.map((b) => b.id));
      const fresh = remote.filter((b) => !known.has(b.id));
      if (fresh.length === 0) return;
      setBookings((prev) => {
        const ids = new Set(prev.map((b) => b.id));
        return [...fresh.filter((b) => !ids.has(b.id)), ...prev];
      });
      if (fresh.length === 1) {
        const [b] = fresh;
        showToast('Nueva reserva desde GlowBuzz', `${b.clientName} reservó ${b.serviceName} · ${b.date} ${b.time} hs`, 'success');
      } else {
        showToast('Nuevas reservas desde GlowBuzz', `Llegaron ${fresh.length} reservas nuevas.`, 'success');
      }
    };
    const interval = setInterval(pull, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, userId]);

  // Profile actions
  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...updates }));
  };

  // Service actions
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: `srv_${Date.now()}`,
    };
    setServices((prev) => [newService, ...prev]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, ...updates } : srv))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((srv) => srv.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, active: !srv.active } : srv))
    );
  };

  // Portfolio actions
  const addPortfolioWork = (workData: Omit<PortfolioWork, 'id' | 'views' | 'saves' | 'bookings' | 'date'>) => {
    const newWork: PortfolioWork = {
      ...workData,
      id: `work_${Date.now()}`,
      views: 120,
      saves: 18,
      bookings: 2,
      date: new Date().toISOString().split('T')[0],
    };
    setPortfolio((prev) => [newWork, ...prev]);
  };

  const toggleWorkAddedToProfile = (id: string) => {
    setPortfolio((prev) =>
      prev.map((work) =>
        work.id === id ? { ...work, addedToProfile: !work.addedToProfile } : work
      )
    );
  };

  const approvePortfolioWork = (id: string) => {
    setPortfolio((prev) =>
      prev.map((work) =>
        work.id === id ? { ...work, status: 'approved', addedToProfile: true } : work
      )
    );
  };

  const deletePortfolioWork = (id: string) => {
    setPortfolio((prev) => prev.filter((work) => work.id !== id));
  };

  // Bookings actions
  const addBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now()}`,
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
  };

  const publishReleasedSlot = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, releasedSlotPublished: true } : b))
    );
  };

  // Team actions
  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'totalReviews' | 'totalBookings' | 'activeAppointments' | 'portfolioCount'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `team_${Date.now()}`,
      totalReviews: 0,
      totalBookings: 0,
      activeAppointments: 0,
      portfolioCount: 0,
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  // Reviews actions
  const replyToReview = (id: string, reply: string) => {
    setReviews((prev) =>
      prev.map((rev) => (rev.id === id ? { ...rev, reply } : rev))
    );
  };

  const sendReviewRequest = (clientName: string, serviceName: string) => {
    // In demo, we add a notification and keep state
    console.log(`Solicitud de reseña enviada a ${clientName} para ${serviceName}`);
  };

  // Integrations actions
  const toggleIntegration = (id: ExternalAgendaIntegration['id']) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              connected: !item.connected,
              lastSync: !item.connected ? 'Hace 1 min' : null,
            }
          : item
      )
    );
  };

  // Boost action
  const activateBoost = (campaignData: Omit<GlowBoostCampaign, 'id' | 'status' | 'createdAt'>) => {
    const newCampaign: GlowBoostCampaign = {
      ...campaignData,
      id: `boost_${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBoostCampaigns((prev) => [newCampaign, ...prev]);
  };

  // Plan action
  const switchPlan = (plan: PlanType) => {
    setBusinessProfile((prev) => ({ ...prev, plan }));
  };

  const completeOnboarding = () => {
    setBusinessProfile((prev) => ({ ...prev, onboardingCompleted: true }));
    // La dueña es la primera profesional del equipo: los servicios y turnos se asignan a alguien.
    setTeam((prev) =>
      prev.length > 0
        ? prev
        : [
            {
              id: `team_${userId}`,
              name: businessProfile.ownerName || 'Profesional',
              role: 'Administrador',
              specialty: businessProfile.categories[0] ?? 'Profesional',
              avatarUrl: '',
              services: [],
              rating: 0,
              totalReviews: 0,
              totalBookings: 0,
              activeAppointments: 0,
              portfolioCount: 0,
              schedule: 'Según el horario del negocio',
            },
          ]
    );
    setCurrentSection('home');
  };

  // Compute Home checklist items automatically based on real app data
  const checklistProgress = useMemo(() => {
    const hasProfile = Boolean(
      businessProfile.description &&
      businessProfile.location &&
      businessProfile.categories.length > 0 &&
      businessProfile.instagram
    );
    const hasServices = services.length >= 2;
    const hasPortfolio = portfolio.filter((p) => p.source === 'my_work').length >= 2;
    const hasAgendaConfig =
      businessProfile.hours.some((h) => h.active) ||
      integrations.some((i) => i.connected);
    const hasTeam =
      businessProfile.businessType === 'independent' ? true : team.length >= 1;

    const tasks = [
      {
        id: 'account',
        title: 'Crear cuenta',
        done: true,
        targetSection: 'home' as DashboardSection,
      },
      {
        id: 'profile',
        title: 'Completar perfil',
        done: hasProfile,
        targetSection: 'profile' as DashboardSection,
      },
      {
        id: 'services',
        title: 'Agregar servicios y precios',
        done: hasServices,
        targetSection: 'profile' as DashboardSection,
      },
      {
        id: 'portfolio',
        title: 'Subir tus primeros trabajos',
        done: hasPortfolio,
        targetSection: 'content' as DashboardSection,
      },
      {
        id: 'agenda',
        title: 'Configurar agenda',
        done: hasAgendaConfig,
        targetSection: 'agenda' as DashboardSection,
      },
      {
        id: 'team',
        title: 'Agregar equipo',
        done: hasTeam,
        targetSection: 'team' as DashboardSection,
      },
    ];

    const completed = tasks.filter((t) => t.done).length;
    return {
      total: tasks.length,
      completed,
      tasks,
    };
  }, [businessProfile, services, portfolio, integrations, team]);

  return (
    <AppContext.Provider
      value={{
        businessProfile,
        services,
        portfolio,
        bookings,
        team,
        clients,
        reviews,
        integrations,
        boostCampaigns,
        currentSection,
        onboardingStep,
        previewAsClientModalOpen,
        checklistProgress,
        setCurrentSection,
        setOnboardingStep,
        setPreviewAsClientModalOpen,
        updateProfile,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        addPortfolioWork,
        toggleWorkAddedToProfile,
        approvePortfolioWork,
        deletePortfolioWork,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        publishReleasedSlot,
        addTeamMember,
        updateTeamMember,
        replyToReview,
        sendReviewRequest,
        toggleIntegration,
        activateBoost,
        switchPlan,
        completeOnboarding,
      }}
    >
      {hydrated ? children : <LoadingScreen />}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
