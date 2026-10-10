import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  MapPin,
  Clock,
  Instagram,
  Check,
  Calendar,
  Sparkles,
  Phone,
  Bookmark,
  Share2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ClientPreviewModal: React.FC = () => {
  const {
    businessProfile,
    services,
    portfolio,
    reviews,
    team,
    previewAsClientModalOpen,
    setPreviewAsClientModalOpen,
    addBooking,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'works' | 'services' | 'reviews' | 'about'>('works');
  const [bookingService, setBookingService] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-10');
  const [bookingTime, setBookingTime] = useState('16:00');

  if (!previewAsClientModalOpen) return null;

  const handleSimulateClientBooking = () => {
    if (!bookingService) return;
    addBooking({
      clientName: 'Clienta de Prueba',
      clientPhone: '+598 99 999 000',
      clientEmail: 'clienta.glowbuzz@gmail.com',
      serviceId: bookingService.id,
      serviceName: bookingService.name,
      professionalId: bookingService.professionalId || team[0]?.id || '',
      professionalName: bookingService.professionalName || team[0]?.name || 'Camila',
      date: bookingDate,
      time: bookingTime,
      durationMinutes: bookingService.durationMinutes,
      priceUYU: bookingService.priceUYU,
      status: 'confirmed',
      source: 'Glow Buzz Feed',
      notes: 'Reserva simulada desde la vista "Ver como clienta".',
    });

    showToast('¡Reserva simulada creada!', 'La reserva se añadió a tu lista de reservas y calendario.', 'success');
    setBookingService(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setPreviewAsClientModalOpen(false)}
      />

      {/* Main Container - Styled like mobile/tablet consumer app window */}
      <div className="relative w-full max-w-2xl bg-[#FFF8F3] rounded-3xl border border-[#571C31]/20 shadow-2xl overflow-hidden z-10 my-4 flex flex-col max-h-[90vh]">
        {/* Top Simulation Bar */}
        <div className="bg-[#181416] text-white px-4 py-2.5 flex items-center justify-between text-xs font-['Space_Grotesk'] font-bold flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#F5DCE5]">Vista pública como clienta en Glow Buzz</span>
          </div>
          <button
            onClick={() => setPreviewAsClientModalOpen(false)}
            className="text-white/60 hover:text-white p-1 rounded-md"
            aria-label="Cerrar vista previa"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable consumer app view */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Hero */}
          <div className="relative h-44 sm:h-52 bg-stone-200">
            <img
              src={businessProfile.coverUrl}
              alt={businessProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-['Space_Grotesk'] font-bold text-[#B82E5F]">
              Glow Buzz Beauty
            </div>
          </div>

          {/* Business Info Header */}
          <div className="p-5 sm:p-6 pb-4 bg-white border-b border-[#571C31]/10 relative -mt-10 sm:-mt-12 mx-3 sm:mx-4 rounded-3xl shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-end gap-3.5">
                <img
                  src={businessProfile.avatarUrl}
                  alt={businessProfile.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-white shadow-md bg-stone-100 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-[#181416]">
                      {businessProfile.name}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-[#B82E5F]" />
                  </div>
                  <p className="text-xs text-[#571C31]/75 font-['Manrope'] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B82E5F]" />
                    <span>{businessProfile.location}</span>
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 font-['Space_Grotesk'] font-bold text-sm text-[#181416]">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.8</span>
                </div>
                <span className="text-[10px] text-[#571C31]/60 font-['Manrope']">
                  127 reseñas
                </span>
              </div>
            </div>

            <p className="text-xs font-['Manrope'] text-[#571C31]/80 mt-3 leading-relaxed">
              {businessProfile.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {businessProfile.categories.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-['Space_Grotesk'] font-bold bg-[#F5DCE5] text-[#571C31] px-2 py-0.5 rounded-md"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Quick action bar */}
            <div className="mt-4 pt-3 border-t border-[#571C31]/10 flex items-center justify-between">
              <div className="text-xs text-[#571C31]/80 font-['Manrope']">
                <span>{businessProfile.address}</span>
              </div>
              <button
                onClick={() => setBookingService(services[0])}
                className="px-4 py-2 bg-[#B82E5F] text-white rounded-xl text-xs font-['Space_Grotesk'] font-bold hover:bg-[#A02450] transition-colors"
              >
                Reservar cita
              </button>
            </div>
          </div>

          {/* Consumer Navigation Tabs */}
          <div className="px-4 sm:px-6 mt-4">
            <div className="flex border-b border-[#571C31]/10 text-xs font-['Space_Grotesk'] font-bold">
              <button
                onClick={() => setActiveTab('works')}
                className={`py-3 px-3.5 border-b-2 -mb-px transition-colors ${
                  activeTab === 'works'
                    ? 'border-[#B82E5F] text-[#B82E5F]'
                    : 'border-transparent text-[#571C31]/60'
                }`}
              >
                Trabajos ({portfolio.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-3 px-3.5 border-b-2 -mb-px transition-colors ${
                  activeTab === 'services'
                    ? 'border-[#B82E5F] text-[#B82E5F]'
                    : 'border-transparent text-[#571C31]/60'
                }`}
              >
                Servicios ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-3.5 border-b-2 -mb-px transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-[#B82E5F] text-[#B82E5F]'
                    : 'border-transparent text-[#571C31]/60'
                }`}
              >
                Reseñas (4.8 ★)
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-3 px-3.5 border-b-2 -mb-px transition-colors ${
                  activeTab === 'about'
                    ? 'border-[#B82E5F] text-[#B82E5F]'
                    : 'border-transparent text-[#571C31]/60'
                }`}
              >
                Info & Horarios
              </button>
            </div>
          </div>

          {/* TAB 1: Trabajos (Pinterest Beauty Feed) */}
          {activeTab === 'works' && (
            <div className="p-4 sm:p-6 grid grid-cols-2 gap-3.5">
              {portfolio.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl border border-[#571C31]/10 overflow-hidden shadow-2xs group flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-['Space_Grotesk'] font-bold px-1.5 py-0.5 rounded-md">
                      ${work.priceUYU}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-['Space_Grotesk'] text-xs font-bold text-[#181416] line-clamp-1">
                      {work.title}
                    </h4>
                    <p className="text-[11px] text-[#571C31]/70 font-['Manrope'] truncate mt-0.5">
                      {work.professionalName}
                    </p>
                    <div className="pt-2 mt-2 border-t border-[#571C31]/10 flex items-center justify-between text-[10px] text-[#571C31]/60 font-['Space_Grotesk']">
                      <span>{work.views} vistas</span>
                      <button
                        onClick={() => {
                          const srv = services.find((s) => s.id === work.serviceId) || services[0];
                          setBookingService(srv);
                        }}
                        className="text-[#B82E5F] font-bold hover:underline"
                      >
                        Quiero este
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Servicios */}
          {activeTab === 'services' && (
            <div className="p-4 sm:p-6 space-y-3">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl bg-white border border-[#571C31]/10 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#181416]">
                      {srv.name}
                    </h4>
                    <p className="text-xs text-[#571C31]/75 font-['Manrope'] mt-0.5">
                      {srv.description}
                    </p>
                    <span className="text-[11px] text-[#571C31]/60 font-['Space_Grotesk'] block mt-1">
                      {srv.durationMinutes} min · Por {srv.professionalName || 'Equipo'}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-['Space_Grotesk'] text-base font-bold text-[#571C31] block">
                      ${srv.priceUYU}
                    </span>
                    <button
                      onClick={() => setBookingService(srv)}
                      className="mt-1 px-3 py-1 bg-[#B82E5F] text-white text-[11px] font-['Space_Grotesk'] font-bold rounded-lg hover:bg-[#A02450] transition-colors"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Reseñas */}
          {activeTab === 'reviews' && (
            <div className="p-4 sm:p-6 space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white border border-[#571C31]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.clientAvatar}
                        alt={rev.clientName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-['Space_Grotesk'] text-xs font-bold text-[#181416] block">
                          {rev.clientName}
                        </span>
                        <span className="text-[10px] text-[#571C31]/60">
                          {rev.serviceName} · {rev.date}
                        </span>
                      </div>
                    </div>
                    <div className="text-amber-500 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-xs font-['Manrope'] text-[#181416] italic">
                    "{rev.comment}"
                  </p>
                  {rev.reply && (
                    <div className="p-2.5 rounded-xl bg-[#FFF8F3] text-[11px] text-[#571C31]">
                      <strong>Respuesta del estudio:</strong> {rev.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Info & Horarios */}
          {activeTab === 'about' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#571C31]/10 space-y-2 text-xs font-['Manrope']">
                <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#181416]">
                  Ubicación & Contacto
                </h4>
                <p><strong>Dirección:</strong> {businessProfile.address}</p>
                <p><strong>Teléfono:</strong> {businessProfile.phone}</p>
                <p><strong>Instagram:</strong> {businessProfile.instagram}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#571C31]/10 space-y-2 text-xs font-['Manrope']">
                <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#181416]">
                  Horarios habituales
                </h4>
                {businessProfile.hours.map((h) => (
                  <div key={h.day} className="flex justify-between py-1 border-b border-[#571C31]/5">
                    <span>{h.day}</span>
                    <span className="font-bold">{h.active ? `${h.open} - ${h.close}` : 'Cerrado'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Simulado de Reserva si la clienta hace clic en Reservar */}
        {bookingService && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFF8F3] rounded-3xl border border-[#571C31]/20 p-6 max-w-sm w-full space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#181416]">
                    Reservar {bookingService.name}
                  </h3>
                  <p className="text-xs text-[#571C31]/75">
                    ${bookingService.priceUYU} UYU · {bookingService.durationMinutes} min
                  </p>
                </div>
                <button
                  onClick={() => setBookingService(null)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-['Space_Grotesk']">
                <div>
                  <label className="block text-[#571C31] font-bold uppercase text-[10px] mb-1">
                    Fecha del turno
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#571C31] font-bold uppercase text-[10px] mb-1">
                    Hora
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white"
                  >
                    <option value="10:00">10:00 hs</option>
                    <option value="11:30">11:30 hs</option>
                    <option value="15:00">15:00 hs</option>
                    <option value="16:00">16:00 hs</option>
                    <option value="18:00">18:00 hs</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setBookingService(null)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#571C31]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSimulateClientBooking}
                  className="px-4 py-2 rounded-xl text-xs font-['Space_Grotesk'] font-bold bg-[#B82E5F] text-white hover:bg-[#A02450]"
                >
                  Confirmar cita
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
