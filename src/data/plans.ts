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
    price: 990,
    tagline: 'Para profesionales que ya usan una agenda.',
    features: ['Perfil con tus trabajos y reseñas', 'Reserva integrada con tu agenda'],
    unlocks: 'Plan básico activo con perfil, trabajos, reseñas y reservas.',
  },
  {
    id: 'start_plus',
    name: 'Glow Start+',
    price: 1490,
    tagline: 'Para profesionales que todavía no tienen agenda digital.',
    features: ['Todo lo de Glow Start', 'Agenda desarrollada por GlowBuzz'],
    unlocks: 'Se desbloqueó la Glow Agenda semanal.',
  },
  {
    id: 'pro',
    name: 'Glow Pro',
    price: 1990,
    tagline: 'Para profesionales que quieren crecer y ganar visibilidad.',
    features: [
      'Todo lo de Glow Start+',
      'Estadísticas de resultados',
      'Acceso a Glow Boost (cada campaña se paga aparte)',
    ],
    unlocks: 'Se desbloquearon las estadísticas de resultados y el acceso a Glow Boost.',
  },
  {
    id: 'max',
    name: 'Glow Max',
    price: 2990,
    tagline: 'Para profesionales con clientela consolidada y muchas clientas que gestionar.',
    features: ['Todo lo de Glow Pro', 'Automatizaciones'],
    unlocks: 'Se desbloqueó Glow Max con sus automatizaciones.',
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
