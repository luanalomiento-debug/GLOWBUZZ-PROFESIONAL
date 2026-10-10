import React from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { PlanType } from '../../types';
import { getPlan, formatPrice } from '../../data/plans';
import { Card } from './Card';
import { Button } from './Button';

interface PlanLockProps {
  /** Plan mínimo que incluye la función bloqueada. */
  requiredPlan: PlanType;
  title: string;
  description: string;
}

/** Aviso para funciones que pertenecen a un plan superior al actual. */
export const PlanLock: React.FC<PlanLockProps> = ({ requiredPlan, title, description }) => {
  const { switchPlan } = useApp();
  const { showToast } = useToast();
  const plan = getPlan(requiredPlan);

  return (
    <Card className="p-8 flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
      <div className="p-3 rounded-2xl bg-[#F5DCE5] text-[#B82E5F]">
        <Lock className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#181416]">{title}</h3>
        <p className="text-sm text-[#571C31]/75 mt-1 leading-relaxed">{description}</p>
      </div>
      <Button
        variant="primary"
        size="md"
        onClick={() => {
          switchPlan(requiredPlan);
          showToast(`Plan cambiado a ${plan.name}`, plan.unlocks, 'success');
        }}
      >
        Pasar a {plan.name} · {formatPrice(plan.price)}/mes
      </Button>
    </Card>
  );
};
