import React from 'react';
import { GlowBuzzLogo } from './GlowBuzzLogo';

/** Pantalla de carga mientras se lee la sesión o los datos de la cuenta. */
export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Cargando tu cuenta…' }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
    <GlowBuzzLogo size="lg" />
    <p className="text-sm text-[#571C31]/70">{message}</p>
  </div>
);
