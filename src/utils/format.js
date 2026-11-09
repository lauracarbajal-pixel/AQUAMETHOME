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

const PERIOD_LABELS = ['Últimos 7 días', 'Semana anterior', 'Hace 2 semanas', 'Hace 3 semanas'];

// samples: [{ ts, value }] (cualquier orden). Devuelve periodos de 7 días, del más reciente al más antiguo,
// con el nivel promedio de cada día que tenga lecturas: [{ label, points: [{ day, month, value }] }]
export function buildLevelPeriods(samples, now = Date.now()) {
  const today = startOfDay(now);
  const oldest = samples.reduce((min, s) => Math.min(min, s.ts), now);
  const daysSpan = Math.round((today - startOfDay(oldest)) / DAY_MS) + 1;
  const count = Math.min(Math.max(Math.ceil(daysSpan / 7), 1), PERIOD_LABELS.length);

  const byDay = new Map(); // inicio del día -> { sum, n }
  samples.forEach((s) => {
    const key = startOfDay(s.ts);
    const acc = byDay.get(key) || { sum: 0, n: 0 };
    acc.sum += s.value;
    acc.n += 1;
    byDay.set(key, acc);
  });

  return Array.from({ length: count }, (_, p) => {
    const points = [];
    for (let i = 6; i >= 0; i -= 1) {
      const dayStart = today - (p * 7 + i) * DAY_MS;
      const acc = byDay.get(dayStart);
      if (acc) {
        const d = new Date(dayStart);
        points.push({ day: String(d.getDate()), month: MONTHS[d.getMonth()], value: Math.round(acc.sum / acc.n) });
      }
    }
    return { label: PERIOD_LABELS[p], points };
  });
}
