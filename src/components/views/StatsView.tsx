import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MetricCard } from '../common/MetricCard';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import {
  TrendingUp,
  Eye,
  Bookmark,
  CalendarCheck,
  Users,
  Percent,
  Sparkles,
  Lock,
  ArrowDown,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const { businessProfile, switchPlan } = useApp();
  const { showToast } = useToast();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m'>('30d');
  const isPro = businessProfile.plan === 'pro';

  const statsData = {
    '7d': {
      views: '342',
      impressions: '1.240',
      profileVisits: '48',
      saves: '32',
      serviceClicks: '64',
      intentClicks: '11',
      bookings: '5',
      newClients: '4',
      conversionRate: '10.4%',
      generatedUYU: '$11.200',
      funnel: {
        views: 342,
        visits: 48,
        intent: 11,
        bookings: 5,
      },
    },
    '30d': {
      views: '1.284',
      impressions: '5.920',
      profileVisits: '173',
      saves: '142',
      serviceClicks: '286',
      intentClicks: '38',
      bookings: '18',
      newClients: '12',
      conversionRate: '10.4%',
      generatedUYU: '$43.600',
      funnel: {
        views: 1284,
        visits: 173,
        intent: 38,
        bookings: 18,
      },
    },
    '3m': {
      views: '4.180',
      impressions: '18.400',
      profileVisits: '530',
      saves: '410',
      serviceClicks: '890',
      intentClicks: '115',
      bookings: '54',
      newClients: '39',
      conversionRate: '10.2%',
      generatedUYU: '$128.400',
      funnel: {
        views: 4180,
        visits: 530,
        intent: 115,
        bookings: 54,
      },
    },
  }[timeRange];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Temporal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Estadísticas & Rendimiento
          </h2>
          <p className=" text-sm text-[#571C31]/75 mt-0.5">
            Analizá cómo tu contenido se convierte en visibilidad y reservas reales.
          </p>
        </div>

        {/* Time Selector */}
        <div className="inline-flex items-center p-1 rounded-xl bg-white border border-[#571C31]/15 self-start sm:self-auto">
          {(['7d', '30d', '3m'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-[#B82E5F] text-white shadow-xs'
                  : 'text-[#571C31]/70 hover:text-[#571C31]'
              }`}
            >
              {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '3 meses'}
            </button>
          ))}
        </div>
      </div>

      {/* BLOQUE IMPACTO DESTACADO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#571C31] text-[#FFF8F3] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F5DCE5]/80">
            Impacto económico atribuido
          </span>
          <h3 className=" text-3xl sm:text-4xl font-extrabold text-[#FFF8F3] mt-2">
            Glow Buzz generó {statsData.generatedUYU} este período
          </h3>
          <p className=" text-xs sm:text-sm text-[#F5DCE5]/80 mt-1 max-w-xl">
            Calculado sobre las reservas completadas y confirmadas originadas directamente a través de tu perfil, portfolio y campañas en Glow Buzz.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs text-center min-w-[140px] w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#F5DCE5] block">
              Tasa de conversión
            </span>
            <span className=" text-2xl font-bold text-white block mt-0.5">
              {statsData.conversionRate}
            </span>
          </div>
        </div>
      </div>

      {/* FUNNEL DE CONVERSIÓN VISUAL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className=" text-lg font-bold text-[#181416]">
            Embudo de descubrimiento a reserva
          </h3>
          <span className="text-xs text-[#571C31]/70">
            De cada 100 visitas, ~10 reservan
          </span>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#571C31]/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#571C31]/60 uppercase">
                  1. Descubrimiento
                </span>
                <p className=" text-2xl font-extrabold text-[#181416] mt-1">
                  {statsData.funnel.views}
                </p>
                <p className="text-xs text-[#571C31]/75 mt-0.5">
                  Vistas a tus fotos en el feed
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#571C31]/10 text-[11px] text-[#B82E5F] font-bold flex items-center justify-between">
                <span>Pasa al perfil</span>
                <span>{((statsData.funnel.visits / statsData.funnel.views) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#571C31]/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#571C31]/60 uppercase">
                  2. Visitas
                </span>
                <p className=" text-2xl font-extrabold text-[#181416] mt-1">
                  {statsData.funnel.visits}
                </p>
                <p className="text-xs text-[#571C31]/75 mt-0.5">
                  Clientas que exploraron tu estudio
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#571C31]/10 text-[11px] text-[#B82E5F] font-bold flex items-center justify-between">
                <span>Intención de turno</span>
                <span>{((statsData.funnel.intent / statsData.funnel.visits) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#571C31]/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#571C31]/60 uppercase">
                  3. Intención
                </span>
                <p className=" text-2xl font-extrabold text-[#181416] mt-1">
                  {statsData.funnel.intent}
                </p>
                <p className="text-xs text-[#571C31]/75 mt-0.5">
                  Clics en "Reservar cita"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#571C31]/10 text-[11px] text-[#B82E5F] font-bold flex items-center justify-between">
                <span>Confirmación final</span>
                <span>{((statsData.funnel.bookings / statsData.funnel.intent) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#F5DCE5] border border-[#B82E5F]/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#B82E5F] uppercase">
                  4. Reservas efectivas
                </span>
                <p className=" text-2xl font-extrabold text-[#B82E5F] mt-1">
                  {statsData.funnel.bookings}
                </p>
                <p className="text-xs text-[#571C31] mt-0.5">
                  Turnos confirmados en Pocitos
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#B82E5F]/20 text-[11px] text-[#571C31] font-bold">
                ✓ Valor medio: $880 UYU
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* BLOQUES DESGLOSADOS: Descubrimiento, Interés, Conversión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BLOQUE DESCUBRIMIENTO */}
        <div className="space-y-3">
          <h4 className=" text-sm font-bold uppercase tracking-wider text-[#571C31]">
            Descubrimiento
          </h4>
          <MetricCard
            label="Visualizaciones de portfolio"
            value={statsData.views}
            subtitle="Veces que tu trabajo se vio en feed"
          />
          <MetricCard
            label="Impresiones en búsquedas"
            value={statsData.impressions}
            subtitle="Resultados en Pocitos y Montevideo"
          />
          <MetricCard
            label="Visitas directas al perfil"
            value={statsData.profileVisits}
            subtitle="Clientas interesadas en tus datos"
          />
        </div>

        {/* BLOQUE INTERÉS */}
        <div className="space-y-3">
          <h4 className=" text-sm font-bold uppercase tracking-wider text-[#571C31]">
            Interés & Deseo
          </h4>
          <MetricCard
            label="Trabajos guardados"
            value={statsData.saves}
            subtitle="En colecciones de inspiración"
          />
          <MetricCard
            label="Clics en servicios"
            value={statsData.serviceClicks}
            subtitle="Clientas revisando precios"
            locked={!isPro}
          />
          <MetricCard
            label="Clics en botón reservar"
            value={statsData.intentClicks}
            subtitle="Alta intención de compra"
            locked={!isPro}
          />
        </div>

        {/* BLOQUE CONVERSIÓN */}
        <div className="space-y-3">
          <h4 className=" text-sm font-bold uppercase tracking-wider text-[#571C31]">
            Conversión & Clientes
          </h4>
          <MetricCard
            label="Reservas confirmadas"
            value={statsData.bookings}
            subtitle="Agendadas en Glow Buzz"
          />
          <MetricCard
            label="Clientas nuevas"
            value={statsData.newClients}
            subtitle="Descubrieron tu estudio aquí"
            locked={!isPro}
          />
          <MetricCard
            label="Tasa de conversión global"
            value={statsData.conversionRate}
            subtitle="Por encima de la media (7.2%)"
            locked={!isPro}
          />
        </div>
      </div>

      {/* Pro Lock Banner if on Start */}
      {!isPro && (
        <Card className="p-6 bg-[#FFF8F3] border-[#B82E5F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#F5DCE5] text-[#B82E5F]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className=" text-base font-bold text-[#181416]">
                Desbloqueá estadísticas avanzadas con Glow Pro
              </h4>
              <p className="text-xs sm:text-sm text-[#571C31]/75 mt-0.5">
                Conocé el origen exacto de cada clienta nueva, tasa de recurrencia y clics en cada servicio.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              switchPlan('pro');
              showToast('Glow Pro activado', 'Todas las métricas avanzadas ya están desbloqueadas.', 'success');
            }}
          >
            Conocer Glow Pro
          </Button>
        </Card>
      )}
    </div>
  );
};
