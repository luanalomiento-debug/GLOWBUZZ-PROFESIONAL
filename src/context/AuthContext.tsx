import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authErrorMessage } from '../lib/authErrors';

export interface SignUpInput {
  email: string;
  password: string;
  ownerName: string;
  ownerLastName: string;
  phone: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextType {
  user: User | null;
  /** Se está leyendo la sesión guardada (al abrir la app). */
  loading: boolean;
  /** La persona llegó desde el enlace de "olvidé mi contraseña" y debe elegir una nueva. */
  recovering: boolean;
  signUp: (input: SignUpInput) => Promise<AuthResult & { needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      if (event === 'SIGNED_OUT') setRecovering(false);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback<AuthContextType['signUp']>(async (input) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          owner_name: input.ownerName.trim(),
          owner_last_name: input.ownerLastName.trim(),
          phone: input.phone.trim(),
        },
      },
    });
    if (error) return { ok: false, error: authErrorMessage(error) };
    // Con confirmación de email activada, un email ya registrado no devuelve error: devuelve una cuenta sin identidades.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { ok: false, error: authErrorMessage({ code: 'user_already_exists' }) };
    }
    return { ok: true, needsConfirmation: !data.session };
  }, []);

  const signIn = useCallback<AuthContextType['signIn']>(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { ok: false, error: authErrorMessage(error) } : { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const sendPasswordReset = useCallback<AuthContextType['sendPasswordReset']>(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    return error ? { ok: false, error: authErrorMessage(error) } : { ok: true };
  }, []);

  const updatePassword = useCallback<AuthContextType['updatePassword']>(async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, error: authErrorMessage(error) };
    setRecovering(false);
    return { ok: true };
  }, []);

  const value = useMemo(
    () => ({ user, loading, recovering, signUp, signIn, signOut, sendPasswordReset, updatePassword }),
    [user, loading, recovering, signUp, signIn, signOut, sendPasswordReset, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
