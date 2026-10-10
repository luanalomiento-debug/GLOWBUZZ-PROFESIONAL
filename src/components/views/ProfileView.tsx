import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { TeamView } from './TeamView';
import { ImageUpload } from '../common/ImageUpload';
import { useToast } from '../../context/ToastContext';
import {
  Camera,
  Pencil,
  Eye,
  MapPin,
  Instagram,
  Clock,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Service } from '../../types';
import { INITIAL_BUSINESS_PROFILE } from '../../data/initialData';

const CATEGORY_CHIPS = [
  'Peluquería',
  'Uñas',
  'Cejas',
  'Pestañas',
  'Maquillaje',
  'Depilación',
  'Estética facial',
  'Estética corporal',
  'Masajes',
  'Bronceado',
  'Medicina estética',
  'Otros',
];

export const ProfileView: React.FC<{ initialTab?: 'info' | 'services' | 'hours' | 'team' }> = ({ initialTab = 'info' }) => {
  const {
    businessProfile,
    updateProfile,
    services,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    team,
    setPreviewAsClientModalOpen,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'hours' | 'team'>(initialTab);

  // Form state: el perfil se ve en modo lectura y solo se edita al activar "Editar perfil"
  const buildProfileForm = () => ({
    name: businessProfile.name,
    description: businessProfile.description,
    categories: [...businessProfile.categories],
    specialtiesText: businessProfile.specialties.join(', '),
    location: businessProfile.location,
    address: businessProfile.address,
    instagram: businessProfile.instagram,
    tiktok: businessProfile.tiktok,
    avatarUrl: businessProfile.avatarUrl,
    coverUrl: businessProfile.coverUrl,
    modality: businessProfile.modality,
    hours: businessProfile.hours.map((h) => ({ ...h })),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(buildProfileForm);

  const handleCancelEditing = () => {
    setProfileForm(buildProfileForm());
    setIsEditing(false);
  };

  // Service Modal state (Add / Edit)
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Uñas',
    specialty: '',
    durationMinutes: 60,
    priceUYU: 850,
    pricePrefix: '',
    description: '',
    professionalId: team[0]?.id || '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = profileForm.specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      name: profileForm.name,
      description: profileForm.description,
      categories: profileForm.categories,
      specialties,
      location: profileForm.location,
      address: profileForm.address,
      instagram: profileForm.instagram,
      tiktok: profileForm.tiktok,
      avatarUrl: profileForm.avatarUrl,
      coverUrl: profileForm.coverUrl,
      modality: profileForm.modality,
      hours: profileForm.hours,
    });

    setIsEditing(false);
    showToast('Perfil actualizado', 'Los cambios ya son visibles para tus clientas en Glow Buzz.', 'success');
  };

  const toggleCategory = (cat: string) => {
    setProfileForm((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        if (prev.categories.length === 1) return prev;
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      category: 'Uñas',
      specialty: 'Manicuría',
      durationMinutes: 60,
      priceUYU: 850,
      pricePrefix: '',
      description: '',
      professionalId: team[0]?.id || '',
    });
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      category: service.category,
      specialty: service.specialty,
      durationMinutes: service.durationMinutes,
      priceUYU: service.priceUYU,
      pricePrefix: service.pricePrefix || '',
      description: service.description,
      professionalId: service.professionalId,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    const selectedProf = team.find((t) => t.id === serviceForm.professionalId);

    if (editingServiceId) {
      updateService(editingServiceId, {
        name: serviceForm.name,
        category: serviceForm.category,
        specialty: serviceForm.specialty,
        durationMinutes: Number(serviceForm.durationMinutes),
        priceUYU: Number(serviceForm.priceUYU),
        pricePrefix: serviceForm.pricePrefix || undefined,
        description: serviceForm.description,
        professionalId: serviceForm.professionalId,
        professionalName: selectedProf?.name || 'Profesional',
      });
      showToast('Servicio actualizado', `Se modificó "${serviceForm.name}".`, 'success');
    } else {
      addService({
        name: serviceForm.name,
        category: serviceForm.category,
        specialty: serviceForm.specialty,
        durationMinutes: Number(serviceForm.durationMinutes),
        priceUYU: Number(serviceForm.priceUYU),
        pricePrefix: serviceForm.pricePrefix || undefined,
        description: serviceForm.description,
        professionalId: serviceForm.professionalId,
        professionalName: selectedProf?.name || 'Profesional',
        active: true,
      });
      showToast('Servicio agregado', `"${serviceForm.name}" ya está disponible en tu catálogo.`, 'success');
    }

    setServiceModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Mi perfil público
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <>
              <Button variant="ghost" size="md" onClick={handleCancelEditing}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveProfile}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Guardar cambios
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="md"
                onClick={() => setPreviewAsClientModalOpen(true)}
                leftIcon={<Eye className="w-4 h-4 text-[#B82E5F]" />}
              >
                Ver como clienta
              </Button>
              {(activeTab === 'info' || activeTab === 'hours') && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Pencil className="w-4 h-4" />}
                >
                  Editar perfil
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs de sección */}
      <div className="flex items-center gap-2 border-b border-[#571C31]/10">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'info'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          Información general
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            activeTab === 'services'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          <span>Servicios y precios</span>
          <span className="text-xs bg-[#F5DCE5] text-[#571C31] px-1.5 py-0.5 rounded-md">
            {services.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hours')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'hours'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          Horarios de atención
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'team'
              ? 'border-[#B82E5F] text-[#B82E5F]'
              : 'border-transparent text-[#571C31]/60 hover:text-[#571C31]'
          }`}
        >
          Equipo
        </button>
      </div>

      {/* TAB 4: EQUIPO (misma página de siempre) */}
      {activeTab === 'team' && <TeamView />}

      {/* TAB 1: INFORMACIÓN GENERAL */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveProfile}>
          <fieldset disabled={!isEditing} className="space-y-6 min-w-0">
          {/* Header Visual: Portada y Avatar */}
          <Card className="p-0 overflow-hidden">
            {/* Cover image */}
            <div className="relative h-44 sm:h-auto sm:aspect-[3/1] bg-stone-100 overflow-hidden">
              <img
                src={profileForm.coverUrl}
                alt="Portada"
                className="w-full h-full object-cover"
              />
              <ImageUpload
                maxDim={1600}
                onSelect={(url) => setProfileForm((prev) => ({ ...prev, coverUrl: url }))}
                className="edit-only absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Cambiar portada</span>
              </ImageUpload>
            </div>

            {/* Avatar & main identity */}
            <div className="p-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
              <div className="flex items-end gap-4">
                <div className="relative group">
                  <img
                    src={profileForm.avatarUrl}
                    alt={profileForm.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
                  />
                  <ImageUpload
                    maxDim={500}
                    onSelect={(url) => setProfileForm((prev) => ({ ...prev, avatarUrl: url }))}
                    className="edit-only absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center justify-center text-white transition-opacity"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="w-5 h-5" />
                  </ImageUpload>
                </div>

                <div className="mb-2">
                  <h3 className=" text-xl font-bold text-[#181416]">
                    {profileForm.name}
                  </h3>
                  <p className="text-xs text-[#571C31]/70">
                    {profileForm.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Badge variant="cherry">Perfil Verificado</Badge>
                <Badge variant="blush">Estudio en Pocitos</Badge>
              </div>
            </div>
          </Card>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <h4 className=" text-base font-bold text-[#181416] border-b border-[#571C31]/10 pb-2">
                Datos del estudio
              </h4>

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Nombre comercial
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Descripción pública (Bio)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Especialidades (separadas por coma)
                </label>
                <input
                  type="text"
                  value={profileForm.specialtiesText}
                  onChange={(e) => setProfileForm({ ...profileForm, specialtiesText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                  placeholder="Ej. Nail Art & Kapping, Soft Gel, Micro-detalle"
                />
              </div>
            </Card>

            <Card className="space-y-4">
              <h4 className=" text-base font-bold text-[#181416] border-b border-[#571C31]/10 pb-2">
                Ubicación y Redes
              </h4>

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Barrio o zona
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Dirección exacta
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={profileForm.instagram}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                    TikTok
                  </label>
                  <input
                    type="text"
                    value={profileForm.tiktok}
                    onChange={(e) => setProfileForm({ ...profileForm, tiktok: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                    placeholder="@usuario"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Categorías chips */}
          <Card className="space-y-3">
            <h4 className=" text-base font-bold text-[#181416]">
              Categorías en las que aparecés
            </h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_CHIPS.map((cat) => {
                const isSelected = profileForm.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-[#B82E5F] text-white border-[#B82E5F] shadow-xs'
                        : 'bg-white text-[#571C31]/80 border-[#571C31]/20 hover:border-[#B82E5F]/50'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {cat}
                  </button>
                );
              })}
            </div>
          </Card>
        </fieldset>
        </form>
      )}

      {/* TAB 2: SERVICIOS Y PRECIOS */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className=" text-lg font-bold text-[#181416]">
                Lista de servicios
              </h3>
              <p className="text-xs text-[#571C31]/75">
                Precios transparentes en pesos uruguayos (UYU) y duraciones estimadas.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddService}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Agregar servicio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`p-5 flex flex-col justify-between transition-all ${
                  !service.active ? 'opacity-60 bg-stone-50' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className=" text-base font-bold text-[#181416]">
                        {service.name}
                      </h4>
                      <span className="text-xs text-[#B82E5F] font-semibold">
                        {service.category} · {service.specialty}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className=" text-lg font-bold text-[#571C31]">
                        {service.pricePrefix && `${service.pricePrefix} `}${service.priceUYU}
                      </div>
                      <div className="text-[11px] text-[#571C31]/60 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <p className=" text-xs text-[#571C31]/75 line-clamp-2 leading-relaxed mb-3">
                    {service.description}
                  </p>

                  <div className="text-[11px] text-[#571C31]/60">
                    Realizado por: <strong className="text-[#181416]">{service.professionalName || 'Equipo'}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#571C31]/10 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleServiceStatus(service.id)}
                    className={` font-medium ${
                      service.active ? 'text-stone-500 hover:text-stone-800' : 'text-emerald-700 font-bold'
                    }`}
                  >
                    {service.active ? 'Desactivar' : 'Reactivar'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditService(service)}
                      className="p-1.5 text-[#571C31]/70 hover:text-[#B82E5F] rounded-lg transition-colors"
                      title="Editar servicio"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar ${service.name}?`)) {
                          deleteService(service.id);
                          showToast('Servicio eliminado', '', 'info');
                        }
                      }}
                      className="p-1.5 text-[#571C31]/70 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HORARIOS DE ATENCIÓN */}
      {activeTab === 'hours' && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className=" text-base font-bold text-[#181416]">
                Horarios semanales
              </h3>
              <p className="text-xs text-[#571C31]/75">
                {isEditing
                  ? 'Activá o desactivá los días y ajustá la hora de apertura y cierre.'
                  : 'Tocá "Editar horarios" para activar o desactivar días y cambiar las horas.'}
              </p>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancelEditing}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveProfile} leftIcon={<Check className="w-4 h-4" />}>
                  Guardar horarios
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} leftIcon={<Pencil className="w-4 h-4" />}>
                Editar horarios
              </Button>
            )}
          </div>

          <fieldset disabled={!isEditing} className="space-y-4 min-w-0">

          <div className="divide-y divide-[#571C31]/10">
            {profileForm.hours.map((hour, idx) => (
              <div key={hour.day} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={hour.active}
                    onChange={(e) => {
                      const updated = [...profileForm.hours];
                      updated[idx].active = e.target.checked;
                      setProfileForm({ ...profileForm, hours: updated });
                    }}
                    className="accent-[#B82E5F] w-4 h-4 rounded"
                  />
                  <span
                    className={` text-sm font-semibold ${
                      hour.active ? 'text-[#181416]' : 'text-stone-400'
                    }`}
                  >
                    {hour.day}
                  </span>
                </div>

                {hour.active ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => {
                        const updated = [...profileForm.hours];
                        updated[idx].open = e.target.value;
                        setProfileForm({ ...profileForm, hours: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#571C31]/20 bg-white"
                    />
                    <span className="text-[#571C31]/50">a</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => {
                        const updated = [...profileForm.hours];
                        updated[idx].close = e.target.value;
                        setProfileForm({ ...profileForm, hours: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#571C31]/20 bg-white"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-stone-400 italic">
                    Cerrado
                  </span>
                )}
              </div>
            ))}
          </div>

          </fieldset>
        </Card>
      )}

      {/* Modal: Agregar / Editar Servicio */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingServiceId ? 'Editar servicio' : 'Nuevo servicio'}
        subtitle="Los servicios agregados quedan visibles en tu perfil y listos para reservar."
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Nombre del servicio
            </label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
              placeholder="Ej. Kapping Gel Fortalecedor"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Categoría
              </label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              >
                {CATEGORY_CHIPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Especialidad
              </label>
              <input
                type="text"
                value={serviceForm.specialty}
                onChange={(e) => setServiceForm({ ...serviceForm, specialty: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                placeholder="Ej. Manicuría"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Precio en UYU ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#571C31]/60 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  value={serviceForm.priceUYU}
                  onChange={(e) => setServiceForm({ ...serviceForm, priceUYU: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm font-bold"
                  placeholder="850"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Duración (minutos)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={5}
                step={5}
                required
                list="duration-options"
                value={serviceForm.durationMinutes}
                onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                placeholder="Elegí o escribí los minutos"
              />
              <datalist id="duration-options">
                {[30, 45, 60, 75, 90, 120, 150, 180].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Profesional que lo realiza
            </label>
            <select
              value={serviceForm.professionalId}
              onChange={(e) => setServiceForm({ ...serviceForm, professionalId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            >
              {team.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Descripción del servicio
            </label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              placeholder="Detallá los pasos, productos utilizados y qué incluye el servicio."
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setServiceModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              {editingServiceId ? 'Guardar cambios' : 'Agregar servicio'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
