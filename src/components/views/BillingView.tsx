import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BillingCycle, PlanType } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { PLANS, getPlan, getPricing, formatPrice } from '../../data/plans';
import { BillingCycleToggle } from '../common/BillingCycleToggle';
import {
  CreditCard,
  Check,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Calendar,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { businessProfile, switchPlan, updateProfile } = useApp();
  const { showToast } = useToast();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Berna Silva',
    expiry: '12/28',
    cvv: '•••',
  });

  const currentPlan = getPlan(businessProfile.plan);
  const currentPricing = getPricing(currentPlan, businessProfile.billingCycle);

  // Frecuencia que se está comparando; solo cambia la suscripción al confirmar en una tarjeta
  const [viewCycle, setViewCycle] = useState<BillingCycle>(businessProfile.billingCycle);

  const handleChangePlan = (targetPlan: PlanType) => {
    const target = getPlan(targetPlan);
    switchPlan(targetPlan);
    updateProfile({ billingCycle: viewCycle });
    showToast(
      targetPlan === businessProfile.plan
        ? `Pago ${viewCycle === 'annual' ? 'anual' : 'mensual'} activado`
        : `Plan cambiado a ${target.name}`,
      viewCycle === 'annual'
        ? `${target.name} con pago anual: ${formatPrice(getPricing(target, 'annual').charge)} por año.`
        : target.unlocks,
      'success'
    );
  };

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Método de pago guardado', 'La tarjeta Visa terminada en 4242 quedó configurada.', 'success');
    setPaymentModalOpen(false);
  };

  const handleConfirmCancel = () => {
    showToast(
      'Suscripción pausada al finalizar el período',
      'Tu prueba gratuita continuará activa hasta completar los 23 días.',
      'info'
    );
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
          Plan y facturación
        </h2>
      </div>

      {/* Tarjeta de Estado del Plan Actual */}
      <Card className="p-6 sm:p-7 bg-white border border-[#571C31]/15 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#571C31]/10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className=" text-xl font-extrabold text-[#181416]">
                {currentPlan.name}
              </span>
              <Badge variant="cherry">Prueba gratuita</Badge>
            </div>
            <p className="text-sm font-bold text-[#571C31] mt-1">
              {formatPrice(currentPricing.perMonth)} UYU / mes
              {businessProfile.billingCycle === 'annual' && (
                <span className="font-medium text-[#571C31]/70">
                  {' '}· pago anual ({formatPrice(currentPricing.charge)} por año)
                </span>
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 text-xs text-[#571C31]">
            <span className=" font-bold text-[#B82E5F] block text-sm">
              Te quedan {businessProfile.trialDaysLeft} días de prueba gratuita.
            </span>
            <span>No se realizará ningún cobro hasta el 01/11/2026.</span>
          </div>
        </div>

        {/* DESTACAR ROI */}
        <div className="p-5 rounded-2xl bg-[#F5DCE5]/60 border border-[#B82E5F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#B82E5F] text-white flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#571C31]/75 block">
                Retorno de inversión medido
              </span>
              <p className=" text-base sm:text-lg font-bold text-[#181416] mt-0.5">
                Glow Buzz ya te generó 7 reservas por un valor estimado de $12.400 UYU.
              </p>
              <p className=" text-xs text-[#571C31]/75 mt-0.5">
                El costo mensual de tu plan ({formatPrice(currentPricing.perMonth)}) se pagó {(12400 / currentPricing.perMonth).toFixed(1)} veces con clientas nuevas.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones principales de suscripción */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              leftIcon={<CreditCard className="w-4 h-4" />}
            >
              Administrar método de pago
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-stone-500 hover:text-red-700 text-xs"
            >
              Cancelar suscripción
            </Button>
          </div>

          <span className="text-xs text-[#571C31]/60">
            Cancelable en 1 clic sin penalizaciones.
          </span>
        </div>
      </Card>

      {/* Comparativa Interactiva de Planes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#181416]">Comparar y cambiar de plan</h3>
          <BillingCycleToggle value={viewCycle} onChange={setViewCycle} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === businessProfile.plan;
            const isCurrent = isCurrentPlan && viewCycle === businessProfile.billingCycle;
            const pricing = getPricing(plan, viewCycle);
            const isTop = plan.id === 'boost';
            return (
              <Card
                key={plan.id}
                className={`p-6 transition-all border-2 relative flex flex-col justify-between ${
                  isCurrent ? 'border-[#B82E5F] shadow-sm bg-[#FFF8F9]/50' : 'border-[#571C31]/10'
                }`}
              >
                {isTop && (
                  <div className="absolute -top-3 right-5 bg-[#571C31] text-[#FFF8F3] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Más completo
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-base font-extrabold uppercase ${
                        isTop ? 'text-[#B82E5F]' : 'text-[#571C31]'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {isCurrentPlan && <Badge variant="cherry">Tu plan actual</Badge>}
                  </div>

                  <div className="my-2">
                    <span className="text-2xl font-extrabold text-[#181416]">
                      {formatPrice(pricing.perMonth)}
                    </span>
                    <span className="text-xs text-[#571C31]/70 ml-1">UYU / mes</span>
                    {viewCycle === 'annual' && (
                      <p className="text-[11px] text-[#571C31]/70 mt-1">
                        Se factura {formatPrice(pricing.charge)} por año ·{' '}
                        <span className="font-bold text-[#B82E5F]">ahorrás {formatPrice(pricing.yearlySavings)}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-[#571C31]/75 mb-4">{plan.tagline}</p>

                  <div className="space-y-2 text-xs text-[#181416] pt-3 border-t border-[#571C31]/10">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#B82E5F] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#571C31]/10">
                  <Button
                    variant={isCurrent ? 'outline' : 'primary'}
                    size="md"
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handleChangePlan(plan.id)}
                  >
                    {isCurrent
                      ? 'Plan activo'
                      : isCurrentPlan
                      ? viewCycle === 'annual'
                        ? 'Pasar a pago anual'
                        : 'Pasar a pago mensual'
                      : `Cambiar a ${plan.name}`}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal: Administrar Método de Pago */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Método de pago"
        subtitle="Simulación de tarjeta para el prototipo."
      >
        <form onSubmit={handleSavePaymentMethod} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Número de tarjeta
            </label>
            <input
              type="text"
              value={cardForm.number}
              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Vencimiento
              </label>
              <input
                type="text"
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                CVV
              </label>
              <input
                type="password"
                value={cardForm.cvv}
                onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cerrar
            </Button>
            <Button variant="primary" size="md" type="submit">
              Guardar tarjeta
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Cancelar Suscripción */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancelar suscripción"
        subtitle="Lamentamos que quieras pausar tu plan."
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#181416] leading-relaxed">
            Podés seguir disfrutando de todas las funciones de tu prueba hasta que finalicen los 23 días restantes. Tu perfil y trabajos no se borrarán.
          </p>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" onClick={() => setCancelModalOpen(false)}>
              Mantener plan
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmCancel}>
              Confirmar pausa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
