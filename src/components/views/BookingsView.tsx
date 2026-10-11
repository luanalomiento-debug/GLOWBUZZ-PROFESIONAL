import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Tabs } from '../common/Tabs';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  DollarSign,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Radio,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    cancelBooking,
    publishReleasedSlot,
  } = useApp();
  const { showToast } = useToast();

  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    // Tab filter
    if (filterTab === 'upcoming' && !(b.status === 'confirmed' || b.status === 'pending')) return false;
    if (filterTab === 'completed' && b.status !== 'completed') return false;
    if (filterTab === 'cancelled' && b.status !== 'cancelled') return false;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        b.clientName.toLowerCase().includes(term) ||
        b.serviceName.toLowerCase().includes(term) ||
        b.source.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleStatusChange = (bookingId: string, status: Booking['status']) => {
    updateBookingStatus(bookingId, status);
    showToast('Estado actualizado', `La reserva ahora figura como ${status}.`, 'info');
    if (selectedBooking) {
      setSelectedBooking({ ...selectedBooking, status });
    }
  };

  const handlePublishSlot = (bookingId: string) => {
    publishReleasedSlot(bookingId);
    showToast(
      'Horario liberado publicado',
      'El turno cancelado ya está en el feed de GlowBuzz para ser reservado por otra clienta.',
      'success'
    );
    if (selectedBooking) {
      setSelectedBooking({ ...selectedBooking, releasedSlotPublished: true });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Gestión de reservas
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#571C31]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por clienta o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs focus:outline-none focus:border-[#B82E5F]"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={filterTab}
        onChange={setFilterTab}
        tabs={[
          { id: 'all', label: 'Todas', count: bookings.length },
          { id: 'upcoming', label: 'Próximas', count: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length },
          { id: 'completed', label: 'Completadas', count: bookings.filter((b) => b.status === 'completed').length },
          { id: 'cancelled', label: 'Canceladas', count: bookings.filter((b) => b.status === 'cancelled').length },
        ]}
      />

      {/* Bookings Table / Cards */}
      <Card className="p-0 overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#571C31]/10 bg-[#FFF8F9]/60 text-[11px] font-bold text-[#571C31] uppercase tracking-wider">
                  <th className="py-3 px-4">Clienta</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Profesional</th>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Origen</th>
                  <th className="py-3 px-4">Monto</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#571C31]/10 text-xs">
                {filteredBookings.map((b) => {
                  const statusBadge = {
                    confirmed: <Badge variant="success">Confirmada</Badge>,
                    pending: <Badge variant="warning">Pendiente</Badge>,
                    completed: <Badge variant="neutral">Completada</Badge>,
                    cancelled: <Badge variant="neutral" className="line-through text-red-700 bg-red-50">Cancelada</Badge>,
                  }[b.status];

                  const originBadge = {
                    'GlowBuzz Feed': <Badge variant="cherry">Feed</Badge>,
                    'Búsqueda': <Badge variant="bordo">Búsqueda</Badge>,
                    'Perfil': <Badge variant="neutral">Perfil</Badge>,
                    'Trabajo de clienta': <Badge variant="blush">UGC</Badge>,
                    'Glow Boost': <Badge variant="sponsored">Boost</Badge>,
                  }[b.source] || <Badge variant="neutral">{b.source}</Badge>;

                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-[#FFF8F9]/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-[#181416]">
                        {b.clientName}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#181416]">
                        {b.serviceName}
                      </td>
                      <td className="py-3.5 px-4 text-[#571C31]/80">
                        {b.professionalName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#571C31]">
                        {b.date} · {b.time} hs
                      </td>
                      <td className="py-3.5 px-4">
                        {originBadge}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#181416]">
                        ${b.priceUYU}
                      </td>
                      <td className="py-3.5 px-4">
                        {statusBadge}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className="text-[#B82E5F] hover:underline font-bold text-xs"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#571C31]/60">
            No se encontraron reservas con este filtro.
          </div>
        )}
      </Card>

      {/* Modal: Detalle de Reserva */}
      {selectedBooking && (
        <Modal
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          title="Detalle de la reserva"
          subtitle={`Código de referencia: ${selectedBooking.id}`}
        >
          <div className="space-y-4">
            {/* Header info card */}
            <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 flex items-center justify-between">
              <div>
                <p className=" text-base font-bold text-[#181416]">
                  {selectedBooking.clientName}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#571C31]/80 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedBooking.clientPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedBooking.clientEmail}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className=" text-xl font-extrabold text-[#571C31]">
                  ${selectedBooking.priceUYU}
                </span>
                <span className="block text-[10px] text-[#571C31]/60">UYU</span>
              </div>
            </div>

            {/* Service & Date details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#571C31]/10 bg-white space-y-1">
                <span className="text-[#571C31]/60 text-[10px] uppercase font-bold block">
                  Servicio
                </span>
                <p className="font-bold text-[#181416]">{selectedBooking.serviceName}</p>
                <p className="text-[#571C31]/80">{selectedBooking.durationMinutes} minutos</p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#571C31]/10 bg-white space-y-1">
                <span className="text-[#571C31]/60 text-[10px] uppercase font-bold block">
                  Cita
                </span>
                <p className="font-bold text-[#181416]">{selectedBooking.date}</p>
                <p className="text-[#571C31]/80">{selectedBooking.time} hs · Con {selectedBooking.professionalName}</p>
              </div>
            </div>

            {/* Source info */}
            <div className="p-3.5 rounded-xl border border-[#571C31]/10 bg-white flex items-center justify-between text-xs">
              <span className="text-[#571C31]/75">Canal de origen en GlowBuzz:</span>
              <Badge variant="cherry">{selectedBooking.source}</Badge>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 rounded-xl bg-white border border-[#571C31]/10 text-xs text-[#571C31]/80 italic">
                <strong>Nota:</strong> {selectedBooking.notes}
              </div>
            )}

            {/* Cancelled slot re-publish banner */}
            {selectedBooking.status === 'cancelled' && (
              <div className="p-4 rounded-xl bg-[#FFF8F9] border border-[#B82E5F]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#B82E5F]" />
                  <span className="text-xs font-bold text-[#571C31]">
                    Se liberó este horario en tu estudio
                  </span>
                </div>
                <p className="text-xs text-[#571C31]/75">
                  Podés volver a ofrecer este turno a clientas en el feed de descubrimientos de GlowBuzz.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedBooking.releasedSlotPublished}
                  onClick={() => handlePublishSlot(selectedBooking.id)}
                  className="w-full mt-2"
                >
                  {selectedBooking.releasedSlotPublished
                    ? 'Publicado en GlowBuzz ✓'
                    : 'Publicar disponibilidad'}
                </Button>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-3 border-t border-[#571C31]/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                  disabled={selectedBooking.status === 'confirmed'}
                >
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                  disabled={selectedBooking.status === 'completed'}
                >
                  Completar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                  disabled={selectedBooking.status === 'cancelled'}
                >
                  Cancelar cita
                </Button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
