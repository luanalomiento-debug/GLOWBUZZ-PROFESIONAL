import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlowBuzzLogo } from '../common/GlowBuzzLogo';
import { Button } from '../common/Button';
import { BillingCycle, BusinessType, PlanType } from '../../types';
import { PLANS, formatPrice, getPricing } from '../../data/plans';
import { BillingCycleToggle } from '../common/BillingCycleToggle';
import {
  Sparkles,
  User,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CATEGORY_OPTIONS = [
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

const AGENDA_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp / mensajes', isDigital: false },
  { id: 'paper', label: 'Agenda en papel / notas', isDigital: false },
  { id: 'none', label: 'No uso ninguna', isDigital: false },
  { id: 'gcal', label: 'Google Calendar', isDigital: true },
  { id: 'koobing', label: 'Koobing', isDigital: true },
  { id: 'agendoro', label: 'Agendoro', isDigital: true },
  { id: 'agendapro', label: 'AgendaPro', isDigital: true },
  { id: 'other', label: 'Otra plataforma', isDigital: true },
];

export const OnboardingFlow: React.FC = () => {
  const {
    businessProfile,
    updateProfile,
    switchPlan,
    completeOnboarding,
    onboardingStep,
    setOnboardingStep,
  } = useApp();
  const { showToast } = useToast();

  // Local form state for onboarding
  const [formData, setFormData] = useState({
    ownerName: businessProfile.ownerName || 'Paula',
    ownerLastName: businessProfile.ownerLastName || 'Silva',
    email: businessProfile.email || 'hola@luminastudio.uy',
    phone: businessProfile.phone || '+598 99 234 567',
    password: '••••••••',
    name: businessProfile.name || 'Lumina Studio',
    businessType: businessProfile.businessType || ('studio' as BusinessType),
    categories: businessProfile.categories.length > 0 ? businessProfile.categories : ['Uñas'],
    location: businessProfile.location || 'Pocitos, Montevideo',
    modality: businessProfile.modality || ('local' as 'local' | 'domicilio' | 'ambos'),
    teamSize: businessProfile.teamSize || ('2-3' as 'solo' | '2-3' | '4-6' | '7+'),
    currentAgendaTool: businessProfile.currentAgendaTool || 'WhatsApp / mensajes',
    plan: businessProfile.plan || ('boost' as PlanType),
    billingCycle: (businessProfile.billingCycle || 'monthly') as BillingCycle,
  });

  // "Crear cuenta" recorre todo el cuestionario; "Iniciar sesión" entra directo al panel
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');

  const totalSteps = formData.businessType === 'studio' ? 7 : 6;

  const handleNext = () => {
    // Save state progressively
    updateProfile({
      ownerName: formData.ownerName,
      ownerLastName: formData.ownerLastName,
      email: formData.email,
      phone: formData.phone,
      name: formData.name,
      businessType: formData.businessType,
      categories: formData.categories,
      location: formData.location,
      modality: formData.modality,
      teamSize: formData.teamSize,
      currentAgendaTool: formData.currentAgendaTool,
      plan: formData.plan,
      billingCycle: formData.billingCycle,
    });

    if (onboardingStep < totalSteps) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
      showToast('¡Tu Glow Buzz está listo!', 'Bienvenida a tu panel de negocios.', 'success');
    }
  };

  const handleLogin = () => {
    completeOnboarding();
    showToast('¡Qué bueno verte de nuevo!', 'Entraste a tu panel de negocios.', 'success');
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        if (prev.categories.length === 1) return prev; // keep at least 1
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const selectedAgendaTool = AGENDA_OPTIONS.find((a) => a.label === formData.currentAgendaTool);

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-[#181416] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#571C31]/10">
        <GlowBuzzLogo size="md" />

        {onboardingStep > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#571C31]/70 font-semibold">
              Paso {onboardingStep} de {totalSteps}
            </span>
            <div className="w-24 sm:w-32 h-1.5 bg-[#571C31]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B82E5F] transition-all duration-300 rounded-full"
                style={{ width: `${(onboardingStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Step Container */}
      <main
        className={`w-full mx-auto my-auto py-8 ${
          (formData.businessType === 'independent' && onboardingStep === 6) ||
          (formData.businessType === 'studio' && onboardingStep === 7)
            ? 'max-w-5xl'
            : 'max-w-2xl'
        }`}
      >
        {/* STEP 1: WELCOME */}
        {onboardingStep === 1 && (
          <div className="text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#F5DCE5] text-[#B82E5F] mb-6">
              <Sparkles className="w-8 h-8" />
            </div>

            <h1 className=" text-2xl sm:text-4xl font-extrabold tracking-tight text-[#181416] mb-4 leading-tight">
              Hacé crecer tu negocio de belleza
            </h1>
            <p className=" text-base sm:text-lg text-[#571C31]/80 max-w-lg mx-auto leading-relaxed mb-10">
              Mostrá tu trabajo, construí reputación y llegá a nuevas clientas de forma profesional y simple.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setAuthMode('signup');
                  handleNext();
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Crear cuenta
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  setAuthMode('login');
                  handleNext();
                }}
              >
                Iniciar sesión
              </Button>
            </div>

            <p className="text-xs text-[#571C31]/50 mt-8">
              Solo toma 2 minutos. Aplicamos registro progresivo para que empieces ya.
            </p>
          </div>
        )}

        {/* STEP 2: CREAR CUENTA */}
        {onboardingStep === 2 && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                {authMode === 'login' ? 'Iniciar sesión' : 'Crear cuenta profesional'}
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1">
                {authMode === 'login'
                  ? 'Ingresá con tu email y contraseña para volver a tu panel.'
                  : 'Ingresá tus datos para acceder a tu panel de Glow Buzz.'}
              </p>
            </div>

            <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#571C31]/10">
              {authMode === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                    placeholder="Ej. Paula"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.ownerLastName}
                    onChange={(e) => setFormData({ ...formData, ownerLastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                    placeholder="Ej. Silva"
                  />
                </div>
              </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Email profesional
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                  placeholder="hola@tuestudio.uy"
                />
              </div>

              {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                  placeholder="+598 99 123 456"
                />
              </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={authMode === 'login' ? handleLogin : handleNext}
                >
                  {authMode === 'login' ? 'Iniciar sesión' : 'Continuar'}
                </Button>

                <button
                  type="button"
                  onClick={authMode === 'login' ? handleLogin : handleNext}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#571C31]/20 bg-white hover:bg-stone-50 text-[#181416] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continuar con Google
                </button>

                <p className="text-center text-xs text-[#571C31]/70">
                  {authMode === 'login' ? '¿Todavía no tenés cuenta? ' : '¿Ya tenés cuenta? '}
                  <button
                    type="button"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="font-bold text-[#B82E5F] hover:underline"
                  >
                    {authMode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TIPO DE NEGOCIO */}
        {onboardingStep === 3 && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                ¿Cómo trabajás?
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1">
                Elegí la opción que mejor describe tu modalidad actual. Podés cambiarla en cualquier momento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Card 1: Profesional independiente */}
              <div
                onClick={() => setFormData({ ...formData, businessType: 'independent', teamSize: 'solo' })}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
                  formData.businessType === 'independent'
                    ? 'border-[#B82E5F] shadow-sm bg-[#FFF8F9]/50 ring-2 ring-[#B82E5F]/20'
                    : 'border-[#571C31]/10 hover:border-[#571C31]/30'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8F9] text-[#B82E5F] flex items-center justify-center mb-4">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className=" text-lg font-bold text-[#181416] mb-2">
                    Profesional independiente
                  </h3>
                  <p className=" text-sm text-[#571C31]/75 leading-relaxed">
                    Trabajo por mi cuenta y atiendo directamente a mis clientas.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#B82E5F]">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      formData.businessType === 'independent' ? 'text-[#B82E5F]' : 'text-stone-300'
                    }`}
                  />
                  <span>{formData.businessType === 'independent' ? 'Seleccionado' : 'Elegir'}</span>
                </div>
              </div>

              {/* Card 2: Comercio / estudio */}
              <div
                onClick={() => setFormData({ ...formData, businessType: 'studio' })}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
                  formData.businessType === 'studio'
                    ? 'border-[#B82E5F] shadow-sm bg-[#FFF8F9]/50 ring-2 ring-[#B82E5F]/20'
                    : 'border-[#571C31]/10 hover:border-[#571C31]/30'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF8F9] text-[#571C31] flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className=" text-lg font-bold text-[#181416] mb-2">
                    Comercio / estudio
                  </h3>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#B82E5F]">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      formData.businessType === 'studio' ? 'text-[#B82E5F]' : 'text-stone-300'
                    }`}
                  />
                  <span>{formData.businessType === 'studio' ? 'Seleccionado' : 'Elegir'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: INFORMACIÓN BÁSICA */}
        {onboardingStep === 4 && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                Información básica
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1">
                Solo lo indispensable para comenzar. Podés completar precios y detalles más adelante.
              </p>
            </div>

            <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#571C31]/10 mb-8">
              {/* Nombre comercial */}
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Nombre comercial o marca
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                  placeholder="Ej. Lumina Studio"
                />
              </div>

              {/* Categorías chips */}
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-2">
                  Categorías que ofrecés (elegí una o más)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-[#B82E5F] text-white border-[#B82E5F] shadow-xs'
                            : 'bg-white text-[#571C31]/80 border-[#571C31]/20 hover:border-[#B82E5F]/50 hover:bg-[#F5DCE5]/30'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5">
                  Barrio o zona
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#571C31]/40 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm"
                    placeholder="Ej. Pocitos, Montevideo"
                  />
                </div>
              </div>

              {/* Modalidad */}
              <div>
                <label className="block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-2">
                  Modalidad de atención
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'local', label: 'Local / estudio' },
                    { id: 'domicilio', label: 'A domicilio' },
                    { id: 'ambos', label: 'Ambos' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, modality: m.id as any })}
                      className={`text-xs font-semibold py-2.5 px-3 rounded-xl border text-center transition-all ${
                        formData.modality === m.id
                          ? 'border-[#B82E5F] bg-[#F5DCE5] text-[#571C31]'
                          : 'border-[#571C31]/20 bg-white text-[#571C31]/70 hover:border-[#571C31]/40'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5 (CONDICIONAL): EQUIPO (Solo si Comercio / Estudio) */}
        {onboardingStep === 5 && formData.businessType === 'studio' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                ¿Cuántas personas atienden en tu negocio?
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1">
                Esto nos ayuda a calibrar tu panel y los calendarios.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'solo', label: 'Solo yo' },
                { id: '2-3', label: '2–3' },
                { id: '4-6', label: '4–6' },
                { id: '7+', label: '7+' },
              ].map((sizeOpt) => (
                <button
                  key={sizeOpt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, teamSize: sizeOpt.id as any })}
                  className={`p-5 rounded-2xl border-2 text-center transition-all font-bold text-base ${
                    formData.teamSize === sizeOpt.id
                      ? 'border-[#B82E5F] bg-[#F5DCE5] text-[#571C31] shadow-xs'
                      : 'border-[#571C31]/15 bg-white text-[#571C31]/70 hover:border-[#571C31]/30'
                  }`}
                >
                  {sizeOpt.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5DCE5]/50 border border-[#B82E5F]/20 text-xs text-[#571C31] leading-relaxed mb-8">
              <strong>Nota:</strong> No te pediremos nombres ni fotos ahora. Podrás agregar tu equipo más adelante desde la sección Equipo.
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP: AGENDA ACTUAL (Step 5 if independent, Step 6 if studio) */}
        {((formData.businessType === 'independent' && onboardingStep === 5) ||
          (formData.businessType === 'studio' && onboardingStep === 6)) && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                ¿Cómo gestionás tus turnos hoy?
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1">
                Glow Buzz se adapta a tu manera de trabajar.
              </p>
            </div>

            <div className="space-y-2.5 bg-white p-6 rounded-3xl border border-[#571C31]/10 mb-6">
              {AGENDA_OPTIONS.map((tool) => {
                const isSelected = formData.currentAgendaTool === tool.label;
                return (
                  <label
                    key={tool.id}
                    onClick={() => setFormData({ ...formData, currentAgendaTool: tool.label })}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#B82E5F] bg-[#FFF8F9] text-[#181416] font-semibold'
                        : 'border-[#571C31]/10 hover:border-[#571C31]/25 text-[#571C31]/80'
                    }`}
                  >
                    <span className=" text-sm">{tool.label}</span>
                    <input
                      type="radio"
                      name="agendaTool"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-[#B82E5F] w-4 h-4"
                    />
                  </label>
                );
              })}
            </div>

            {/* Dynamic message based on selection */}
            {selectedAgendaTool && (
              <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#B82E5F]/30 text-xs sm:text-sm text-[#571C31] leading-relaxed mb-8 flex items-start gap-3">
                <CalendarCheck className="w-5 h-5 text-[#B82E5F] flex-shrink-0 mt-0.5" />
                <div>
                  {!selectedAgendaTool.isDigital ? (
                    <>
                      <strong>¡Perfecto!</strong> Podés organizar tus turnos directamente con{' '}
                      <span className="text-[#B82E5F] font-semibold">Glow Agenda</span>, que forma parte del plan Glow Start +.
                    </>
                  ) : (
                    <>
                      <strong>¡Genial!</strong> Podrás conectar tu agenda actual ({selectedAgendaTool.label}) más adelante desde la sección Agenda.
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP: PLAN (Step 6 if independent, Step 7 if studio) */}
        {((formData.businessType === 'independent' && onboardingStep === 6) ||
          (formData.businessType === 'studio' && onboardingStep === 7)) && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <h2 className=" text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">
                Elegí tu plan de crecimiento
              </h2>
              <p className=" text-sm text-[#571C31]/75 mt-1 max-w-md mx-auto">
                Empezá con 30 días gratis. Sin tarjeta de crédito requerida para comenzar.
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <BillingCycleToggle
                value={formData.billingCycle}
                onChange={(billingCycle) => setFormData({ ...formData, billingCycle })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {PLANS.map((plan) => {
                const pricing = getPricing(plan, formData.billingCycle);
                const isSelected = formData.plan === plan.id;
                const isTop = plan.id === 'boost';
                return (
                  <div
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#B82E5F] shadow-sm bg-[#FFF8F9]/60 ring-2 ring-[#B82E5F]/20'
                        : 'border-[#571C31]/15 hover:border-[#571C31]/30'
                    }`}
                  >
                    {isTop && (
                      <div className="absolute -top-3 right-6 bg-[#571C31] text-[#FFF8F3] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        Más completo
                      </div>
                    )}

                    <div>
                      <div className="mb-2">
                        <span
                          className={`text-sm font-extrabold uppercase ${
                            isTop ? 'text-[#B82E5F]' : 'text-[#571C31]'
                          }`}
                        >
                          {plan.name}
                        </span>
                      </div>

                      <div className="my-3">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#181416]">
                          {formatPrice(pricing.perMonth)}
                        </span>
                        <span className="text-xs text-[#571C31]/70 ml-1.5">UYU / mes</span>
                        {formData.billingCycle === 'annual' && (
                          <p className="text-[11px] text-[#571C31]/70 mt-1">
                            {formatPrice(pricing.charge)} por año ·{' '}
                            <span className="font-bold text-[#B82E5F]">ahorrás {formatPrice(pricing.yearlySavings)}</span>
                          </p>
                        )}
                      </div>

                      <span className="inline-block text-[11px] font-bold text-[#B82E5F] bg-[#F5DCE5] px-2.5 py-0.5 rounded-full mb-4">
                        30 días gratis
                      </span>

                      <p className="text-xs text-[#571C31]/80 leading-relaxed mb-6">{plan.tagline}</p>

                      <div className="space-y-2.5 pt-4 border-t border-[#571C31]/10 text-xs text-[#181416]">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#B82E5F] flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        variant={isSelected ? 'primary' : 'outline'}
                        size="md"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, plan: plan.id });
                          handleNext();
                        }}
                      >
                        Probar gratis
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs text-[#571C31]/60 mb-8">
              No se realizará ningún cobro durante tu prueba. Podés cancelar en cualquier momento con un clic.
            </p>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="max-w-3xl w-full mx-auto text-center pt-6 border-t border-[#571C31]/10 text-xs text-[#571C31]/50">
        Glow Buzz Business · Plataforma especializada para profesionales de belleza en Uruguay
      </footer>
    </div>
  );
};
