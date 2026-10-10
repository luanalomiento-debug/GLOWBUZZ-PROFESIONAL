import React from 'react';
import { Eye, MousePointerClick, Megaphone, MapPin } from 'lucide-react';
import { GlowBoostCampaign } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { PlanLock } from '../common/PlanLock';

interface BoostPublicationsProps {
  campaigns: GlowBoostCampaign[];
  canUseBoost: boolean;
  onCreate: () => void;
}

const STATUS_LABEL: Record<GlowBoostCampaign['status'], { label: string; variant: 'success' | 'neutral' | 'warning' }> = {
  active: { label: 'Activa', variant: 'success' },
  completed: { label: 'Finalizada', variant: 'neutral' },
  draft: { label: 'Borrador', variant: 'warning' },
};

/** Publicaciones promocionadas con Glow Boost: cómo se ven en el feed y cómo rinden. */
export const BoostPublications: React.FC<BoostPublicationsProps> = ({ campaigns, canUseBoost, onCreate }) => {
  if (!canUseBoost) {
    return (
      <PlanLock
        requiredPlan="boost"
        title="Tus publicaciones destacadas viven acá"
        description="Con Glow Boost promocionás tus mejores trabajos y ves cuántas clientas los vieron y reservaron."
      />
    );
  }

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone className="w-6 h-6" />}
        title="Todavía no tenés publicaciones con Glow Boost"
        description="Promocioná un trabajo o un servicio y seguí acá cómo rinde entre las clientas de tu zona."
        actionLabel="Crear Glow Boost"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => {
          const status = STATUS_LABEL[camp.status];
          return (
            <Card key={camp.id} className="p-0 overflow-hidden flex flex-col shadow-sm">
              {/* Así se ve la publicación en el feed de clientas */}
              <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                <img src={camp.targetImage} alt={camp.targetTitle} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  Patrocinado
                </span>
                <div className="absolute top-3 right-3">
                  <Badge variant={status.variant} size="sm">
                    {status.label}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#181416] leading-snug">{camp.targetTitle}</h3>
                  <p className="text-xs text-[#571C31]/70 mt-0.5">{camp.targetSubtitle}</p>
                  <p className="text-xs text-[#571C31]/70 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B82E5F]" />
                    {camp.location} · Presupuesto ${camp.budgetUYU} UYU
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#571C31]/10 text-center">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#571C31]/60">Alcance</span>
                    <span className="block text-sm font-bold text-[#181416] mt-0.5">{camp.estimatedImpressions}</span>
                  </div>
                  <div>
                    <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#571C31]/60">
                      <Eye className="w-3 h-3" /> Vistas
                    </span>
                    <span className="block text-sm font-bold text-[#181416] mt-0.5">{camp.estimatedViews}</span>
                  </div>
                  <div>
                    <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#571C31]/60">
                      <MousePointerClick className="w-3 h-3" /> Clics
                    </span>
                    <span className="block text-sm font-bold text-[#B82E5F] mt-0.5">{camp.estimatedClicks}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" size="md" onClick={onCreate}>
          Crear otra publicación
        </Button>
      </div>
    </div>
  );
};
