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
    price: 590,
    tagline: 'Para empezar a mostrar tu trabajo y conseguir nuevas clientas.',
    features: ['Perfil con tus trabajos', 'Reseñas de clientas', 'Reservas desde GlowBuzz'],
    unlocks: 'Plan básico activo con perfil, trabajos, reseñas y reservas.',
  },
  {
    id: 'start_plus',
    name: 'Glow Start +',
    price: 990,
    tagline: 'Todo lo básico, más una agenda pensada para tu día a día.',
    features: ['Todo lo de Glow Start', 'Agenda desarrollada por GlowBuzz'],
    unlocks: 'Se desbloqueó la Glow Agenda semanal.',
  },
  {
    id: 'boost',
    name: 'Glow Boost',
    price: 1690,
    tagline: 'Para destacar tu negocio y crecer con datos reales.',
    features: [
      'Todo lo de Glow Start +',
      'Posicionamiento destacado',
      'Estadísticas y datos generados en la plataforma',
    ],
    unlocks: 'Se desbloqueó el posicionamiento destacado y las estadísticas avanzadas.',
  },
];

const RANK: Record<PlanType, number> = { start: 0, start_plus: 1, boost: 2 };

export const getPlan = (id: PlanType): PlanInfo => PLANS.find((p) => p.id === id) ?? PLANS[0];

/** true si `current` incluye todo lo que ofrece `required` (los planes son acumulativos). */
export const hasPlan = (current: PlanType, required: PlanType): boolean =>
  RANK[current] >= RANK[required];

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
