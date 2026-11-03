import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BookingDetailModal } from '../common/BookingDetailModal';
import { Tabs } from '../common/Tabs';
import {
  Search,
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { bookings } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
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
            <table className="w-full min-w-[720px] text-left border-collapse">
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
                      onClick={() => setSelectedBookingId(b.id)}
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
                            setSelectedBookingId(b.id);
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

      {selectedBookingId && (
        <BookingDetailModal bookingId={selectedBookingId} onClose={() => setSelectedBookingId(null)} />
      )}
    </div>
  );
};
