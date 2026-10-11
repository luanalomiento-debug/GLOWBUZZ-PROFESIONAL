import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  Search,
  Send,
  MessageSquare,
  Sparkles,
  Bot,
  CheckCircle2,
  Share2,
} from 'lucide-react';

const REPUTATION_TAGS = [
  { name: 'Resultado', count: 114, percent: '90%' },
  { name: 'Atención', count: 98, percent: '77%' },
  { name: 'Puntualidad', count: 86, percent: '68%' },
  { name: 'Ambiente', count: 72, percent: '56%' },
  { name: 'Calidad-precio', count: 65, percent: '51%' },
];

export const ReviewsView: React.FC = () => {
  const { reviews, clients, replyToReview, businessProfile, switchPlan } = useApp();
  const { showToast } = useToast();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [clientQuery, setClientQuery] = useState('');
  const [selectedService, setSelectedService] = useState('Semipermanente Rusa');
  // null = se usa el mensaje sugerido; si la profesional lo edita, se guarda su versión
  const [messageDraft, setMessageDraft] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const matchingClients = clients.filter((c) => {
    const term = clientQuery.trim().toLowerCase();
    return !term || c.name.toLowerCase().includes(term) || c.phone.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
  });
  const businessSlug = businessProfile.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const suggestedMessage = `¡Hola${selectedClient ? ` ${selectedClient.name.split(' ')[0]}` : ''}! Gracias por visitarnos en ${businessProfile.name}. ¿Nos dejás tu opinión y una foto del resultado en GlowBuzz? Nos ayuda un montón a crecer: glowbuzz.uy/r/${businessSlug}`;
  const requestMessage = messageDraft ?? suggestedMessage;

  const openRequestModal = () => {
    setClientQuery('');
    setMessageDraft(null);
    setRequestModalOpen(true);
  };
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  // Pro Automation Modal
  const [automationModalOpen, setAutomationModalOpen] = useState(false);
  const [automationConfig, setAutomationConfig] = useState({
    enabled: true,
    delayHours: 3,
    channel: 'whatsapp',
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !requestMessage.trim()) return;
    showToast(
      'Solicitud de reseña enviada',
      `Se envió tu mensaje por WhatsApp a ${selectedClient.name}.`,
      'success'
    );
    setRequestModalOpen(false);
  };

  const handleSaveReply = (reviewId: string) => {
    if (!replyDraft.trim()) return;
    replyToReview(reviewId, replyDraft);
    showToast('Respuesta publicada', 'Tu respuesta ahora es pública en tu perfil.', 'success');
    setReplyingReviewId(null);
    setReplyDraft('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
            Reseñas & Reputación
          </h2>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openRequestModal}
          leftIcon={<Send className="w-4 h-4" />}
        >
          Solicitar reseña
        </Button>
      </div>

      {/* Resumen de Reputación */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Score Card (4 cols) */}
        <Card className="md:col-span-4 p-6 flex flex-col justify-between text-center bg-white">
          <div>
            <span className="text-[11px] font-bold text-[#571C31]/60 uppercase tracking-wider">
              Calificación promedio
            </span>
            <div className=" text-5xl font-extrabold text-[#181416] my-2">
              4.8 <span className="text-[#B82E5F] text-4xl">★</span>
            </div>
            <p className="text-xs text-[#571C31]/75">
              Basado en <strong>127 reseñas verificadas</strong>
            </p>
          </div>

          {/* Star Distribution */}
          <div className="mt-5 space-y-1.5 text-xs">
            {[
              { stars: '5 ★', pct: 88 },
              { stars: '4 ★', pct: 9 },
              { stars: '3 ★', pct: 2 },
              { stars: '2 ★', pct: 1 },
              { stars: '1 ★', pct: 0 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="w-7 text-left text-stone-600 font-semibold">{row.stars}</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-8 text-right text-stone-500 text-[10px]">{row.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tags & Pro Automation (8 cols) */}
        <div className="md:col-span-8 space-y-5">
          {/* Tags destacados de reputación */}
          <Card className="p-5">
            <h4 className=" text-xs font-bold text-[#571C31] uppercase tracking-wider mb-3">
              Lo que más destacan tus clientas
            </h4>
            <div className="flex flex-wrap gap-2">
              {REPUTATION_TAGS.map((t) => (
                <div
                  key={t.name}
                  className="px-3.5 py-2 rounded-xl bg-[#FFF8F9] border border-[#571C31]/10 flex items-center gap-2 text-xs"
                >
                  <span className="font-bold text-[#181416]">{t.name}</span>
                  <span className="text-[#B82E5F] font-bold text-[11px] bg-[#F5DCE5] px-1.5 py-0.5 rounded-md">
                    {t.count} ({t.percent})
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Automatización de solicitudes */}
          <Card className="p-5 bg-[#571C31] text-[#FFF8F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#B82E5F] text-white flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className=" text-base font-bold text-[#FFF8F3]">
                    Automatizá las solicitudes de reseñas
                  </h4>
                </div>
                <p className=" text-xs text-[#F5DCE5]/80 mt-0.5 max-w-md">
                  Envía un mensaje cálido por WhatsApp 3 horas después de finalizado el servicio para pedir una foto y reseña sin esfuerzo.
                </p>
              </div>
            </div>

            <Button
              variant="blush"
              size="sm"
              onClick={() => {
                setAutomationModalOpen(true);
              }}
              className="whitespace-nowrap flex-shrink-0"
            >
              Configurar
            </Button>
          </Card>
        </div>
      </div>

      {/* Listado de Reseñas */}
      <div className="space-y-4">
        <h3 className=" text-lg font-bold text-[#181416]">
          Todas las opiniones ({reviews.length})
        </h3>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar src={rev.clientAvatar} name={rev.clientName} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className=" text-sm font-bold text-[#181416]">
                        {rev.clientName}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                        Cita verificada
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#571C31]/70 mt-0.5">
                      <span>{rev.serviceName}</span>
                      <span>· Atendió: {rev.professionalName}</span>
                      <span>· {rev.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex text-amber-500 text-sm">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>

              {/* Comentario */}
              <p className=" text-sm text-[#181416] leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Foto de clienta si tiene */}
              {rev.hasClientPhoto && rev.clientPhotoUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={rev.clientPhotoUrl}
                    alt="Foto de la clienta"
                    className="w-16 h-16 rounded-xl object-cover border border-[#571C31]/10 shadow-2xs"
                  />
                  <span className="text-[11px] text-[#B82E5F] font-bold">
                    + Foto del resultado adjunta
                  </span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rev.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FFF8F9] text-[#571C31]/80 border border-[#571C31]/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Respuesta del estudio */}
              {rev.reply ? (
                <div className="p-3 rounded-xl bg-[#FFF8F9] border-l-3 border-[#B82E5F] text-xs text-[#571C31] mt-2">
                  <strong className="block text-[#181416] mb-0.5">
                    Respuesta de {businessProfile.name}:
                  </strong>
                  {rev.reply}
                </div>
              ) : replyingReviewId === rev.id ? (
                <div className="space-y-2 pt-2 border-t border-[#571C31]/10">
                  <textarea
                    rows={2}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    placeholder="Escribí tu respuesta cálida..."
                    className="w-full p-2.5 rounded-xl border border-[#571C31]/20 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setReplyingReviewId(null)}>
                      Cancelar
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleSaveReply(rev.id)}>
                      Publicar respuesta
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setReplyingReviewId(rev.id);
                      setReplyDraft(`¡Muchas gracias ${rev.clientName.split(' ')[0]}! Un placer tenerte en el estudio.`);
                    }}
                    className="text-xs font-bold text-[#B82E5F] hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Responder a esta reseña</span>
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Modal: Solicitar Reseña */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Solicitar reseña a clienta"
        subtitle="Las clientas reciben un link de GlowBuzz para calificar su cita y subir foto en 1 minuto."
      >
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Seleccionar clienta
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#571C31]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={clientQuery}
                onChange={(e) => setClientQuery(e.target.value)}
                placeholder="Buscar por nombre o teléfono"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm focus:outline-none focus:border-[#B82E5F]"
              />
            </div>
            <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-[#571C31]/10 divide-y divide-[#571C31]/10 bg-white">
              {matchingClients.length > 0 ? (
                matchingClients.map((c) => {
                  const isSelected = c.id === selectedClientId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedClientId(c.id)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                        isSelected ? 'bg-[#F5DCE5]/60' : 'hover:bg-[#FFF8F9]'
                      }`}
                    >
                      <span className="font-semibold text-[#181416]">{c.name}</span>
                      <span className="flex items-center gap-2 text-xs text-[#571C31]/70">
                        {c.phone}
                        {isSelected && <span className="text-[#B82E5F] font-bold">✓</span>}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="px-3.5 py-3 text-xs text-[#571C31]/60">No hay clientas que coincidan con tu búsqueda.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Servicio recibido
            </label>
            <input
              type="text"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider">
                Mensaje de WhatsApp
              </label>
              {messageDraft !== null && (
                <button
                  type="button"
                  onClick={() => setMessageDraft(null)}
                  className="text-[11px] font-semibold text-[#B82E5F] hover:underline"
                >
                  Volver al sugerido
                </button>
              )}
            </div>
            <textarea
              rows={4}
              required
              value={requestMessage}
              onChange={(e) => setMessageDraft(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-white text-sm leading-relaxed focus:outline-none focus:border-[#B82E5F]"
            />
            <p className="text-[11px] text-[#571C31]/60 mt-1">
              Es una sugerencia: podés editarla antes de enviarla.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#571C31]/10">
            <Button variant="ghost" size="md" type="button" onClick={() => setRequestModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="md" type="submit" leftIcon={<Send className="w-4 h-4" />}>
              Enviar solicitud
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Automatización de Reseñas */}
      <Modal
        isOpen={automationModalOpen}
        onClose={() => setAutomationModalOpen(false)}
        title="Automatización de solicitudes"
        subtitle="Pedí reseñas automáticamente después de cada servicio"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#571C31]/10">
            <div>
              <p className=" text-sm font-bold text-[#181416]">
                Envío automático activo
              </p>
              <p className="text-xs text-[#571C31]/70">
                Se enviará automáticamente tras finalizar el turno.
              </p>
            </div>
            <input
              type="checkbox"
              checked={automationConfig.enabled}
              onChange={(e) => setAutomationConfig({ ...automationConfig, enabled: e.target.checked })}
              className="accent-[#B82E5F] w-5 h-5 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
              Tiempo de espera post-servicio
            </label>
            <select
              value={automationConfig.delayHours}
              onChange={(e) => setAutomationConfig({ ...automationConfig, delayHours: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
            >
              <option value={1}>1 hora después</option>
              <option value={3}>3 horas después (recomendado)</option>
              <option value={24}>Al día siguiente (24 hs)</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#571C31]/10">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                showToast('Configuración guardada', 'La automatización de reseñas quedó actualizada.', 'success');
                setAutomationModalOpen(false);
              }}
            >
              Guardar configuración
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
