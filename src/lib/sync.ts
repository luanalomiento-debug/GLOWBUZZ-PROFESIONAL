import { Booking, BusinessProfile, PortfolioWork, Review, Service } from '../types';
import { inList, sbDelete, sbSelect, sbUpsert } from './supabase';

/** Identificador del comercio en la base compartida con la app de usuarias. */
export const PUBLISHED_BUSINESS_ID = 'lumina-studio';

/** Dirección pública de esta app: desde ahí la app de usuarias carga las fotos incluidas en el proyecto. */
const PUBLIC_ORIGIN: string = import.meta.env.VITE_PUBLIC_ORIGIN || window.location.origin;

/** Las fotos incluidas en la app son rutas relativas: la otra app necesita la dirección completa. */
const absoluteUrl = (url: string): string => (url.startsWith('/') ? `${PUBLIC_ORIGIN}${url}` : url);

/**
 * En una computadora local (localhost) no se publica, para no dejar en la base fotos con direcciones
 * que otra persona no puede abrir. Se puede forzar con VITE_FORCE_SYNC=true.
 */
export const canPublish = (): boolean =>
  Boolean(import.meta.env.VITE_FORCE_SYNC) || !['localhost', '127.0.0.1'].includes(window.location.hostname);

interface BookingRow {
  id: string;
  business_id: string;
  client_user_id: string;
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
const toBookingRow = (b: Booking): Omit<BookingRow, 'client_user_id'> & { updated_at: string } => ({
  id: b.id,
  business_id: PUBLISHED_BUSINESS_ID,
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

interface PublishInput {
  profile: BusinessProfile;
  services: Service[];
  portfolio: PortfolioWork[];
  bookings: Booking[];
  reviews: Review[];
}

/** Publica el catálogo del comercio (y sus reservas) para que la app de usuarias lo muestre. */
export const publishBusiness = async ({ profile, services, portfolio, bookings, reviews }: PublishInput): Promise<void> => {
  const rating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 4.8;

  const okBusiness = await sbUpsert('businesses', [
    {
      id: PUBLISHED_BUSINESS_ID,
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
      updated_at: new Date().toISOString(),
    },
  ]);
  if (!okBusiness) return; // sin el comercio no se pueden guardar el resto de las tablas

  const now = new Date().toISOString();
  const activeServices = services.filter((s) => s.active);
  await sbUpsert(
    'services',
    activeServices.map((s) => ({
      id: s.id,
      business_id: PUBLISHED_BUSINESS_ID,
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
    }))
  );
  await sbDelete(
    'services',
    `business_id=eq.${PUBLISHED_BUSINESS_ID}${activeServices.length ? `&id=not.in.${inList(activeServices.map((s) => s.id))}` : ''}`
  );

  const publicWorks = portfolio.filter((w) => w.status === 'approved' && (w.source === 'my_work' || w.addedToProfile));
  await sbUpsert(
    'works',
    publicWorks.map((w) => ({
      id: w.id,
      business_id: PUBLISHED_BUSINESS_ID,
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
    }))
  );
  await sbDelete(
    'works',
    `business_id=eq.${PUBLISHED_BUSINESS_ID}${publicWorks.length ? `&id=not.in.${inList(publicWorks.map((w) => w.id))}` : ''}`
  );

  await sbUpsert('bookings', bookings.map(toBookingRow));
};

/** Reservas que existen en la base (por ejemplo, las que hicieron las usuarias). */
export const fetchRemoteBookings = async (): Promise<Booking[] | null> => {
  const rows = await sbSelect<BookingRow>('bookings', `business_id=eq.${PUBLISHED_BUSINESS_ID}&order=created_at.desc`);
  return rows ? rows.map(fromBookingRow) : null;
};
