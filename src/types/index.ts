export type BusinessType = 'independent' | 'studio';

export type PlanType = 'start' | 'start_plus' | 'boost';

export type BillingCycle = 'monthly' | 'annual';

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  businessType: BusinessType;
  categories: string[];
  specialties: string[];
  location: string;
  address: string;
  modality: 'local' | 'domicilio' | 'ambos';
  teamSize: 'solo' | '2-3' | '4-6' | '7+';
  currentAgendaTool: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  trialDaysLeft: number;
  description: string;
  instagram: string;
  tiktok: string;
  avatarUrl: string;
  coverUrl: string;
  hours: {
    day: string;
    open: string;
    close: string;
    active: boolean;
  }[];
  onboardingCompleted: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  specialty: string;
  durationMinutes: number;
  priceUYU: number;
  pricePrefix?: string; // e.g. "Desde"
  description: string;
  professionalId: string;
  professionalName?: string;
  active: boolean;
}

export interface PortfolioWork {
  id: string;
  title: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  priceUYU: number;
  description: string;
  tags: string[];
  imageUrl: string;
  views: number;
  saves: number;
  bookings: number;
  source: 'my_work' | 'client_ugc';
  clientName?: string;
  reviewRating?: number;
  reviewText?: string;
  addedToProfile?: boolean;
  featuredInBoost?: boolean;
  status: 'approved' | 'pending';
  date: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  priceUYU: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  source: 'Glow Buzz Feed' | 'Búsqueda' | 'Perfil' | 'Trabajo de clienta' | 'Glow Boost';
  notes?: string;
  releasedSlotPublished?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Administrador' | 'Profesional';
  specialty: string;
  avatarUrl: string;
  services: string[];
  rating: number;
  totalReviews: number;
  totalBookings: number;
  activeAppointments: number;
  portfolioCount: number;
  schedule: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  lastVisit: string;
  bookingsCount: number;
  favoriteService: string;
  source: string;
  totalSpentUYU: number;
  notes: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  date: string;
  serviceName: string;
  professionalName: string;
  comment: string;
  tags: string[];
  hasClientPhoto?: boolean;
  clientPhotoUrl?: string;
  reply?: string;
}

export interface GlowBoostCampaign {
  id: string;
  type: 'profile' | 'work' | 'service';
  targetTitle: string;
  targetSubtitle: string;
  targetImage: string;
  location: string;
  category: string;
  specialty: string;
  budgetUYU: number;
  estimatedImpressions: string;
  estimatedViews: string;
  estimatedClicks: string;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

export interface CalendarBlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: 'bloqueado' | 'vacaciones';
  professionalId?: string;
}

export interface ExternalAgendaIntegration {
  id: 'gcal' | 'koobing' | 'agendoro' | 'agendapro';
  name: string;
  description: string;
  connected: boolean;
  lastSync: string | null;
  badge?: string;
}

export type DashboardSection =
  | 'home'
  | 'profile'
  | 'content'
  | 'agenda'
  | 'bookings'
  | 'clients'
  | 'reviews'
  | 'stats'
  | 'team'
  | 'boost'
  | 'billing'
  | 'settings';
