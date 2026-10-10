import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { ImageUpload } from '../common/ImageUpload';
import {
  Users,
  UserPlus,
  Star,
  CalendarCheck,
  Clock,
  Briefcase,
  Shield,
  Edit2,
  Trash2,
  Upload,
} from 'lucide-react';

const PRESET_TEAM_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
];

export const TeamView: React.FC = () => {
  const {
    businessProfile,
    updateProfile,
    team,
    addTeamMember,
    updateTeamMember,
    services,
  } = useApp();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Profesional' as 'Administrador' | 'Profesional',
    specialty: 'Nail Artist',
    avatarUrl: PRESET_TEAM_AVATARS[0],
    servicesSelected: [] as string[],
    schedule: 'Lun a Vie · 10:00 - 19:00',
    rating: 4.9,
  });

  const isIndependent = businessProfile.businessType === 'independent';

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      role: 'Profesional',
      specialty: 'Nail Artist',
      avatarUrl: PRESET_TEAM_AVATARS[Math.floor(Math.random() * PRESET_TEAM_AVATARS.length)],
      servicesSelected: [services[0]?.name || 'Manicuría'],
      schedule: 'Mar a Sáb · 09:30 - 19:30',
      rating: 5.0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      specialty: member.specialty,
      avatarUrl: member.avatarUrl,
      servicesSelected: [...member.services],
      schedule: member.schedule,
      rating: member.rating,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateTeamMember(editingId, {
        name: form.name,
        role: form.role,
        specialty: form.specialty,
        avatarUrl: form.avatarUrl,
        services: form.servicesSelected,
        schedule: form.schedule,
      });
      showToast('Profesional actualizada', `Se guardaron los datos de ${form.name}.`, 'success');
    } else {
      addTeamMember({
        name: form.name,
        role: form.role,
        specialty: form.specialty,
        avatarUrl: form.avatarUrl,
        services: form.servicesSelected,
        schedule: form.schedule,
        rating: form.rating,
      });
      // If it was independent, automatically update profile to studio
      if (isIndependent) {
        updateProfile({ businessType: 'studio', teamSize: '2-3' });
      }
      showToast('Profesional agregada', `${form.name} se sumó al equipo de ${businessProfile.name}.`, 'success');
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Equipo & Colaboradoras
          </h2>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAdd}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Agregar profesional
        </Button>
      </div>

      {/* Si es profesional independiente y no tiene equipo */}
      {isIndependent && team.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="¿Tu negocio creció?"
          description="Agregá profesionales cuando empieces a trabajar en equipo. Podrán tener sus propios calendarios y servicios asignados."
          actionLabel="Agregar profesional"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {team.map((member) => (
            <Card key={member.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#B82E5F]/20 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className=" text-lg font-bold text-[#181416]">
                        {member.name}
                      </h3>
                      <Badge variant={member.role === 'Administrador' ? 'bordo' : 'neutral'} size="sm">
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#B82E5F] font-semibold mt-0.5">
                      {member.specialty}
                    </p>
                    <p className="text-[11px] text-[#571C31]/60 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{member.schedule}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FFF8F9] px-2.5 py-1 rounded-xl border border-[#571C31]/10 text-xs font-bold text-[#571C31]">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{member.rating}</span>
                  <span className="text-stone-400 font-normal">({member.totalReviews})</span>
                </div>
              </div>

              {/* Métricas del miembro */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                    Reservas
                  </span>
                  <span className=" text-base font-bold text-[#181416]">
                    {member.totalBookings}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                    Trabajos
                  </span>
                  <span className=" text-base font-bold text-[#181416]">
                    {member.portfolioCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#571C31]/60 block">
                    Esta semana
                  </span>
                  <span className=" text-base font-bold text-[#B82E5F]">
                    {member.activeAppointments} turnos
                  </span>
                </div>
              </div>

              {/* Servicios que atiende */}
              <div>
                <span className="text-[11px] font-bold text-[#571C31] uppercase tracking-wider block mb-1.5">
                  Servicios asignados
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.services.map((srv) => (
                    <span
                      key={srv}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#571C31]/10 text-[#181416]"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-3 border-t border-[#571C31]/10 flex items-center justify-between text-xs">
                <span className="text-[#571C31]/60">Perfil activo en catálogo</span>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(member)}
                  className=" font-bold text-[#B82E5F] hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar datos</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Agregar / Editar Profesional */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar profesional' : 'Agregar nueva profesional'}
        subtitle="Configurá los datos de quien atenderá a las clientas en tu local."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Nombre
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                placeholder="Ej. Camila"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Rol
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              >
                <option value="Profesional">Profesional</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Especialidad principal
            </label>
            <input
              type="text"
              required
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              placeholder="Ej. Nail Artist & Kapping Specialist"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Horario habitual
            </label>
            <input
              type="text"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              placeholder="Ej. Mar a Sáb · 09:30 - 19:30"
            />
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Foto de perfil
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <ImageUpload
                maxDim={500}
                onSelect={(url) => setForm({ ...form, avatarUrl: url })}
                title="Subir desde tu dispositivo"
                className="w-12 h-12 rounded-xl border-2 border-dashed border-[#B82E5F]/40 hover:border-[#B82E5F] hover:bg-[#F5DCE5]/30 flex items-center justify-center text-[#B82E5F] transition-colors"
              >
                <Upload className="w-4 h-4" />
              </ImageUpload>
              {form.avatarUrl && !PRESET_TEAM_AVATARS.includes(form.avatarUrl) && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#B82E5F] ring-2 ring-[#B82E5F]/30">
                  <img src={form.avatarUrl} alt="Foto elegida" className="w-full h-full object-cover" />
                </div>
              )}
              {PRESET_TEAM_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, avatarUrl: url })}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    form.avatarUrl === url
                      ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30 scale-105'
                      : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingId ? 'Guardar cambios' : 'Agregar al equipo'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
