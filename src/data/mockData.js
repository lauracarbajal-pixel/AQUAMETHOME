// Datos simulados mientras no hay conexión con el sensor ni con el backend.

export const INITIAL_TANK = {
  capacity: 1100,
  location: 'Azotea',
  level: 72,
  minLevel: 35,
  criticalLevel: 15,
  lastUpdate: '10:07 AM',
  sensorModel: 'AM-01',
};

// Nivel del tinaco (%) por día
export const LEVEL_HISTORY = [
  {
    label: 'Últimos 7 días',
    points: [
      { day: '10', month: 'Oct', value: 68 },
      { day: '11', month: 'Oct', value: 66 },
      { day: '12', month: 'Oct', value: 58 },
      { day: '13', month: 'Oct', value: 34 },
      { day: '14', month: 'Oct', value: 68 },
      { day: '15', month: 'Oct', value: 31 },
      { day: '16', month: 'Oct', value: 70 },
    ],
  },
  {
    label: 'Semana anterior',
    points: [
      { day: '3', month: 'Oct', value: 75 },
      { day: '4', month: 'Oct', value: 70 },
      { day: '5', month: 'Oct', value: 62 },
      { day: '6', month: 'Oct', value: 55 },
      { day: '7', month: 'Oct', value: 80 },
      { day: '8', month: 'Oct', value: 72 },
      { day: '9', month: 'Oct', value: 64 },
    ],
  },
];

// type: 'info' | 'warning' | 'critical' | 'success'
export const EVENT_LOG = [
  { id: 'e1', date: '16 Oct', time: '10:09 AM', text: 'Actualización de nivel: 72%', type: 'info' },
  { id: 'e2', date: '15 Oct', time: '2:00 PM', text: 'Nivel bajo crítico (recargado)', type: 'critical' },
  { id: 'e3', date: '15 Oct', time: '9:00 AM', text: 'Nivel 35% (alerta de nivel bajo)', type: 'warning' },
  { id: 'e4', date: '14 Oct', time: '7:30 PM', text: 'Recarga completa: 98%', type: 'success' },
  { id: 'e5', date: '13 Oct', time: '6:15 PM', text: 'Nivel 34% (alerta de nivel bajo)', type: 'warning' },
];

// Litros consumidos por día: semana actual vs. semana pasada
export const WEEKLY_CONSUMPTION = [
  { label: 'L', current: 88, previous: 98 },
  { label: 'M', current: 80, previous: 92 },
  { label: 'M', current: 72, previous: 85 },
  { label: 'J', current: 84, previous: 90 },
  { label: 'V', current: 98, previous: 110 },
  { label: 'S', current: 68, previous: 86 },
  { label: 'D', current: 105, previous: 115 },
];

export const DAILY_GOAL_LITERS = 100;

// status: 'pending' | 'reviewing' | 'resolved'
export const INITIAL_ALERTS = [
  {
    id: 'a1',
    type: 'leak',
    title: 'Posible fuga detectada',
    summary: 'Caída inusual del nivel de agua',
    date: 'Hoy',
    detectedAt: '09:45',
    metric: { label: 'Tasa de caída de nivel', value: '-0.5 L/min', trend: 'down' },
    status: 'pending',
  },
  {
    id: 'a2',
    type: 'lid',
    title: 'Tapa abierta',
    summary: 'La tapa del tinaco no está cerrada',
    date: 'Hoy',
    detectedAt: '08:30',
    metric: { label: 'Tiempo abierta', value: '25 min' },
    status: 'pending',
  },
  {
    id: 'a3',
    type: 'leak',
    title: 'Posible fuga detectada',
    summary: 'Caída inusual del nivel de agua',
    date: 'Ayer',
    detectedAt: '22:10',
    metric: { label: 'Tasa de caída de nivel', value: '-0.3 L/min', trend: 'down' },
    status: 'pending',
  },
  {
    id: 'a4',
    type: 'lid',
    title: 'Tapa abierta',
    summary: 'La tapa del tinaco no está cerrada',
    date: '14 Oct',
    detectedAt: '18:05',
    metric: { label: 'Tiempo abierta', value: '10 min' },
    status: 'resolved',
  },
];

