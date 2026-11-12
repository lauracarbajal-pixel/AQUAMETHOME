// Formato de fechas y construcción de periodos del historial a partir de lecturas del sensor.

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (ts) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const pad = (n) => String(n).padStart(2, '0');

// 'Hoy' | 'Ayer' | '15 Oct'
export function dayLabel(ts, now = Date.now()) {
  const diff = Math.round((startOfDay(now) - startOfDay(ts)) / DAY_MS);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// '09:45'
export function timeLabel24(ts) {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// '10:07 AM'
export function timeLabel12(ts) {
  const d = new Date(ts);
  const h = d.getHours();
  return `${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
}

// '16 Oct' (siempre con fecha, para el registro de eventos)
export function dateLabel(ts) {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Suma días respetando el calendario (no depende de que todos los días midan 24 h)
const addDays = (ts, n) => {
  const d = new Date(ts);
  d.setDate(d.getDate() + n);
  return d.getTime();
};

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Periodos que se pueden consultar en el Historial (el "mes" son bloques de 30 días)
export const HISTORY_RANGES = [
  { key: 'day', label: 'Día', days: 1 },
  { key: 'week', label: 'Semana', days: 7 },
  { key: 'month', label: 'Mes', days: 30 },
];

// samples: [{ ts, value }] (cualquier orden).
// rangeKey: 'day' | 'week' | 'month'; offset: 0 = periodo actual, 1 = el anterior, etc.
// Día → promedio por hora; Semana/Mes → promedio por día (solo horas/días con lecturas).
export function buildLevelSeries(samples, rangeKey = 'week', offset = 0, now = Date.now()) {
  const range = HISTORY_RANGES.find((r) => r.key === rangeKey) || HISTORY_RANGES[1];
  const end = addDays(startOfDay(now), 1 - offset * range.days); // exclusivo
  const start = addDays(end, -range.days);
  const lastDay = addDays(end, -1);
  const byHour = range.key === 'day';

  const buckets = new Map(); // inicio de la hora/día -> { sum, n }
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let count = 0;
  let oldest = Infinity;

  samples.forEach((s) => {
    if (s.ts < oldest) oldest = s.ts;
    if (s.ts < start || s.ts >= end) return;
    const d = new Date(s.ts);
    if (byHour) d.setMinutes(0, 0, 0);
    else d.setHours(0, 0, 0, 0);
    const key = d.getTime();
    const acc = buckets.get(key) || { sum: 0, n: 0 };
    acc.sum += s.value;
    acc.n += 1;
    buckets.set(key, acc);
    min = Math.min(min, s.value);
    max = Math.max(max, s.value);
    sum += s.value;
    count += 1;
  });

  const points = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([key, acc]) => {
      const d = new Date(key);
      return byHour
        ? { day: `${d.getHours()}h`, month: '', value: Math.round(acc.sum / acc.n) }
        : { day: String(d.getDate()), month: MONTHS[d.getMonth()], value: Math.round(acc.sum / acc.n) };
    });

  let label;
  if (byHour) label = offset <= 1 ? dayLabel(start, now) : WEEKDAYS[new Date(start).getDay()];
  else if (offset === 0) label = `Últimos ${range.days} días`;
  else if (range.key === 'week') label = offset === 1 ? 'Semana anterior' : `Hace ${offset} semanas`;
  else label = offset === 1 ? 'Mes anterior' : `Hace ${offset} meses`;

  return {
    label,
    rangeText: byHour ? dateLabel(start) : `${dateLabel(start)} – ${dateLabel(lastDay)}`,
    start,
    end,
    points,
    stats: count ? { min, max, avg: Math.round(sum / count) } : null,
    canGoOlder: oldest < start, // hay lecturas más antiguas que este periodo
    canGoNewer: offset > 0,
  };
}
