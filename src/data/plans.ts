import { BillingCycle, PlanType } from '../types';

export interface PlanInfo {
  id: PlanType;
  name: string;
  /** Precio mensual en UYU. */
  price: number;
  tagline: string;
  features: string[];
  /** Resumen corto de lo que se activa al cambiar a este plan. */
  unlocks: string;
}

export const PLANS: PlanInfo[] = [
  {
    id: 'start',
    name: 'Glow Start',
    price: 1290,
    tagline: 'Para profesionales que ya usan una agenda y quieren ganar visibilidad y llenar horarios.',
    features: [
      'Perfil con portfolio y reseñas verificadas',
      'Catálogo de servicios con precio y duración',
      'Presencia en el feed y en las búsquedas por rubro, zona y estilo',
      'Reservas conectadas a tu agenda externa',
      'Confirmaciones, recordatorios y avisos a usuarias cuando se libera un horario',
      'Precios dinámicos para turnos vacíos',
      'Programa de puntos e indicadores de reservas y clientas nuevas',
    ],
    unlocks: 'Plan básico activo con perfil, trabajos, reseñas y reservas.',
  },
  {
    id: 'start_plus',
    name: 'Glow Start+',
    price: 1990,
    tagline: 'Para profesionales o centros sin agenda digital propia.',
    features: [
      'Todo lo de Glow Start',
      'Agenda propia de GlowBuzz: calendario por profesional con horarios, ausencias y bloqueos',
      'Alta del equipo y asignación de turnos',
      'Carga de reservas por WhatsApp o teléfono e historial de visitas',
    ],
    unlocks: 'Se desbloqueó la Glow Agenda semanal.',
  },
  {
    id: 'pro',
    name: 'Glow Pro',
    price: 2490,
    tagline: 'Para profesionales que quieren crecer con datos y fidelizar a sus clientas.',
    features: [
      'Todo lo de Glow Start+',
      'Estadísticas de crecimiento: reservas nuevas y recurrentes, servicios más pedidos, facturación y qué publicaciones traen más reservas',
      'Ficha de cada clienta con historial, frecuencia y última visita',
      'Mensajes personalizados para repetir un servicio, después de la visita, por cumpleaños o para reactivar clientas inactivas',
      'Integración con Instagram para compartir publicaciones en GlowBuzz',
      'Acceso a Glow Boost (cada campaña se paga aparte)',
    ],
    unlocks: 'Se desbloquearon las estadísticas de crecimiento y el acceso a Glow Boost.',
  },
  {
    id: 'max',
    name: 'Glow Max',
    price: 3490,
    tagline: 'Para centros o profesionales consolidados que necesitan automatizar la operación de su equipo.',
    features: [
      'Todo lo de Glow Pro',
      'Campañas y canales de novedades a grupos de clientas que se arman solos (por servicio, frecuencia o tiempo sin reservar)',
      'Reasignación de turnos cuando falta una profesional, con aviso a cada clienta para que elija',
      'Cálculo automático de las comisiones del equipo',
      'Reportes semanales o mensuales de ocupación, cancelaciones e ingresos',
    ],
    unlocks: 'Se desbloqueó Glow Max con las automatizaciones de operación del equipo.',
  },
];

const RANK: Record<PlanType, number> = { start: 0, start_plus: 1, pro: 2, max: 3 };

/** Los planes viejos se renombraron: "boost" pasó a ser Glow Pro. */
export const normalizePlan = (plan: string | undefined): PlanType =>
  plan === 'boost' ? 'pro' : plan && plan in RANK ? (plan as PlanType) : 'start';

export const getPlan = (id: string): PlanInfo => PLANS.find((p) => p.id === normalizePlan(id)) ?? PLANS[0];

/** true si `current` incluye todo lo que ofrece `required` (los planes son acumulativos). */
export const hasPlan = (current: string, required: PlanType): boolean =>
  RANK[normalizePlan(current)] >= RANK[required];

/** Precio por día de una campaña de Glow Boost (IVA incluido). */
export const BOOST_PRICE_PER_DAY = 150;

/** Descuento por pagar el año completo por adelantado. */
export const ANNUAL_DISCOUNT_PERCENT = 10;

export interface PlanPricing {
  /** Lo que se paga cada mes (en pago anual, el equivalente mensual). */
  perMonth: number;
  /** Lo que se factura en cada cobro: un mes o el año completo. */
  charge: number;
  /** Ahorro anual frente a pagar mes a mes (0 en pago mensual). */
  yearlySavings: number;
}

export const getPricing = (plan: PlanInfo, cycle: BillingCycle): PlanPricing => {
  if (cycle === 'monthly') return { perMonth: plan.price, charge: plan.price, yearlySavings: 0 };
  const annualCharge = Math.round(plan.price * 12 * (1 - ANNUAL_DISCOUNT_PERCENT / 100));
  return {
    perMonth: Math.round(annualCharge / 12),
    charge: annualCharge,
    yearlySavings: plan.price * 12 - annualCharge,
  };
};

export const formatPrice = (price: number): string => `$${price.toLocaleString('es-UY')}`;
