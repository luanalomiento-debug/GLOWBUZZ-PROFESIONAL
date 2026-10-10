import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_SERVICES,
  INITIAL_TEAM,
  INITIAL_PORTFOLIO,
  INITIAL_BOOKINGS,
  INITIAL_CLIENTS,
  INITIAL_REVIEWS,
  INITIAL_INTEGRATIONS,
  INITIAL_BOOST_CAMPAIGNS,
} from '../data/initialData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { PLANS } from '../data/plans';

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
  restartOnboarding: () => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'glowbuzz_business_profile_v1',
  SERVICES: 'glowbuzz_services_v1',
  PORTFOLIO: 'glowbuzz_portfolio_v1',
  BOOKINGS: 'glowbuzz_bookings_v1',
  TEAM: 'glowbuzz_team_v1',
  CLIENTS: 'glowbuzz_clients_v1',
  REVIEWS: 'glowbuzz_reviews_v1',
  INTEGRATIONS: 'glowbuzz_integrations_v1',
  BOOST: 'glowbuzz_boost_v1',
};

/** Las fotos de ejemplo viejas eran enlaces externos; las nuevas están en /images. */
const isLegacyImage = (value: unknown): boolean =>
  typeof value === 'string' && value.includes('images.unsplash.com');

/**
 * Datos guardados antes del cambio de fotos: reemplaza solo las imágenes viejas por las de los datos
 * iniciales (mismo id) y conserva todo lo que la usuaria haya editado.
 */
const refreshLegacyImages = <T extends { id: string }>(stored: T[], initial: T[], fields: (keyof T)[]): T[] =>
  stored.map((item) => {
    const base = initial.find((candidate) => candidate.id === item.id);
    if (!base) return item;
    const patch: Partial<T> = {};
    fields.forEach((field) => {
      if (isLegacyImage(item[field])) patch[field] = base[field];
    });
    return { ...item, ...patch };
  });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const stored = loadFromStorage<BusinessProfile>(STORAGE_KEYS.PROFILE, INITIAL_BUSINESS_PROFILE);
    // Migración: el antiguo plan 'pro' pasa a ser Glow Boost; cualquier valor desconocido vuelve a Glow Start.
    const plan = (stored.plan as string) === 'pro' ? 'boost' : stored.plan;
    const billingCycle = stored.billingCycle === 'annual' ? 'annual' : 'monthly';
    const images = {
      avatarUrl: isLegacyImage(stored.avatarUrl) ? INITIAL_BUSINESS_PROFILE.avatarUrl : stored.avatarUrl,
      coverUrl: isLegacyImage(stored.coverUrl) ? INITIAL_BUSINESS_PROFILE.coverUrl : stored.coverUrl,
    };
    return PLANS.some((p) => p.id === plan)
      ? { ...stored, ...images, plan, billingCycle }
      : { ...stored, ...images, plan: 'start', billingCycle };
  });

  const [services, setServices] = useState<Service[]>(() =>
    loadFromStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
  );

  const [portfolio, setPortfolio] = useState<PortfolioWork[]>(() =>
    refreshLegacyImages(loadFromStorage(STORAGE_KEYS.PORTFOLIO, INITIAL_PORTFOLIO), INITIAL_PORTFOLIO, ['imageUrl'])
  );

  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadFromStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );

  const [team, setTeam] = useState<TeamMember[]>(() =>
    refreshLegacyImages(loadFromStorage(STORAGE_KEYS.TEAM, INITIAL_TEAM), INITIAL_TEAM, ['avatarUrl'])
  );

  const [clients, setClients] = useState<Client[]>(() =>
    refreshLegacyImages(loadFromStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS), INITIAL_CLIENTS, ['avatarUrl'])
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    refreshLegacyImages(loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS), INITIAL_REVIEWS, ['clientAvatar', 'clientPhotoUrl'])
  );

  const [integrations, setIntegrations] = useState<ExternalAgendaIntegration[]>(() =>
    loadFromStorage(STORAGE_KEYS.INTEGRATIONS, INITIAL_INTEGRATIONS)
  );

  const [boostCampaigns, setBoostCampaigns] = useState<GlowBoostCampaign[]>(() =>
    refreshLegacyImages(loadFromStorage(STORAGE_KEYS.BOOST, INITIAL_BOOST_CAMPAIGNS), INITIAL_BOOST_CAMPAIGNS, ['targetImage'])
  );

  const [currentSection, setCurrentSection] = useState<DashboardSection>('home');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [previewAsClientModalOpen, setPreviewAsClientModalOpen] = useState<boolean>(false);

  // Sync to storage on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE, businessProfile);
  }, [businessProfile]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PORTFOLIO, portfolio);
  }, [portfolio]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TEAM, team);
  }, [team]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INTEGRATIONS, integrations);
  }, [integrations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOST, boostCampaigns);
  }, [boostCampaigns]);

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
    setCurrentSection('home');
  };

  const restartOnboarding = () => {
    setBusinessProfile((prev) => ({ ...prev, onboardingCompleted: false }));
    setOnboardingStep(1);
  };

  const resetAllDemoData = () => {
    setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    setServices(INITIAL_SERVICES);
    setPortfolio(INITIAL_PORTFOLIO);
    setBookings(INITIAL_BOOKINGS);
    setTeam(INITIAL_TEAM);
    setClients(INITIAL_CLIENTS);
    setReviews(INITIAL_REVIEWS);
    setIntegrations(INITIAL_INTEGRATIONS);
    setBoostCampaigns(INITIAL_BOOST_CAMPAIGNS);
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
        restartOnboarding,
        resetAllDemoData,
      }}
    >
      {children}
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
