import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MailCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { GlowBuzzLogo } from '../common/GlowBuzzLogo';

type Mode = 'welcome' | 'login' | 'signup' | 'forgot' | 'check-email' | 'reset-sent' | 'recovery';

const MIN_PASSWORD = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#571C31]/20 bg-[#FFF8F9]/60 focus:bg-white focus:outline-none focus:border-[#B82E5F] text-sm';
const labelClass = 'block text-xs font-semibold text-[#571C31] uppercase tracking-wider mb-1.5';

const Field: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}> = ({ id, label, type = 'text', value, onChange, placeholder, autoComplete }) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#571C31]/10">{children}</div>
);

const Title: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181416]">{title}</h2>
    {subtitle && <p className="text-sm text-[#571C31]/75 mt-1">{subtitle}</p>}
  </div>
);

const ErrorText: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
      {message}
    </p>
  ) : null;

/** Registro, inicio de sesión y recuperación de contraseña de GlowBuzz Business. */
export const AuthScreens: React.FC = () => {
  const { signUp, signIn, sendPasswordReset, updatePassword, recovering } = useAuth();
  const [mode, setMode] = useState<Mode>('welcome');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ownerName, setOwnerName] = useState('');
  const [ownerLastName, setOwnerLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const go = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword('');
    setPassword2('');
  };

  const checkEmail = (): boolean => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Escribí un email válido, por ejemplo hola@tunegocio.uy.');
      return false;
    }
    return true;
  };

  const checkNewPassword = (): boolean => {
    if (password.length < MIN_PASSWORD) {
      setError(`La contraseña tiene que tener al menos ${MIN_PASSWORD} caracteres.`);
      return false;
    }
    if (password !== password2) {
      setError('Las dos contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const run = async (action: () => Promise<{ ok: boolean; error?: string }>, onOk: () => void) => {
    setBusy(true);
    setError(null);
    const result = await action();
    setBusy(false);
    if (result.ok) onOk();
    else setError(result.error ?? 'Algo salió mal. Intentá de nuevo.');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerLastName.trim()) return setError('Completá tu nombre y apellido.');
    if (!checkEmail() || !checkNewPassword()) return;
    void run(
      async () => {
        const result = await signUp({ email, password, ownerName, ownerLastName, phone });
        // Con confirmación de email activada no hay sesión todavía: se avisa que revise su correo.
        if (result.ok && result.needsConfirmation) setMode('check-email');
        return result;
      },
      () => undefined
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail()) return;
    if (!password) return setError('Escribí tu contraseña.');
    void run(() => signIn(email, password), () => undefined);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkEmail()) return;
    void run(() => sendPasswordReset(email), () => setMode('reset-sent'));
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkNewPassword()) return;
    void run(() => updatePassword(password), () => undefined);
  };

  const view: Mode = recovering ? 'recovery' : mode;

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-[#181416] flex flex-col justify-between p-4 sm:p-8">
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#571C31]/10">
        <GlowBuzzLogo size="md" />
      </header>

      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        {view === 'welcome' && (
          <div className="text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#F5DCE5] text-[#B82E5F] mb-6">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#181416] mb-4 leading-tight">
              Hacé crecer tu negocio de belleza
            </h1>
            <p className="text-base sm:text-lg text-[#571C31]/80 max-w-lg mx-auto leading-relaxed mb-10">
              Mostrá tu trabajo, construí reputación y llegá a nuevas clientas de forma profesional y simple.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto">
              <Button variant="primary" size="lg" className="w-full" onClick={() => go('signup')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Crear cuenta
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={() => go('login')}>
                Iniciar sesión
              </Button>
            </div>
            <p className="text-xs text-[#571C31]/50 mt-8">Solo toma 2 minutos. Después completás tu perfil paso a paso.</p>
          </div>
        )}

        {view === 'signup' && (
          <div className="animate-in fade-in duration-300">
            <Title title="Crear cuenta profesional" subtitle="Ingresá tus datos para acceder a tu panel de GlowBuzz." />
            <form onSubmit={handleSignUp} noValidate>
              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="ownerName" label="Nombre" value={ownerName} onChange={setOwnerName} placeholder="Ej. Paula" autoComplete="given-name" />
                  <Field id="ownerLastName" label="Apellido" value={ownerLastName} onChange={setOwnerLastName} placeholder="Ej. Silva" autoComplete="family-name" />
                </div>
                <Field id="email" label="Email profesional" type="email" value={email} onChange={setEmail} placeholder="hola@tunegocio.uy" autoComplete="email" />
                <Field id="phone" label="Teléfono / WhatsApp" type="tel" value={phone} onChange={setPhone} placeholder="+598 99 123 456" autoComplete="tel" />
                <Field id="password" label="Contraseña" type="password" value={password} onChange={setPassword} placeholder={`Mínimo ${MIN_PASSWORD} caracteres`} autoComplete="new-password" />
                <Field id="password2" label="Repetí la contraseña" type="password" value={password2} onChange={setPassword2} autoComplete="new-password" />
                <ErrorText message={error} />
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={busy}>
                  Crear cuenta
                </Button>
                <p className="text-center text-xs text-[#571C31]/70">
                  ¿Ya tenés cuenta?{' '}
                  <button type="button" onClick={() => go('login')} className="font-bold text-[#B82E5F] hover:underline">
                    Iniciar sesión
                  </button>
                </p>
              </Card>
            </form>
            <div className="mt-6">
              <Button variant="ghost" size="md" onClick={() => go('welcome')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="animate-in fade-in duration-300">
            <Title title="Iniciar sesión" subtitle="Ingresá con tu email y contraseña para volver a tu panel." />
            <form onSubmit={handleLogin} noValidate>
              <Card>
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="hola@tunegocio.uy" autoComplete="email" />
                <Field id="password" label="Contraseña" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
                <div className="text-right -mt-2">
                  <button type="button" onClick={() => go('forgot')} className="text-xs font-semibold text-[#B82E5F] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <ErrorText message={error} />
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={busy}>
                  Iniciar sesión
                </Button>
                <p className="text-center text-xs text-[#571C31]/70">
                  ¿Todavía no tenés cuenta?{' '}
                  <button type="button" onClick={() => go('signup')} className="font-bold text-[#B82E5F] hover:underline">
                    Crear cuenta
                  </button>
                </p>
              </Card>
            </form>
            <div className="mt-6">
              <Button variant="ghost" size="md" onClick={() => go('welcome')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
            </div>
          </div>
        )}

        {view === 'forgot' && (
          <div className="animate-in fade-in duration-300">
            <Title title="Recuperar contraseña" subtitle="Te enviamos un enlace por email para elegir una contraseña nueva." />
            <form onSubmit={handleForgot} noValidate>
              <Card>
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="hola@tunegocio.uy" autoComplete="email" />
                <ErrorText message={error} />
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={busy}>
                  Enviar enlace
                </Button>
              </Card>
            </form>
            <div className="mt-6">
              <Button variant="ghost" size="md" onClick={() => go('login')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver
              </Button>
            </div>
          </div>
        )}

        {(view === 'check-email' || view === 'reset-sent') && (
          <div className="text-center animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#F5DCE5] text-[#B82E5F] mb-6">
              <MailCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181416] mb-3">Revisá tu email</h2>
            <p className="text-sm sm:text-base text-[#571C31]/80 max-w-md mx-auto leading-relaxed mb-8">
              {view === 'check-email'
                ? `Te enviamos un mensaje a ${email.trim()} para confirmar tu cuenta. Cuando lo confirmes, iniciá sesión.`
                : `Si ${email.trim()} tiene una cuenta, te enviamos un enlace para elegir una contraseña nueva.`}
              {' '}Si no lo ves, mirá en el correo no deseado.
            </p>
            <Button variant="primary" size="lg" onClick={() => go('login')}>
              Ir a iniciar sesión
            </Button>
          </div>
        )}

        {view === 'recovery' && (
          <div className="animate-in fade-in duration-300">
            <Title title="Elegí una contraseña nueva" subtitle="Después de guardarla entrás directo a tu panel." />
            <form onSubmit={handleRecovery} noValidate>
              <Card>
                <Field id="password" label="Contraseña nueva" type="password" value={password} onChange={setPassword} placeholder={`Mínimo ${MIN_PASSWORD} caracteres`} autoComplete="new-password" />
                <Field id="password2" label="Repetí la contraseña" type="password" value={password2} onChange={setPassword2} autoComplete="new-password" />
                <ErrorText message={error} />
                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={busy}>
                  Guardar contraseña
                </Button>
              </Card>
            </form>
          </div>
        )}
      </main>

      <footer className="max-w-3xl w-full mx-auto text-center pt-6 border-t border-[#571C31]/10 text-xs text-[#571C31]/50">
        GlowBuzz Business · Plataforma especializada para profesionales de belleza en Uruguay
      </footer>
    </div>
  );
};
