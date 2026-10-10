import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Tabs } from '../common/Tabs';
import { BillingView } from './BillingView';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Bell,
  Link2,
  Lock,
  CreditCard,
  LogOut,
  RotateCcw,
  Shield,
  Smartphone,
  Globe,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    businessProfile,
    updateProfile,
    restartOnboarding,
    resetAllDemoData,
    setCurrentSection,
  } = useApp();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'integrations' | 'privacy' | 'billing'>('account');

  // Form states
  const [accountForm, setAccountForm] = useState({
    ownerName: businessProfile.ownerName,
    ownerLastName: businessProfile.ownerLastName,
    email: businessProfile.email,
    phone: businessProfile.phone,
    language: 'Español (Uruguay)',
  });

  const [notifications, setNotifications] = useState({
    newBookingPush: true,
    newBookingEmail: true,
    cancellations: true,
    newReview: true,
    weeklyReport: true,
  });

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ownerName: accountForm.ownerName,
      ownerLastName: accountForm.ownerLastName,
      email: accountForm.email,
      phone: accountForm.phone,
    });
    showToast('Ajustes guardados', 'Tus datos de cuenta fueron actualizados.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className=" text-2xl font-bold tracking-tight text-[#181416]">
          Configuración
        </h2>
        <p className=" text-sm text-[#571C31]/75 mt-0.5">
          Administrá tus accesos, notificaciones y preferencias de seguridad.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'account', label: 'Cuenta' },
          { id: 'notifications', label: 'Notificaciones' },
          { id: 'integrations', label: 'Integraciones' },
          { id: 'privacy', label: 'Privacidad' },
          { id: 'billing', label: 'Plan y facturación' },
        ]}
      />

      {/* TAB 1: CUENTA */}
      {activeTab === 'account' && (
        <form onSubmit={handleSaveAccount} className="space-y-6 max-w-2xl">
          <Card className="space-y-4">
            <h3 className=" text-base font-bold text-[#181416] pb-2 border-b border-[#571C31]/10">
              Datos personales del titular
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  value={accountForm.ownerName}
                  onChange={(e) => setAccountForm({ ...accountForm, ownerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Apellido
                </label>
                <input
                  type="text"
                  value={accountForm.ownerLastName}
                  onChange={(e) => setAccountForm({ ...accountForm, ownerLastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                Teléfono de contacto
              </label>
              <input
                type="text"
                value={accountForm.phone}
                onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#571C31]/20 bg-white text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="md" type="submit">
                Guardar cambios
              </Button>
            </div>
          </Card>

          {/* Sesión y Demo Controls */}
          <Card className="p-5 border-red-100 bg-white space-y-4">
            <h3 className=" text-sm font-bold text-red-900 uppercase tracking-wider">
              Acciones de sesión y prototipo
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#181416]">Reiniciar para demostración</p>
                <p className="text-[11px] text-[#571C31]/60">Vuelve al flujo de bienvenida u onboarding inicial.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={restartOnboarding}>
                  Volver al Onboarding
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetAllDemoData();
                    showToast('Datos reiniciados', 'Se cargaron los datos iniciales de Berna Studio.', 'info');
                  }}
                >
                  Reiniciar datos
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    restartOnboarding();
                    showToast('Sesión cerrada', 'Prototipo reiniciado al inicio.', 'info');
                  }}
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: NOTIFICACIONES */}
      {activeTab === 'notifications' && (
        <Card className="space-y-4 max-w-2xl">
          <h3 className=" text-base font-bold text-[#181416] pb-2 border-b border-[#571C31]/10">
            Preferencias de avisos
          </h3>

          <div className="space-y-3 divide-y divide-[#571C31]/10 text-xs">
            {[
              { id: 'newBookingPush', label: 'Nueva reserva confirmada (Alerta en pantalla y sonido)', checked: notifications.newBookingPush },
              { id: 'newBookingEmail', label: 'Resumen de citas por correo electrónico', checked: notifications.newBookingEmail },
              { id: 'cancellations', label: 'Aviso inmediato si una clienta cancela un turno', checked: notifications.cancellations },
              { id: 'newReview', label: 'Notificación cuando una clienta publica una reseña con foto', checked: notifications.newReview },
              { id: 'weeklyReport', label: 'Reporte semanal de métricas y rendimiento en Glow Buzz', checked: notifications.weeklyReport },
            ].map((item) => (
              <label key={item.id} className="pt-3 flex items-center justify-between cursor-pointer">
                <span className="text-[#181416] font-medium pr-4">{item.label}</span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    setNotifications({ ...notifications, [item.id]: e.target.checked });
                    showToast('Preferencia guardada', '', 'info', 1500);
                  }}
                  className="accent-[#B82E5F] w-4 h-4 rounded flex-shrink-0"
                />
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: INTEGRACIONES */}
      {activeTab === 'integrations' && (
        <Card className="p-6 max-w-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#571C31]/10">
            <div>
              <h3 className=" text-base font-bold text-[#181416]">
                Integraciones activas
              </h3>
              <p className="text-xs text-[#571C31]/70">
                Administrá las herramientas conectadas a tu negocio.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentSection('agenda')}>
              Ir a Agenda
            </Button>
          </div>

          <p className="text-xs text-[#571C31]/80 leading-relaxed">
            Podés sincronizar Google Calendar, Koobing, Agendoro o AgendaPro desde la pestaña de Agenda para mantener tus horarios sincronizados en tiempo real.
          </p>
        </Card>
      )}

      {/* TAB 4: PRIVACIDAD */}
      {activeTab === 'privacy' && (
        <Card className="p-6 max-w-2xl space-y-4">
          <h3 className=" text-base font-bold text-[#181416] pb-2 border-b border-[#571C31]/10">
            Privacidad y datos de clientas
          </h3>

          <div className="space-y-3 text-xs text-[#571C31]/80 leading-relaxed">
            <p>
              ✓ Cumplimiento de la Ley N° 18.331 de Protección de Datos Personales en la República Oriental del Uruguay.
            </p>
            <p>
              ✓ Los números de teléfono de tus clientas solo son accesibles por vos y tus colaboradoras registradas para coordinar las citas.
            </p>
            <p>
              ✓ Las fotos UGC subidas por clientas cuentan con autorización expresa para mostrarse en el feed de Glow Buzz.
            </p>
          </div>
        </Card>
      )}

      {/* TAB 5: PLAN Y FACTURACIÓN */}
      {activeTab === 'billing' && <BillingView />}
    </div>
  );
};
