import { Booking, BusinessProfile, PortfolioWork, Review, Service } from '../types';
import { PHOTOS_BUCKET, supabase } from './supabase';

/** Fotos incluidas en la app (rutas relativas): la app de usuarias necesita la dirección completa. */
const absoluteUrl = (url: string): string => (url.startsWith('/') ? `${window.location.origin}${url}` : url);

/**
 * En una computadora local (localhost) no se publica el catálogo, para no dejar en la base fotos con
 * direcciones que otra persona no puede abrir. Se puede forzar con VITE_FORCE_SYNC=true.
 */
export const canPublish = (): boolean =>
  Boolean(import.meta.env.VITE_FORCE_SYNC) || !['localhost', '127.0.0.1'].includes(window.location.hostname);

const warn = (what: string, error: { message: string } | null) => {
  if (error) console.warn(`Supabase: ${what}:`, error.message);
  return !error;
};

// ---------------------------------------------------------------- Fotos
const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => (await fetch(dataUrl)).blob();

/** Sube una foto a la carpeta de la cuenta y devuelve su dirección pública (o null si falla). */
export const uploadPhoto = async (dataUrl: string, userId: string): Promise<string | null> => {
  try {
    const blob = await dataUrlToBlob(dataUrl);
    const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: '31536000',
    });
    if (!warn('subir foto', error)) return null;
    return supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
  } catch (error) {
    console.warn('Supabase: subir foto:', error);
    return null;
  }
};

// ---------------------------------------------------------------- Estado privado de la cuenta
/** Todo lo que la cuenta guarda y que no sale de sus tablas públicas (reservas aparte). */
export interface PersistedState {
  businessProfile: BusinessProfile;
  services: Service[];
  portfolio: PortfolioWork[];
  team: unknown[];
  reviews: Review[];
  integrations: unknown[];
  boostCampaigns: unknown[];
}

export type LoadedState = { ok: true; state: Partial<PersistedState> | null } | { ok: false };

export const loadBusinessState = async (userId: string): Promise<LoadedState> => {
  const { data, error } = await supabase.from('business_state').select('state').eq('owner_id', userId).maybeSingle();
  if (error) {
    console.warn('Supabase: leer estado:', error.message);
    return { ok: false };
  }
  return { ok: true, state: (data?.state as Partial<PersistedState> | undefined) ?? null };
};

export const saveBusinessState = async (userId: string, state: PersistedState): Promise<boolean> =>
  warn(
    'guardar estado',
    (
      await supabase
        .from('business_state')
        .upsert({ owner_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: 'owner_id' })
    ).error
  );

// ---------------------------------------------------------------- Reservas
interface BookingRow {
  id: string;
  business_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  service_id: string;
  service_name: string;
  professional_id: string;
  professional_name: string;
  date: string;
  time: string;
  duration_minutes: number;
  price_uyu: number;
  status: Booking['status'];
  source: Booking['source'];
  notes: string | null;
  released_slot_published: boolean;
}

/** Solo los campos que maneja el comercio: `client_user_id` y `created_at` los define la app de usuarias. */
const toBookingRow = (userId: string, b: Booking) => ({
  id: b.id,
  business_id: userId,
  client_name: b.clientName,
  client_phone: b.clientPhone,
  client_email: b.clientEmail,
  service_id: b.serviceId,
  service_name: b.serviceName,
  professional_id: b.professionalId,
  professional_name: b.professionalName,
  date: b.date,
  time: b.time,
  duration_minutes: b.durationMinutes,
  price_uyu: b.priceUYU,
  status: b.status,
  source: b.source,
  notes: b.notes ?? null,
  released_slot_published: Boolean(b.releasedSlotPublished),
  updated_at: new Date().toISOString(),
});

const fromBookingRow = (row: BookingRow): Booking => ({
  id: row.id,
  clientName: row.client_name,
  clientPhone: row.client_phone,
  clientEmail: row.client_email,
  serviceId: row.service_id,
  serviceName: row.service_name,
  professionalId: row.professional_id,
  professionalName: row.professional_name,
  date: row.date,
  time: row.time,
  durationMinutes: row.duration_minutes,
  priceUYU: row.price_uyu,
  status: row.status,
  source: row.source,
  notes: row.notes ?? undefined,
  releasedSlotPublished: row.released_slot_published,
});

