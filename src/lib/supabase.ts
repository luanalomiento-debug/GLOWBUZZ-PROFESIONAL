import { createClient } from '@supabase/supabase-js';

/**
 * Cliente de Supabase compartido con la app de usuarias (GlowBuzz).
 * La clave "anon" es pública por diseño: lo que cada cuenta puede ver o modificar lo definen
 * las políticas de seguridad de la base (por cuenta), no el secreto de esta clave.
 */
const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://czbidhdklnhvsfiwdhfy.supabase.co';
const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YmlkaGRrbG5odnNmaXdkaGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDU3MDksImV4cCI6MjEwODg4MTcwOX0.jNShiBBt5b44R7fY011d_65AjSKG0dro6xvHHvXa9_g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Clave propia: esta app y la de usuarias viven en dominios distintos, pero así no se pisan en pruebas locales.
    storageKey: 'glowbuzz-business-auth',
  },
});

export const PHOTOS_BUCKET = 'photos';
