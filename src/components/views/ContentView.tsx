import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioWork } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Tabs } from '../common/Tabs';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Eye,
  Bookmark,
  CalendarCheck,
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Tag,
  Trash2,
  ExternalLink,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_BEAUTY_IMAGES = [
  'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
];

export const ContentView: React.FC = () => {
  const {
    portfolio,
    addPortfolioWork,
    toggleWorkAddedToProfile,
    deletePortfolioWork,
    services,
    team,
    replyToReview,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'my_work' | 'client_ugc' | 'pending'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [replyModalWork, setReplyModalWork] = useState<PortfolioWork | null>(null);
  const [replyText, setReplyText] = useState('');

  // Add work form state
  const [workForm, setWorkForm] = useState({
    title: '',
    serviceId: services[0]?.id || '',
    professionalId: team[0]?.id || '',
    priceUYU: 1100,
    description: '',
    tagsText: 'Nail Art, Tendencia, Glow',
    imageUrl: PRESET_BEAUTY_IMAGES[0],
  });

  // Filtered works by tab
  const filteredWorks = portfolio.filter((work) => {
    if (activeTab === 'all') return work.status === 'approved';
    if (activeTab === 'my_work') return work.source === 'my_work' && work.status === 'approved';
    if (activeTab === 'client_ugc') return work.source === 'client_ugc' && work.status === 'approved';
    if (activeTab === 'pending') return work.status === 'pending';
    return true;
  });

  const handleOpenAddModal = () => {
    setWorkForm({
      title: '',
      serviceId: services[0]?.id || '',
      professionalId: team[0]?.id || '',
      priceUYU: 1100,
      description: '',
      tagsText: 'Kapping, Minimalista, Nude',
      imageUrl: PRESET_BEAUTY_IMAGES[Math.floor(Math.random() * PRESET_BEAUTY_IMAGES.length)],
    });
    setAddModalOpen(true);
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.title.trim()) return;

    const selectedService = services.find((s) => s.id === workForm.serviceId);
    const selectedProf = team.find((t) => t.id === workForm.professionalId);
    const tags = workForm.tagsText.split(',').map((t) => t.trim()).filter(Boolean);

    addPortfolioWork({
      title: workForm.title,
      serviceId: workForm.serviceId,
      serviceName: selectedService?.name || 'Servicio',
      professionalId: workForm.professionalId,
      professionalName: selectedProf?.name || 'Profesional',
      priceUYU: Number(workForm.priceUYU),
      description: workForm.description,
      tags,
      imageUrl: workForm.imageUrl,
      source: 'my_work',
      status: 'approved',
    });

    showToast('Trabajo publicado', 'Tu nuevo trabajo ya está en tu portfolio y visible para clientas.', 'success');
    setAddModalOpen(false);
  };

  const handleToggleAddUgc = (work: PortfolioWork) => {
    toggleWorkAddedToProfile(work.id);
    const isNowAdded = !work.addedToProfile;
    showToast(
      isNowAdded ? 'Agregado a tu perfil' : 'Removido de tu perfil',
      isNowAdded ? 'El resultado de la clienta ahora destaca en tu portada.' : '',
      'info'
    );
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalWork || !replyText.trim()) return;
    showToast('Respuesta enviada', `Le respondiste a ${replyModalWork.clientName || 'la clienta'}.`, 'success');
    setReplyModalWork(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Contenido & Portfolio
          </h2>
          <p className=" text-sm text-[#571C31]/75 mt-0.5">
            Las clientas en Glow Buzz no compran textos: descubren trabajos visuales y reservan lo que ven.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Agregar trabajo
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'all', label: 'Todos', count: portfolio.filter((p) => p.status === 'approved').length },
          { id: 'my_work', label: 'Mis trabajos', count: portfolio.filter((p) => p.source === 'my_work' && p.status === 'approved').length },
          { id: 'client_ugc', label: 'De clientas (UGC)', count: portfolio.filter((p) => p.source === 'client_ugc' && p.status === 'approved').length },
          { id: 'pending', label: 'Pendientes', count: portfolio.filter((p) => p.status === 'pending').length },
        ]}
      />

      {/* Grid de contenido estilo Pinterest/Masonry beauty */}
      {filteredWorks.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredWorks.map((work) => {
            const isUgc = work.source === 'client_ugc';

            return (
              <div
                key={work.id}
                className="break-inside-avoid bg-white rounded-3xl border border-[#571C31]/10 overflow-hidden hover:border-[#B82E5F]/40 transition-all duration-200 shadow-2xs group flex flex-col justify-between"
              >
                {/* Image & Overlay tags */}
                <div className="relative overflow-hidden bg-stone-100">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-xl">
                    ${work.priceUYU} UYU
                  </div>

                  {/* UGC Badge */}
                  {isUgc && (
                    <div className="absolute top-3 left-3 bg-[#B82E5F] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Subido por clienta</span>
                    </div>
                  )}
                </div>

                {/* Content details */}
                <div className="p-5 space-y-3">
                  {/* UGC Review Callout if exists */}
                  {isUgc && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#181416]">
                          {work.clientName}
                        </span>
                        <div className="flex text-amber-500 text-xs">
                          {'★'.repeat(work.reviewRating || 5)}
                        </div>
                      </div>
                      <p className="text-xs italic text-[#571C31]/80 leading-relaxed">
                        "{work.reviewText || work.description}"
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className=" text-base font-bold text-[#181416] group-hover:text-[#B82E5F] transition-colors leading-snug">
                      {work.title}
                    </h3>
                    <p className="text-xs text-[#571C31]/70 mt-0.5">
                      {work.professionalName} · {work.serviceName}
                    </p>
                  </div>

                  {!isUgc && (
                    <p className="text-xs text-[#571C31]/80 leading-relaxed line-clamp-2">
                      {work.description}
                    </p>
                  )}

                  {/* Tags */}
                  {work.tags && work.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FFF8F9] text-[#571C31]/80 border border-[#571C31]/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Métricas: vistas, guardados, reservas */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#571C31]/10 text-xs text-[#571C31]/75">
                    <span className="flex items-center gap-1.5" title="Visualizaciones en el feed de clientas">
                      <Eye className="w-3.5 h-3.5 text-[#B82E5F]" />
                      <strong>{work.views.toLocaleString()}</strong> vistas
                    </span>
                    <span className="flex items-center gap-1.5" title="Guardados en colecciones de inspiración">
                      <Bookmark className="w-3.5 h-3.5 text-[#B82E5F]" />
                      <strong>{work.saves}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#B82E5F]" title="Reservas directas originadas por este trabajo">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <strong>{work.bookings}</strong> reservas
                    </span>
                  </div>

                  {/* UGC specific interactive action buttons */}
                  {isUgc && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#571C31]/10">
                      <button
                        type="button"
                        onClick={() => handleToggleAddUgc(work)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          work.addedToProfile
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#B82E5F] text-white hover:bg-[#A02450]'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{work.addedToProfile ? 'En mi perfil ✓' : 'Agregar a mi perfil'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReplyModalWork(work);
                          setReplyText(
                            `¡Muchas gracias ${work.clientName?.split(' ')[0] || ''}! Nos alegra que te haya encantado el resultado.`
                          );
                        }}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-[#FFF8F9] hover:bg-[#F5DCE5] text-[#571C31] border border-[#571C31]/15 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Responder</span>
                      </button>
                    </div>
                  )}

                  {/* Pending state approval */}
                  {work.status === 'pending' && (
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          handleToggleAddUgc(work);
                          showToast('Resultado aprobado', 'Se aprobó la publicación de la clienta.', 'success');
                        }}
                      >
                        Aprobar y agregar a perfil
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<ImageIcon className="w-6 h-6" />}
          title={
            activeTab === 'pending'
              ? 'No hay contenidos pendientes'
              : activeTab === 'client_ugc'
              ? 'Todavía no hay fotos de clientas'
              : 'Aún no publicaste trabajos'
          }
          description={
            activeTab === 'pending'
              ? 'Todos los resultados publicados por clientas ya fueron moderados.'
              : 'Subí tus primeros resultados para empezar a mostrar lo que hacés y captar clientas que buscan inspiración.'
          }
          actionLabel="Agregar trabajo"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Modal: Agregar Trabajo */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Subir nuevo trabajo al portfolio"
        subtitle="Mostrá los resultados de tu estudio. Cada trabajo publicado alimenta el feed de descubrimiento de clientas."
      >
        <form onSubmit={handleSaveWork} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Título del trabajo
            </label>
            <input
              type="text"
              required
              value={workForm.title}
              onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
              placeholder="Ej. French Chrome Glazed Nude"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Servicio asociado
              </label>
              <select
                value={workForm.serviceId}
                onChange={(e) => setWorkForm({ ...workForm, serviceId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
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
                value={workForm.professionalId}
                onChange={(e) => setWorkForm({ ...workForm, professionalId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              >
                {team.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Precio estimado ($ UYU)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={workForm.priceUYU}
                onChange={(e) => setWorkForm({ ...workForm, priceUYU: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Etiquetas / Tags
              </label>
              <input
                type="text"
                value={workForm.tagsText}
                onChange={(e) => setWorkForm({ ...workForm, tagsText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                placeholder="Separadas por comas"
              />
            </div>
          </div>

          {/* Selector visual de foto para el demo */}
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Elegir imagen de resultado
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {PRESET_BEAUTY_IMAGES.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setWorkForm({ ...workForm, imageUrl: imgUrl })}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative ${
                    workForm.imageUrl === imgUrl
                      ? 'border-[#B82E5F] ring-2 ring-[#B82E5F]/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Descripción técnica del trabajo
            </label>
            <textarea
              rows={2}
              value={workForm.description}
              onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              placeholder="Explicá qué técnica usaste, qué tonos y cómo cuidarlo."
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit">
              Publicar trabajo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Responder a Reseña UGC */}
      {replyModalWork && (
        <Modal
          isOpen={Boolean(replyModalWork)}
          onClose={() => setReplyModalWork(null)}
          title={`Responder a ${replyModalWork.clientName || 'la clienta'}`}
          subtitle={`Tu respuesta se mostrará públicamente junto a la foto en tu perfil de Glow Buzz.`}
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#571C31]/10 flex items-center gap-3">
              <img
                src={replyModalWork.imageUrl}
                alt="Foto"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="text-xs">
                <p className="font-bold text-[#181416]">{replyModalWork.clientName}</p>
                <p className="italic text-[#571C31]/75">"{replyModalWork.reviewText}"</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Tu respuesta como estudio
              </label>
              <textarea
                rows={3}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" size="md" type="button" onClick={() => setReplyModalWork(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="md" type="submit">
                Publicar respuesta
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
