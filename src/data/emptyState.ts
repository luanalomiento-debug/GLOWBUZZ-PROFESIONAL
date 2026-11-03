import { BusinessProfile, ExternalAgendaIntegration } from '../types';

/** Horario de atención con el que arranca cada comercio nuevo (lo ajusta en Mi perfil). */
const DEFAULT_HOURS: BusinessProfile['hours'] = [
  { day: 'Lunes', open: '09:00', close: '18:00', active: true },
  { day: 'Martes', open: '09:00', close: '18:00', active: true },
  { day: 'Miércoles', open: '09:00', close: '18:00', active: true },
  { day: 'Jueves', open: '09:00', close: '18:00', active: true },
  { day: 'Viernes', open: '09:00', close: '18:00', active: true },
  { day: 'Sábado', open: '10:00', close: '14:00', active: true },
  { day: 'Domingo', open: '10:00', close: '14:00', active: false },
];

/** Datos que se piden al crear la cuenta; el resto del perfil se completa en el onboarding. */
export interface SignUpDetails {
  email: string;
  ownerName?: string;
  ownerLastName?: string;
  phone?: string;
}

/** Perfil de un comercio recién creado: sin nada cargado. */
export const buildEmptyProfile = (userId: string, details: SignUpDetails): BusinessProfile => ({
  id: userId,
  name: '',
  ownerName: details.ownerName ?? '',
  ownerLastName: details.ownerLastName ?? '',
  email: details.email,
  phone: details.phone ?? '',
  businessType: 'independent',
  categories: [],
  specialties: [],
  location: '',
  address: '',
  modality: 'local',
  teamSize: 'solo',
  currentAgendaTool: 'WhatsApp / mensajes',
  plan: 'start',
  billingCycle: 'monthly',
  trialDaysLeft: 30,
  description: '',
  instagram: '',
  tiktok: '',
  avatarUrl: '',
  coverUrl: '',
  hours: DEFAULT_HOURS.map((h) => ({ ...h })),
  onboardingCompleted: false,
});

/** Opciones de agenda externa disponibles: todas desconectadas hasta que el comercio conecte una. */
export const EMPTY_INTEGRATIONS: ExternalAgendaIntegration[] = [
  {
    id: 'gcal',
    name: 'Google Calendar',
    description: 'Sincronizá tus turnos en tiempo real con tu calendario personal o corporativo.',
    connected: false,
    lastSync: null,
    badge: 'Popular',
  },
  {
    id: 'koobing',
    name: 'Koobing',
    description: 'Importá automáticamente reservas y evitá solapamientos con tu agenda Koobing.',
    connected: false,
    lastSync: null,
  },
  {
    id: 'agendoro',
    name: 'Agendoro',
    description: 'Vinculá tus horarios y profesionales dados de alta en Agendoro con GlowBuzz.',
    connected: false,
    lastSync: null,
  },
  {
    id: 'agendapro',
    name: 'AgendaPro',
    description: 'Conectá tu software AgendaPro para mantener turnos sincronizados en ambas vías.',
    connected: false,
    lastSync: null,
  },
];