/** Reservas del comercio que existen en la base (incluye las que hacen las usuarias). */
export const fetchRemoteBookings = async (userId: string): Promise<Booking[] | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('business_id', userId)
    .order('created_at', { ascending: false });
  if (!warn('leer reservas', error)) return null;
  return (data as BookingRow[]).map(fromBookingRow);
};

// ---------------------------------------------------------------- Catálogo público
interface PublishInput {
  userId: string;
  profile: BusinessProfile;
  services: Service[];
  portfolio: PortfolioWork[];
  bookings: Booking[];
  reviews: Review[];
}

const notIn = (ids: string[]): string => `(${ids.map((id) => `"${id.replace(/"/g, '')}"`).join(',')})`;

/** Publica el comercio (perfil, servicios y trabajos) para la app de usuarias y guarda sus reservas. */
export const publishBusiness = async ({ userId, profile, services, portfolio, bookings, reviews }: PublishInput): Promise<void> => {
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  const now = new Date().toISOString();

  const businessOk = warn(
    'publicar comercio',
    (
      await supabase.from('businesses').upsert(
        {
          id: userId,
          owner_id: userId,
          name: profile.name,
          description: profile.description,
          categories: profile.categories,
          specialties: profile.specialties,
          location: profile.location,
          address: profile.address,
          instagram: profile.instagram,
          tiktok: profile.tiktok,
          avatar_url: absoluteUrl(profile.avatarUrl),
          cover_url: absoluteUrl(profile.coverUrl),
          hours: profile.hours,
          rating,
          reviews_count: reviews.length,
          plan: profile.plan,
          published: true,
          updated_at: now,
        },
        { onConflict: 'id' }
      )
    ).error
  );
  if (!businessOk) return; // sin el comercio no se pueden guardar las demás tablas

  const activeServices = services.filter((s) => s.active);
  if (activeServices.length > 0) {
    warn(
      'publicar servicios',
      (
        await supabase.from('services').upsert(
          activeServices.map((s) => ({
            id: s.id,
            business_id: userId,
            name: s.name,
            category: s.category,
            specialty: s.specialty,
            description: s.description,
            duration_minutes: s.durationMinutes,
            price_uyu: s.priceUYU,
            price_prefix: s.pricePrefix ?? null,
            professional_id: s.professionalId,
            professional_name: s.professionalName ?? '',
            active: true,
            updated_at: now,
          })),
          { onConflict: 'id' }
        )
      ).error
    );
  }
  const servicesDelete = supabase.from('services').delete().eq('business_id', userId);
  warn(
    'quitar servicios borrados',
    (activeServices.length ? await servicesDelete.not('id', 'in', notIn(activeServices.map((s) => s.id))) : await servicesDelete).error
  );

  const publicWorks = portfolio.filter((w) => w.status === 'approved' && (w.source === 'my_work' || w.addedToProfile));
  if (publicWorks.length > 0) {
    warn(
      'publicar trabajos',
      (
        await supabase.from('works').upsert(
          publicWorks.map((w) => ({
            id: w.id,
            business_id: userId,
            title: w.title,
            service_id: w.serviceId,
            service_name: w.serviceName,
            professional_name: w.professionalName,
            price_uyu: w.priceUYU,
            description: w.description,
            tags: w.tags,
            image_url: absoluteUrl(w.imageUrl),
            source: w.source,
            status: w.status,
            added_to_profile: Boolean(w.addedToProfile),
            client_name: w.clientName ?? null,
            review_rating: w.reviewRating ?? null,
            review_text: w.reviewText ?? null,
            views: w.views,
            saves: w.saves,
            bookings_count: w.bookings,
            updated_at: now,
          })),
          { onConflict: 'id' }
        )
      ).error
    );
  }
  const worksDelete = supabase.from('works').delete().eq('business_id', userId);
  warn(
    'quitar trabajos borrados',
    (publicWorks.length ? await worksDelete.not('id', 'in', notIn(publicWorks.map((w) => w.id))) : await worksDelete).error
  );

  if (bookings.length > 0) {
    warn(
      'guardar reservas',
      (await supabase.from('bookings').upsert(bookings.map((b) => toBookingRow(userId, b)), { onConflict: 'id' })).error
    );
  }
};
