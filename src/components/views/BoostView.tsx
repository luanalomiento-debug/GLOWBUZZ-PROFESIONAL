import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Zap,
  Sparkles,
  MapPin,
  Eye,
  MousePointer,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';

export const BoostView: React.FC = () => {
  const {
    businessProfile,
    portfolio,
    services,
    boostCampaigns,
    activateBoost,
  } = useApp();
  const { showToast } = useToast();

  const [boostType, setBoostType] = useState<'profile' | 'work' | 'service'>('work');
  const [selectedWorkId, setSelectedWorkId] = useState(portfolio[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [budget, setBudget] = useState<number>(500);
  const [locationTarget, setLocationTarget] = useState('Pocitos, Punta Carretas & Buceo (4 km)');

  const selectedWork = portfolio.find((w) => w.id === selectedWorkId) || portfolio[0];
  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  // Estimation based on budget
  const estimates = {
    200: { impressions: '1.900', views: '380', clicks: '42' },
    500: { impressions: '4.800', views: '950', clicks: '110' },
    1000: { impressions: '10.500', views: '2.100', clicks: '240' },
  }[budget] || { impressions: '4.800', views: '950', clicks: '110' };

  const handleActivate = () => {
    let targetTitle = '';
    let targetSubtitle = '';
    let targetImage = '';

    if (boostType === 'work' && selectedWork) {
      targetTitle = selectedWork.title;
      targetSubtitle = `${selectedWork.professionalName} · ${businessProfile.name}`;
      targetImage = selectedWork.imageUrl;
    } else if (boostType === 'service' && selectedService) {
      targetTitle = selectedService.name;
      targetSubtitle = `Desde $${selectedService.priceUYU} · ${businessProfile.name}`;
      targetImage = portfolio[0]?.imageUrl || businessProfile.coverUrl;
    } else {
      targetTitle = businessProfile.name;
      targetSubtitle = `${businessProfile.location} · ${businessProfile.categories.join(', ')}`;
      targetImage = businessProfile.coverUrl;
    }

    activateBoost({
      type: boostType,
      targetTitle,
      targetSubtitle,
      targetImage,
      location: locationTarget,
      category: businessProfile.categories[0] || 'Uñas',
      specialty: businessProfile.specialties[0] || 'Manicuría',
      budgetUYU: budget,
      estimatedImpressions: estimates.impressions,
      estimatedViews: estimates.views,
      estimatedClicks: estimates.clicks,
    });

    showToast(
      'Campaña Glow Boost activada',
      `Tu anuncio ya aparece con badge "Patrocinado" a clientas cercanas.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Llegá a más personas con Glow Boost
          </h2>
          <Badge variant="sponsored">Patrocinado</Badge>
        </div>
        <p className=" text-sm text-[#571C31]/75 mt-0.5">
          Herramienta nativa para destacar tus mejores trabajos frente a clientas con alta intención de reserva en tu zona.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Configuración de Campaña (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Selector de Objetivo */}
          <Card className="space-y-3">
            <label className="block text-xs font-bold text-[#571C31] uppercase tracking-wider">
              1. ¿Qué querés promocionar?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'work', label: 'Un trabajo' },
                { id: 'service', label: 'Un servicio' },
                { id: 'profile', label: 'Mi perfil' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBoostType(opt.id as any)}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    boostType === opt.id
                      ? 'border-[#B82E5F] bg-[#F5DCE5] text-[#571C31] shadow-2xs'
                      : 'border-[#571C31]/15 bg-white text-[#571C31]/70 hover:border-[#571C31]/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Select specific item */}
            {boostType === 'work' && (
              <div className="pt-2">
                <label className="block text-xs text-[#571C31]/80 mb-1">
                  Elegí el trabajo de tu portfolio:
                </label>
                <select
                  value={selectedWorkId}
                  onChange={(e) => setSelectedWorkId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs"
                >
                  {portfolio.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} (${w.priceUYU})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {boostType === 'service' && (
              <div className="pt-2">
                <label className="block text-xs text-[#571C31]/80 mb-1">
                  Elegí el servicio a destacar:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.priceUYU})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Card>

          {/* 2. Ubicación y Segmentación */}
          <Card className="space-y-3">
            <label className="block text-xs font-bold text-[#571C31] uppercase tracking-wider">
              2. Segmentación geográfica
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#B82E5F] absolute left-3.5 top-3" />
              <input
                type="text"
                value={locationTarget}
                onChange={(e) => setLocationTarget(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-xs focus:outline-none focus:border-[#B82E5F]"
              />
            </div>
            <p className="text-[11px] text-[#571C31]/60">
              Llegarás a clientas que abren la app de Glow Buzz en tu radio de influencia.
            </p>
          </Card>

          {/* 3. Presupuesto */}
          <Card className="space-y-3">
            <label className="block text-xs font-bold text-[#571C31] uppercase tracking-wider">
              3. Presupuesto de visibilidad (pesos uruguayos)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[200, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBudget(amount)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    budget === amount
                      ? 'border-[#B82E5F] bg-[#FFF8F3] shadow-xs'
                      : 'border-[#571C31]/15 bg-white text-[#571C31]/70 hover:border-[#571C31]/30'
                  }`}
                >
                  <span className=" text-xl font-extrabold text-[#181416] block">
                    ${amount}
                  </span>
                  <span className="text-[10px] text-[#571C31]/60">
                    {amount === 200 ? '1 fin de semana' : amount === 500 ? '7 días activo' : '15 días impulso'}
                  </span>
                </button>
              ))}
            </div>

            {/* Estimados de rendimiento */}
            <div className="p-3.5 rounded-xl bg-[#FFF8F3] border border-[#571C31]/10 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-[#571C31]/60 block font-bold">ALCANCE</span>
                <span className="font-bold text-[#181416]">~{estimates.impressions}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#571C31]/60 block font-bold">VISTAS</span>
                <span className="font-bold text-[#181416]">~{estimates.views}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#571C31]/60 block font-bold">CLICS</span>
                <span className="font-bold text-[#B82E5F]">~{estimates.clicks}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Vista previa en vivo del Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className=" text-sm font-bold uppercase tracking-wider text-[#571C31]">
            Vista previa en vivo (Feed de clientas)
          </h3>

          {/* Phone frame simulation */}
          <div className="bg-[#181416] p-4 rounded-3xl shadow-xl border-4 border-stone-800 max-w-sm mx-auto">
            <div className="bg-[#FFF8F3] rounded-2xl overflow-hidden text-[#181416]">
              {/* Image Preview with REQUIRED 'Patrocinado' Badge */}
              <div className="relative aspect-4/3 bg-stone-200 overflow-hidden">
                <img
                  src={
                    boostType === 'work' && selectedWork
                      ? selectedWork.imageUrl
                      : boostType === 'service'
                      ? portfolio[0]?.imageUrl
                      : businessProfile.coverUrl
                  }
                  alt="Boost preview"
                  className="w-full h-full object-cover"
                />

                {/* SIEMPRE DEBE APARECER 'Patrocinado' */}
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                  Patrocinado
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-white/90 text-[#181416] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                  {boostType === 'work' && selectedWork
                    ? `$${selectedWork.priceUYU}`
                    : boostType === 'service' && selectedService
                    ? `Desde $${selectedService.priceUYU}`
                    : 'Pocitos'}
                </div>
              </div>

              {/* Feed Card Info */}
              <div className="p-3.5 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={businessProfile.avatarUrl}
                    alt={businessProfile.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#B82E5F]/30"
                  />
                  <div>
                    <p className="text-xs font-bold leading-none text-[#181416]">
                      {businessProfile.name}
                    </p>
                    <span className="text-[10px] text-[#571C31]/60">
                      {businessProfile.location}
                    </span>
                  </div>
                </div>

                <p className=" text-sm font-bold text-[#181416] leading-snug">
                  {boostType === 'work' && selectedWork
                    ? selectedWork.title
                    : boostType === 'service' && selectedService
                    ? selectedService.name
                    : businessProfile.description.substring(0, 70) + '...'}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-[#571C31]/10">
                  <span className="text-[10px] text-[#571C31]/70">
                    ★ 4.8 (127 reseñas)
                  </span>
                  <button className="px-3 py-1 bg-[#B82E5F] text-white text-[10px] font-bold rounded-lg">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleActivate}
            className="w-full shadow-md"
            leftIcon={<Zap className="w-4 h-4" />}
          >
            Activar Boost (${budget} UYU)
          </Button>
          <p className="text-[11px] text-center text-[#571C31]/60">
            Modo prueba: no se realizará ningún cobro real a tu medio de pago.
          </p>
        </div>
      </div>

      {/* Campañas Activas */}
      {boostCampaigns.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#571C31]/10">
          <h3 className=" text-base font-bold text-[#181416]">
            Campañas de Boost activas ({boostCampaigns.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boostCampaigns.map((camp) => (
              <Card key={camp.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={camp.targetImage}
                    alt={camp.targetTitle}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className=" text-sm font-bold text-[#181416]">
                        {camp.targetTitle}
                      </span>
                      <Badge variant="sponsored" size="sm">Patrocinado</Badge>
                    </div>
                    <p className="text-xs text-[#571C31]/70">
                      Presupuesto: ${camp.budgetUYU} UYU · {camp.location}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#571C31] mt-1">
                      <span>{camp.estimatedViews} vistas</span>
                      <span>· {camp.estimatedClicks} clics en reservar</span>
                    </div>
                  </div>
                </div>

                <Badge variant="success" size="sm">Activa ✓</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