// Contenido de cada tipo de alerta
export const ALERT_TYPES = {
  leak: {
    recommendations: ['Inspeccionar válvulas', 'Buscar humedad visible'],
    steps: [
      'Cierre la llave de paso',
      'Revise tuberías y conexiones',
      'Seque y vigile la zona húmeda',
    ],
    confirmLabel: 'Presione aquí para confirmar que no hay fuga',
    confirmedLabel: 'Sin fuga confirmada',
  },
  lid: {
    recommendations: ['Revisar que la tapa esté bien colocada', 'Retirar objetos que impidan cerrarla'],
    steps: ['Cierre la tapa firmemente', 'Verifique que encaje'],
    confirmLabel: 'Presione aquí para confirmar cierre',
    confirmedLabel: 'Cierre confirmado',
  },
};

export const ALERT_RESOLVE_POINTS = 10;

export const INITIAL_POINTS = 180;

export const LEVELS = [
  { name: 'Bronce', min: 0, title: 'Guardián del Agua' },
  { name: 'Plata', min: 250, title: 'Protector del Agua' },
  { name: 'Oro', min: 500, title: 'Leyenda del Agua' },
];

export const INITIAL_CHALLENGES = [
  { id: 'c1', title: 'Meta semanal: ahorrar 5%', current: 3, target: 5, unit: '%', reward: 50, claimed: false },
  { id: 'c2', title: 'Reducir consumo nocturno', current: 4, target: 7, unit: ' noches', reward: 30, claimed: false },
  { id: 'c3', title: 'Revisar tus alertas a tiempo', current: 3, target: 3, unit: ' alertas', reward: 20, claimed: false },
  { id: 'c4', title: 'Meta mensual: ahorrar 10%', current: 0, target: 10, unit: '%', reward: 100, claimed: false },
];

// tier: bronze | silver | gold | green   icon: tree | drop | star | leaf | person | globe
export const BADGES = [
  { id: 'b1', name: 'Guardián del Agua', description: 'Mantuviste tu tinaco sin fugas durante un mes.', tier: 'bronze', icon: 'tree', earned: true },
  { id: 'b2', name: 'Monitor Maestro', description: 'Revisaste el nivel de tu tinaco 30 días seguidos.', tier: 'silver', icon: 'drop', earned: true },
  { id: 'b3', name: 'Eco-Héroe', description: 'Ahorraste más de 500 L en un mes.', tier: 'gold', icon: 'star', earned: true },
  { id: 'b4', name: 'Raíz Verde', description: 'Completaste tu primer reto semanal.', tier: 'green', icon: 'leaf', earned: true },
  { id: 'b5', name: 'Vigía del Tinaco', description: 'Resolviste tu primera alerta.', tier: 'gold', icon: 'person', earned: true },
  { id: 'b6', name: 'Cazafugas', description: 'Resuelve 5 alertas de fuga.', tier: 'silver', icon: 'drop', earned: false },
  { id: 'b7', name: 'Ciudadano del Planeta', description: 'Ahorra 10% durante un mes completo.', tier: 'green', icon: 'globe', earned: false },
  { id: 'b8', name: 'Racha de Oro', description: 'Cumple 4 metas semanales seguidas.', tier: 'gold', icon: 'star', earned: false },
  { id: 'b9', name: 'Bosque Azul', description: 'Ahorra 2,000 L en total.', tier: 'green', icon: 'tree', earned: false },
  { id: 'b10', name: 'Noche Tranquila', description: 'Sin consumo nocturno durante 7 noches.', tier: 'silver', icon: 'leaf', earned: false },
  { id: 'b11', name: 'Experto AQUAMET', description: 'Alcanza el nivel Oro.', tier: 'gold', icon: 'person', earned: false },
  { id: 'b12', name: 'Comunidad Azul', description: 'Invita a un vecino a AQUAMET.', tier: 'bronze', icon: 'globe', earned: false },
];
