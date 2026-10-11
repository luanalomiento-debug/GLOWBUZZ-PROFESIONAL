const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const WEEKDAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** YYYY-MM-DD en hora local (evita el corrimiento de día de toISOString). */
export const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const addDays = (d: Date, days: number): Date => {
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  return next;
};

/** Lunes de la semana de `d`. */
export const startOfWeek = (d: Date): Date => {
  const offset = (d.getDay() + 6) % 7; // lunes = 0
  return addDays(d, -offset);
};

/** "Semana del 5 al 11 de octubre de 2026" (o con dos meses / dos años si la semana cruza). */
export const formatWeekRange = (monday: Date): string => {
  const sunday = addDays(monday, 6);
  const start = `${monday.getDate()}`;
  const end = `${sunday.getDate()}`;
  if (monday.getFullYear() !== sunday.getFullYear()) {
    return `Semana del ${start} de ${MONTHS[monday.getMonth()]} de ${monday.getFullYear()} al ${end} de ${MONTHS[sunday.getMonth()]} de ${sunday.getFullYear()}`;
  }
  if (monday.getMonth() !== sunday.getMonth()) {
    return `Semana del ${start} de ${MONTHS[monday.getMonth()]} al ${end} de ${MONTHS[sunday.getMonth()]} de ${sunday.getFullYear()}`;
  }
  return `Semana del ${start} al ${end} de ${MONTHS[sunday.getMonth()]} de ${sunday.getFullYear()}`;
};

/** "Hoy", "Mañana", "Ayer" o "10 de octubre" para una fecha YYYY-MM-DD. */
export const relativeDayLabel = (dateKey: string, today: Date = new Date()): string => {
  if (dateKey === toDateKey(today)) return 'Hoy';
  if (dateKey === toDateKey(addDays(today, 1))) return 'Mañana';
  if (dateKey === toDateKey(addDays(today, -1))) return 'Ayer';
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${d} de ${MONTHS[m - 1]}${y !== today.getFullYear() ? ` de ${y}` : ''}`;
};

/** "Sábado 10 de octubre" para mostrar un único día. */
export const formatDayLabel = (d: Date): string =>
  `${WEEKDAY_NAMES[(d.getDay() + 6) % 7]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
