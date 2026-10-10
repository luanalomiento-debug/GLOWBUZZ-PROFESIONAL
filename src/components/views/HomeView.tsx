import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Eye,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Bookmark,
  Calendar,
  Zap,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    businessProfile,
    bookings,
    portfolio,
    checklistProgress,
    setCurrentSection,
  } = useApp();

  // Upcoming bookings (max 3 confirmed/pending)
  const upcomingBookings = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'pending')
    .slice(0, 3);

  // Top performing works (max 3)
  const topWorks = [...portfolio]
    .sort((a, b) => b.views + b.saves * 2 - (a.views + a.saves * 2))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Saludo & Encabezado */}
      <div>
        <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
          Hola, {businessProfile.ownerName}
        </h2>
        <p className=" text-sm sm:text-base text-[#571C31]/75 mt-1">
          Esto está pasando con tu perfil en Glow Buzz.
        </p>
      </div>

      {/* 3 KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Visitas al perfil"
          value="173"
          subtitle="En los últimos 30 días"
          trend={{ value: '+24% vs mes anterior', isPositive: true }}
          icon={<Eye className="w-4 h-4" />}
        />
        <MetricCard
          label="Reservas generadas"
          value="18"
          subtitle="Todas desde el descubrimiento"
          trend={{ value: '+6 esta semana', isPositive: true }}
          icon={<CalendarCheck className="w-4 h-4" />}
        />
        <MetricCard
          label="Generado por Glow Buzz"
          value="$15.840"
          subtitle="En pesos uruguayos (UYU)"
          trend={{ value: 'ROI 9.4x tu plan', isPositive: true }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Grid Principal: 2 Bloques */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BLOQUE 1: Próximas reservas (5 cols en desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" text-lg font-bold text-[#181416] tracking-tight">
              Próximas reservas
            </h3>
            <button
              onClick={() => setCurrentSection('bookings')}
              className="text-xs font-bold text-[#B82E5F] hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Card className="p-0 overflow-hidden divide-y divide-[#571C31]/10">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setCurrentSection('bookings')}
                  className="p-4 hover:bg-[#FFF8F9]/60 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className=" text-sm font-bold text-[#181416] truncate">
                        {booking.clientName}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F5DCE5] text-[#571C31] font-semibold">
                        {booking.serviceName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#571C31]/70">
                      <Clock className="w-3 h-3 text-[#B82E5F]" />
                      <span>
                        {booking.date === '2026-10-09'
                          ? 'Hoy'
                          : booking.date === '2026-10-10'
                          ? 'Mañana'
                          : booking.date}{' '}
                        · {booking.time} hs
                      </span>
                      <span>· {booking.professionalName}</span>
                    </div>
                  </div>

                  <span className=" text-sm font-bold text-[#571C31] flex-shrink-0">
                    ${booking.priceUYU}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#571C31]/60">
                No tenés reservas pendientes para hoy.
              </div>
            )}
          </Card>
        </div>

        {/* BLOQUE 2: Checklist interactiva "Terminá de preparar tu Glow Buzz" (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className=" text-lg font-bold text-[#181416] tracking-tight">
              Terminá de preparar tu Glow Buzz
            </h3>
            <span className="text-xs font-bold text-[#571C31] bg-[#F5DCE5] px-2.5 py-1 rounded-full">
              {checklistProgress.completed} de {checklistProgress.total} completados
            </span>
          </div>

          <Card className="p-5">
            {/* Barra de progreso */}
            <div className="w-full h-2 bg-[#571C31]/10 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-[#B82E5F] rounded-full transition-all duration-300"
                style={{
                  width: `${(checklistProgress.completed / checklistProgress.total) * 100}%`,
                }}
              />
            </div>

            <div className="space-y-2.5">
              {checklistProgress.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setCurrentSection(task.targetSection)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    task.done
                      ? 'bg-[#FFF8F9]/40 border-[#571C31]/10 text-[#181416]/70'
                      : 'bg-white border-[#B82E5F]/30 hover:border-[#B82E5F] hover:bg-[#FFF8F9] text-[#181416] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#B82E5F] flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.done ? 'line-through text-[#571C31]/50' : 'text-[#181416] font-semibold'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {!task.done && (
                    <span className="text-xs font-bold text-[#B82E5F] flex items-center gap-1">
                      <span>Completar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* BLOQUE 3: "Tus trabajos con mejor rendimiento" (máximo 3 cards) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className=" text-lg font-bold text-[#181416] tracking-tight">
              Tus trabajos con mejor rendimiento
            </h3>
            <p className="text-xs text-[#571C31]/70 mt-0.5">
              Los contenidos que más descubrimientos y reservas generaron este mes.
            </p>
          </div>
          <button
            onClick={() => setCurrentSection('content')}
            className="text-xs font-bold text-[#B82E5F] hover:underline flex items-center gap-1"
          >
            <span>Ver portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {topWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => setCurrentSection('content')}
              className="bg-white rounded-2xl border border-[#571C31]/10 overflow-hidden hover:border-[#B82E5F]/40 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                  ${work.priceUYU}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className=" text-sm font-bold text-[#181416] truncate">
                  {work.title}
                </h4>
                <p className="text-xs text-[#571C31]/70 truncate">
                  {work.professionalName}
                </p>

                {/* Métricas destacadas */}
                <div className="flex items-center justify-between pt-2 border-t border-[#571C31]/10 text-[11px] text-[#571C31]/80">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#B82E5F]" />
                    {work.views.toLocaleString()} vistas
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-[#B82E5F]" />
                    {work.saves} guardados
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#B82E5F]">
                    <CalendarCheck className="w-3 h-3" />
                    {work.bookings} reservas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner / Tip de Crecimiento */}
      <div className="p-5 rounded-2xl bg-[#571C31] text-[#FFF8F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#B82E5F] text-white flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className=" text-sm sm:text-base font-bold text-[#FFF8F3]">
              ¿Querés acelerar tus reservas este fin de semana?
            </h4>
            <p className=" text-xs sm:text-sm text-[#F5DCE5]/80 mt-0.5 max-w-xl">
              Promocioná tu trabajo estrella en Pocitos con Glow Boost desde $200 UYU. Aparece como patrocinado a clientas cercanas con alta intención de reserva.
            </p>
          </div>
        </div>

        <Button
          variant="blush"
          size="sm"
          onClick={() => setCurrentSection('boost')}
          className="whitespace-nowrap flex-shrink-0"
        >
          Crear Glow Boost
        </Button>
      </div>
    </div>
  );
};
