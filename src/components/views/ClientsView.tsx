import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  FileText,
  DollarSign,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.favoriteService.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Mis clientas
          </h2>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#571C31]/40 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#571C31]/20 bg-white text-xs focus:outline-none focus:border-[#B82E5F]"
          />
        </div>
      </div>

      {/* Tabla de Clientas */}
      <Card className="p-0 overflow-hidden">
        {filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#571C31]/10 bg-[#FFF8F9]/60 text-[11px] font-bold text-[#571C31] uppercase tracking-wider">
                  <th className="py-3 px-4">Clienta</th>
                  <th className="py-3 px-4">Última visita</th>
                  <th className="py-3 px-4">Reservas</th>
                  <th className="py-3 px-4">Servicio favorito</th>
                  <th className="py-3 px-4">Origen</th>
                  <th className="py-3 px-4">Total invertido</th>
                  <th className="py-3 px-4 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#571C31]/10 text-xs">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-[#FFF8F9]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.avatarUrl}
                          alt={client.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#B82E5F]/20 flex-shrink-0"
                        />
                        <div>
                          <p className=" font-bold text-[#181416]">
                            {client.name}
                          </p>
                          <p className="text-[11px] text-[#571C31]/60">
                            {client.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#571C31]">
                      {client.lastVisit}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#181416]">
                      {client.bookingsCount} citas
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#181416]">
                      {client.favoriteService}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="cherry">{client.source}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#571C31]">
                      ${client.totalSpentUYU.toLocaleString()} UYU
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                        className="text-[#B82E5F] hover:underline font-bold text-xs"
                      >
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#571C31]/60">
            No se encontraron clientas con ese criterio.
          </div>
        )}
      </Card>

      {/* Modal: Ficha Detalle de Clienta */}
      {selectedClient && (
        <Modal
          isOpen={Boolean(selectedClient)}
          onClose={() => setSelectedClient(null)}
          title="Ficha de clienta"
          subtitle={`Perfil de recurrencia en ${selectedClient.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10">
              <img
                src={selectedClient.avatarUrl}
                alt={selectedClient.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className=" text-lg font-bold text-[#181416]">
                  {selectedClient.name}
                </h3>
                <p className="text-xs text-[#571C31]/80">
                  {selectedClient.phone} · {selectedClient.email}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="cherry">Origen: {selectedClient.source}</Badge>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Clienta frecuente
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-[#571C31]/10">
                <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                  Total citas
                </span>
                <span className=" text-xl font-bold text-[#181416]">
                  {selectedClient.bookingsCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#571C31]/10">
                <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                  Última visita
                </span>
                <span className=" text-xs font-bold text-[#571C31] mt-1 block">
                  {selectedClient.lastVisit}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#571C31]/10">
                <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                  Total invertido
                </span>
                <span className=" text-base font-bold text-[#B82E5F]">
                  ${selectedClient.totalSpentUYU}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#571C31]/10 text-xs space-y-1">
              <strong className="block text-[#181416]">
                Servicio predilecto:
              </strong>
              <p className="text-[#571C31]">{selectedClient.favoriteService}</p>
            </div>

            {selectedClient.notes && (
              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#571C31]/10 text-xs space-y-1">
                <strong className="block text-[#181416]">
                  Notas de atención:
                </strong>
                <p className="italic text-[#571C31]/80">{selectedClient.notes}</p>
              </div>
            )}

            <div className="pt-3 border-t border-[#571C31]/10 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>
                Cerrar ficha
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
