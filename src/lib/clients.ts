import { Booking, Client } from '../types';

/** Arma el listado de clientas a partir de las reservas (una por teléfono, email o nombre). */
export const deriveClients = (bookings: Booking[]): Client[] => {
  const groups = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = (b.clientPhone || b.clientEmail || b.clientName).trim().toLowerCase();
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), b]);
  }

  return [...groups.entries()]
    .map(([key, list]) => {
      const sorted = [...list].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      const counted = list.filter((b) => b.status !== 'cancelled');
      const services = new Map<string, number>();
      counted.forEach((b) => services.set(b.serviceName, (services.get(b.serviceName) ?? 0) + 1));
      const favorite = [...services.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? sorted[0].serviceName;
      const latest = sorted[0];
      return {
        id: `cli_${key}`,
        name: latest.clientName,
        phone: latest.clientPhone,
        email: latest.clientEmail,
        avatarUrl: '',
        lastVisit: latest.date,
        bookingsCount: counted.length,
        favoriteService: favorite,
        source: latest.source,
        totalSpentUYU: list
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + b.priceUYU, 0),
        notes: '',
      } as Client;
    })
    .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
};
