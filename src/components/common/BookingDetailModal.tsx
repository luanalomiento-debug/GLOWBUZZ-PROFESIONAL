import React from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Button } from './Button';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Mail, Phone, Radio } from 'lucide-react';

interface BookingDetailModalProps {
  bookingId: string;
  onClose: () => void;
}

/** Detalle de una reserva con sus acciones (confirmar, completar, cancelar, publicar el horario liberado). */
export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ bookingId, onClose }) => {
  const { bookings, updateBookingStatus, publishReleasedSlot } = useApp();
  const { showToast } = useToast();

  // Se lee siempre de la lista, así el estado mostrado es el real después de cada acción.
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  const handleStatusChange = (status: typeof booking.status) => {
    updateBookingStatus(booking.id, status);
    showToast('Estado actualizado', `La reserva de ${booking.clientName} ahora figura como ${status}.`, 'info');
  };

  const handlePublishSlot = () => {
    publishReleasedSlot(booking.id);
    showToast(
      'Horario liberado publicado',
      'El turno cancelado ya está en el feed de GlowBuzz para ser reservado por otra clienta.',
      'success'
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Detalle de la reserva"
      subtitle={`Código de referencia: ${booking.id}`}
    >
      <div className="space-y-4">
        {/* Header info card */}
        <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 flex items-center justify-between">
          <div>
            <p className=" text-base font-bold text-[#181416]">
              {booking.clientName}
            </p>
            <div className="flex items-center gap-3 text-xs text-[#571C31]/80 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {booking.clientPhone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {booking.clientEmail}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className=" text-xl font-extrabold text-[#571C31]">
              ${booking.priceUYU}
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
            <p className="font-bold text-[#181416] break-words">{booking.serviceName}</p>
            <p className="text-[#571C31]/80">{booking.durationMinutes} minutos</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#571C31]/10 bg-white space-y-1">
            <span className="text-[#571C31]/60 text-[10px] uppercase font-bold block">
              Cita
            </span>
            <p className="font-bold text-[#181416]">{booking.date}</p>
            <p className="text-[#571C31]/80 break-words">{booking.time} hs · Con {booking.professionalName}</p>
          </div>
        </div>

        {/* Source info */}
        <div className="p-3.5 rounded-xl border border-[#571C31]/10 bg-white flex items-center justify-between text-xs">
          <span className="text-[#571C31]/75">Canal de origen en GlowBuzz:</span>
          <Badge variant="cherry">{booking.source}</Badge>
        </div>

        {booking.notes && (
          <div className="p-3 rounded-xl bg-white border border-[#571C31]/10 text-xs text-[#571C31]/80 italic">
            <strong>Nota:</strong> {booking.notes}
          </div>
        )}

        {/* Cancelled slot re-publish banner */}
        {booking.status === 'cancelled' && (
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
              disabled={booking.releasedSlotPublished}
              onClick={() => handlePublishSlot()}
              className="w-full mt-2"
            >
              {booking.releasedSlotPublished
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
              onClick={() => handleStatusChange('confirmed')}
              disabled={booking.status === 'confirmed'}
            >
              Confirmar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              disabled={booking.status === 'completed'}
            >
              Completar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleStatusChange('cancelled')}
              disabled={booking.status === 'cancelled'}
            >
              Cancelar cita
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
