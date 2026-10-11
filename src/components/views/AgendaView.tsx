import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { WEEKDAY_NAMES, addDays, formatWeekRange, relativeDayLabel, startOfWeek, toDateKey } from '../../utils/date';
import { PlanLock } from '../common/PlanLock';
import { hasPlan } from '../../data/plans';
import {
  Calendar,
  Clock,
  Plus,
  Lock,
  Sun,
  Radio,
  CheckCircle2,
  CalendarDays,
  RefreshCw,
  Sparkles,
  Link2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const TIME_SLOTS = ['09:30', '11:00', '13:00', '15:00', '16:30', '18:00', '19:30'];

export const AgendaView: React.FC = () => {
  const {
    businessProfile,
    bookings,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    publishReleasedSlot,
    integrations,
    toggleIntegration,
    services,
    team,
    clients,
    switchPlan,
  } = useApp();
  const { showToast } = useToast();
  // Semana visible: arranca en la semana de hoy y se navega con las flechas
  const today = new Date();
  const todayKey = toDateKey(today);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const isCurrentWeek = toDateKey(weekStart) === toDateKey(startOfWeek(today));
  const hasGlowAgenda = hasPlan(businessProfile.plan, 'start_plus');

  const [activeTab, setActiveTab] = useState<'glow_agenda' | 'integrations'>('glow_agenda');
  const [isConnectingId, setIsConnectingId] = useState<string | null>(null);

  // New Booking Modal
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientName: 'Lucía Fernández',
    clientPhone: '+598 98 441 209',
    clientEmail: 'lucia.f@gmail.com',
    serviceId: services[0]?.id || '',
    professionalId: team[0]?.id || '',
    date: '2026-10-09',
    time: '16:30',
    durationMinutes: 60,
    priceUYU: 850,
    status: 'confirmed' as Booking['status'],
    source: 'Perfil' as Booking['source'],
    notes: '',
  });

  // Block time / Vacation modal
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    type: 'bloqueado' as 'bloqueado' | 'vacaciones',
    date: '2026-10-10',
    time: '12:00',
    duration: '2 horas',
    note: 'Descanso de equipo / almuerzo',
  });

  // Released / cancelled bookings that can be published
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  const handleOpenNewBooking = (date?: string, time?: string) => {
    setBookingForm({
      clientName: clients[0]?.name || 'Nueva clienta',
      clientPhone: '+598 99 123 456',
      clientEmail: 'clienta@gmail.com',
      serviceId: services[0]?.id || '',
      professionalId: team[0]?.id || '',
      date: date || todayKey,
      time: time || '16:30',
      durationMinutes: 60,
      priceUYU: 850,
      status: 'confirmed',
      source: 'Perfil',
      notes: '',
    });
    setNewBookingModalOpen(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const srv = services.find((s) => s.id === bookingForm.serviceId);
    const prof = team.find((t) => t.id === bookingForm.professionalId);

    addBooking({
      clientName: bookingForm.clientName,
      clientPhone: bookingForm.clientPhone,
      clientEmail: bookingForm.clientEmail,
      serviceId: bookingForm.serviceId,
      serviceName: srv?.name || 'Servicio',
      professionalId: bookingForm.professionalId,
      professionalName: prof?.name || 'Profesional',
      date: bookingForm.date,
      time: bookingForm.time,
      durationMinutes: Number(bookingForm.durationMinutes),
      priceUYU: Number(bookingForm.priceUYU),
      status: bookingForm.status,
      source: bookingForm.source,
      notes: bookingForm.notes,
    });

    showToast('Turno agendado', `Turno para ${bookingForm.clientName} a las ${bookingForm.time} hs.`, 'success');
    setNewBookingModalOpen(false);
  };

  const handlePublishReleasedSlot = (bookingId: string) => {
    publishReleasedSlot(bookingId);
    showToast(
      'Este horario ya puede ser descubierto en GlowBuzz',
      'Las clientas que buscan citas de último momento en Pocitos verán este turno destacado.',
      'success'
    );
  };

  const handleConnectIntegration = (id: any) => {
    setIsConnectingId(id);
    setTimeout(() => {
      toggleIntegration(id);
      setIsConnectingId(null);
      showToast('Integración actualizada', 'Conexión sincronizada exitosamente.', 'success');
    }, 900);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      blockForm.type === 'vacaciones' ? 'Vacaciones registradas' : 'Horario bloqueado',
      `Se bloqueó la agenda para el ${blockForm.date}.`,
      'info'
    );
    setBlockModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Agenda & Turnos
          </h2>
        </div>

        {hasGlowAgenda && (
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBlockModalOpen(true)}
            leftIcon={<Lock className="w-3.5 h-3.5" />}
          >
            Bloquear horario
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenNewBooking()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo turno
          </Button>
        </div>
        )}
      </div>

      {/* Tabs: Glow Agenda vs Integración externa */}
      <div className="flex items-center gap-2 border-b border-[#571C31]/10">
        <button
          onClick={() => setActiveTab('glow_agenda')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            activeTab === 'glow_agenda'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Glow Agenda semanal</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            activeTab === 'integrations'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Conectar agenda externa</span>
        </button>
      </div>

      {/* A. GLOW AGENDA (Glow Start +) */}
      {activeTab === 'glow_agenda' && !hasGlowAgenda && (
        <PlanLock
          requiredPlan="start_plus"
          title="La Glow Agenda es parte de Glow Start +"
          description="Organizá tus turnos con la agenda desarrollada por GlowBuzz. Mientras tanto, podés conectar la agenda que ya usás."
        />
      )}
      {activeTab === 'glow_agenda' && hasGlowAgenda && (
        <div className="space-y-6">
          {/* Banner de turnos cancelados con "Se liberó este horario" */}
          {cancelledBookings.length > 0 && (
            <div className="space-y-3">
              {cancelledBookings.map((cancelled) => (
                <div
                  key={cancelled.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F9] border-2 border-dashed border-[#B82E5F]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F5DCE5] text-[#B82E5F] flex-shrink-0 mt-0.5">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className=" text-sm font-bold text-[#571C31]">
                          Se liberó este horario:
                        </span>
                        <Badge variant="cherry">
                          {relativeDayLabel(cancelled.date)} · {cancelled.time} hs
                        </Badge>
                      </div>
                      <p className=" text-xs text-[#571C31]/75 mt-0.5">
                        Cancelado por {cancelled.clientName} ({cancelled.serviceName} con {cancelled.professionalName}). Publicalo para que otra clienta lo ocupe.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={cancelled.releasedSlotPublished ? 'outline' : 'primary'}
                    size="sm"
                    disabled={cancelled.releasedSlotPublished}
                    onClick={() => handlePublishReleasedSlot(cancelled.id)}
                    className="whitespace-nowrap flex-shrink-0"
                  >
                    {cancelled.releasedSlotPublished ? 'Publicado en GlowBuzz ✓' : 'Publicar disponibilidad'}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Calendario Semanal Visual */}
          <Card className="p-0 overflow-hidden">
            {/* Header del calendario */}
            <div className="p-4 bg-[#FFF8F9] border-b border-[#571C31]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className=" text-base font-bold text-[#181416]">
                  {formatWeekRange(weekStart)}
                </span>
                <span className="text-xs text-[#571C31]/60 hidden sm:inline">
                  (Pocitos · Horario activo)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isCurrentWeek && (
                  <button
                    type="button"
                    onClick={() => setWeekStart(startOfWeek(new Date()))}
                    className="px-3 py-1.5 rounded-lg border border-[#571C31]/15 hover:bg-[#F5DCE5]/40 text-xs font-semibold text-[#571C31]"
                  >
                    Hoy
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Semana anterior"
                  onClick={() => setWeekStart((w) => addDays(w, -7))}
                  className="p-1.5 rounded-lg border border-[#571C31]/15 hover:bg-[#F5DCE5]/40 text-[#571C31]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Semana siguiente"
                  onClick={() => setWeekStart((w) => addDays(w, 7))}
                  className="p-1.5 rounded-lg border border-[#571C31]/15 hover:bg-[#F5DCE5]/40 text-[#571C31]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid semanal */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 divide-x divide-y sm:divide-y-0 divide-[#571C31]/10 min-h-[420px] bg-white">
              {WEEKDAY_NAMES.map((dayName, dayIndex) => {
                const dayDate = addDays(weekStart, dayIndex);
                const dayDateStr = toDateKey(dayDate);
                const isToday = dayDateStr === todayKey;
                const dayBookings = bookings.filter((b) => b.date === dayDateStr);

                return (
                  <div key={dayName} className={`p-3 flex flex-col justify-between ${isToday ? 'bg-[#FFF8F9]' : ''}`}>
                    <div>
                      {/* Day Header */}
                      <div className="text-center pb-2.5 mb-2.5 border-b border-[#571C31]/10">
                        <span className="text-xs font-bold text-[#571C31] uppercase tracking-wider block">
                          {dayName.slice(0, 3)}
                        </span>
                        <span
                          className={`inline-flex items-center justify-center min-w-7 h-7 px-1 mt-0.5 rounded-full text-sm font-extrabold ${
                            isToday ? 'bg-[#B82E5F] text-white' : 'text-[#181416]'
                          }`}
                        >
                          {String(dayDate.getDate()).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Day Event Slots */}
                      <div className="space-y-2">
                        {dayBookings.map((b) => {
                          const statusStyles = {
                            confirmed: 'bg-[#FFF8F9] border-[#B82E5F]/30 text-[#181416]',
                            pending: 'bg-amber-50 border-amber-200 text-amber-900',
                            completed: 'bg-stone-50 border-stone-200 text-stone-700 opacity-70',
                            cancelled: 'bg-red-50 border-red-200 text-red-700 opacity-60 line-through',
                          }[b.status];

                          return (
                            <div
                              key={b.id}
                              onClick={() => handleOpenNewBooking(b.date, b.time)}
                              className={`p-2.5 rounded-xl border text-left text-xs transition-all hover:shadow-xs cursor-pointer ${statusStyles}`}
                            >
                              <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                                <span>{b.time} hs</span>
                                <span>${b.priceUYU}</span>
                              </div>
                              <p className="font-semibold text-xs truncate text-[#181416]">{b.clientName}</p>
                              <p className="text-[10px] text-[#571C31]/75 truncate">
                                {b.serviceName} ({b.professionalName})
                              </p>
                            </div>
                          );
                        })}

                        {/* Free Slot CTA */}
                        {dayBookings.length < 3 && (
                          <button
                            type="button"
                            onClick={() => handleOpenNewBooking(dayDateStr, '15:00')}
                            className="w-full py-2 border border-dashed border-[#571C31]/20 hover:border-[#B82E5F] rounded-xl text-[11px] font-semibold text-[#571C31]/50 hover:text-[#B82E5F] hover:bg-[#FFF8F9] transition-colors"
                          >
                            + Turno
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* B. INTEGRACIÓN EXTERNA */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#571C31]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className=" text-lg font-bold text-[#181416]">
                  Conectá tu agenda existente
                </h3>
              </div>
              <p className=" text-xs sm:text-sm text-[#571C31]/75 mt-1 max-w-xl leading-relaxed">
                Si ya usás Google Calendar, Koobing, Agendoro o AgendaPro, podés sincronizar en tiempo real para que tus reservas se actualicen automáticamente sin solapamientos.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {integrations.map((item) => {
              const isConnecting = isConnectingId === item.id;

              return (
                <Card
                  key={item.id}
                  className="p-5 flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF8F9] border border-[#571C31]/10 flex items-center justify-center font-bold text-sm text-[#B82E5F]">
                          {item.name[0]}
                        </div>
                        <div>
                          <h4 className=" text-base font-bold text-[#181416]">
                            {item.name}
                          </h4>
                          {item.badge && <Badge variant="blush" size="sm">{item.badge}</Badge>}
                        </div>
                      </div>

                      {item.connected && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          Conectado ✓
                        </span>
                      )}
                    </div>

                    <p className=" text-xs text-[#571C31]/75 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.connected && item.lastSync && (
                      <p className="text-[11px] text-[#571C31]/60 mt-3 flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 text-emerald-600" />
                        <span>Última sincronización: {item.lastSync}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#571C31]/10 flex items-center justify-between">
                    {item.connected ? (
                      <>
                        <span className="text-xs text-[#571C31]/60 font-medium">Estado activo</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnectIntegration(item.id)}
                          className="text-red-700 hover:text-red-800 text-xs"
                        >
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isConnecting}
                        onClick={() => {
                          handleConnectIntegration(item.id);
                        }}
                        className="w-full"
                      >
                        {isConnecting ? 'Conectando...' : 'Conectar'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Nuevo Turno */}
      <Modal
        isOpen={newBookingModalOpen}
        onClose={() => setNewBookingModalOpen(false)}
        title="Crear nuevo turno"
        subtitle="Registrá la cita en tu Glow Agenda."
      >
        <form onSubmit={handleSaveBooking} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Clienta
              </label>
              <input
                type="text"
                required
                value={bookingForm.clientName}
                onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                placeholder="Nombre de clienta"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                WhatsApp
              </label>
              <input
                type="text"
                value={bookingForm.clientPhone}
                onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Servicio
              </label>
              <select
                value={bookingForm.serviceId}
                onChange={(e) => {
                  const srv = services.find((s) => s.id === e.target.value);
                  setBookingForm({
                    ...bookingForm,
                    serviceId: e.target.value,
                    priceUYU: srv ? srv.priceUYU : bookingForm.priceUYU,
                    durationMinutes: srv ? srv.durationMinutes : bookingForm.durationMinutes,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (${s.priceUYU})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Profesional
              </label>
              <select
                value={bookingForm.professionalId}
                onChange={(e) => setBookingForm({ ...bookingForm, professionalId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              >
                {team.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                required
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Hora
              </label>
              <input
                type="time"
                required
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Monto ($)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={bookingForm.priceUYU}
                onChange={(e) => setBookingForm({ ...bookingForm, priceUYU: Number(e.target.value) })}
                className="w-full px-2.5 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs font-bold text-[#571C31]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Estado
            </label>
            <select
              value={bookingForm.status}
              onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            >
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setNewBookingModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              Guardar turno
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Bloquear Horario / Vacaciones */}
      <Modal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        title="Bloquear horario o vacaciones"
        subtitle="Evita que clientas agenden en horarios no disponibles."
      >
        <form onSubmit={handleSaveBlock} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBlockForm({ ...blockForm, type: 'bloqueado' })}
              className={`p-3 rounded-xl border text-center text-xs font-bold ${
                blockForm.type === 'bloqueado'
                  ? 'border-[#B82E5F] bg-[#F5DCE5] text-[#571C31]'
                  : 'border-[#571C31]/20 bg-white text-[#571C31]/70'
              }`}
            >
              Bloqueo puntual
            </button>
            <button
              type="button"
              onClick={() => setBlockForm({ ...blockForm, type: 'vacaciones' })}
              className={`p-3 rounded-xl border text-center text-xs font-bold ${
                blockForm.type === 'vacaciones'
                  ? 'border-[#B82E5F] bg-[#F5DCE5] text-[#571C31]'
                  : 'border-[#571C31]/20 bg-white text-[#571C31]/70'
              }`}
            >
              Vacaciones / Feriado
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={blockForm.date}
                onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Hora / Duración
              </label>
              <input
                type="text"
                value={blockForm.duration}
                onChange={(e) => setBlockForm({ ...blockForm, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Motivo
            </label>
            <input
              type="text"
              value={blockForm.note}
              onChange={(e) => setBlockForm({ ...blockForm, note: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setBlockModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              Confirmar bloqueo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
