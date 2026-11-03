/**
 * Cliente mínimo de Supabase (API REST) compartido con la app de usuarias.
 * La clave "anon" es pública por diseño: la seguridad real la dan las políticas de la base.
 */
const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://czbidhdklnhvsfiwdhfy.supabase.co';
const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YmlkaGRrbG5odnNmaXdkaGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMDU3MDksImV4cCI6MjEwODg4MTcwOX0.jNShiBBt5b44R7fY011d_65AjSKG0dro6xvHHvXa9_g';

const headers = (extra: Record<string, string> = {}): Record<string, string> => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  ...extra,
});

const request = async (path: string, init: RequestInit): Promise<Response | null> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, init);
    if (!response.ok) {
      console.warn(`Supabase ${init.method ?? 'GET'} ${path.split('?')[0]} -> ${response.status}`, await response.text());
      return null;
    }
    return response;
  } catch (error) {
    // Sin conexión: la app sigue funcionando con sus datos locales.
    console.warn('Supabase no disponible:', error);
    return null;
  }
};

export const sbSelect = async <T>(table: string, query = ''): Promise<T[] | null> => {
  const response = await request(`${table}${query ? `?${query}` : ''}`, { headers: headers() });
  return response ? ((await response.json()) as T[]) : null;
};

export const sbUpsert = async (table: string, rows: object[]): Promise<boolean> => {
  if (rows.length === 0) return true;
  const response = await request(table, {
    method: 'POST',
    headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify(rows),
  });
  return response !== null;
};

export const sbDelete = async (table: string, filter: string): Promise<boolean> => {
  const response = await request(`${table}?${filter}`, { method: 'DELETE', headers: headers() });
  return response !== null;
};

/** Valores para un filtro `in.(...)` de PostgREST. */
export const inList = (ids: string[]): string => `(${ids.map((id) => `"${id.replace(/"/g, '')}"`).join(',')})`;
