// Datos simulados. El nivel, las alertas y el historial de nivel vienen del sensor (ver AppContext).

export const INITIAL_TANK = {
  capacity: 1100,
  location: 'Azotea',
  level: 0,
  minLevel: 35,
  criticalLevel: 15,
  lastUpdate: null, // timestamp de la última lectura del sensor
  sensorModel: 'AM-01',
};

// Ubicaciones posibles del tinaco (asistente y ajustes del sensor)
export const TANK_LOCATIONS = ['Azotea', 'Jardín', 'Patio Trasero', 'CISTERNA'];

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

// Contenido de cada tipo de alerta
export const ALERT_TYPES = {
  level: {
    recommendations: ['Programar el llenado del tinaco', 'Reducir el consumo mientras se recupera el nivel'],
    steps: [
      'Verifique que la llave de llenado o la bomba estén abiertas',
      'Confirme que hay suministro de agua',
      'Vigile que el nivel comience a subir',
    ],
    confirmLabel: 'Presione aquí para confirmar que el nivel se recuperó',
    confirmedLabel: 'Nivel recuperado',
  },
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
// earnedAt: fecha en que se obtuvo la insignia (solo las obtenidas).
export const BADGES = [
  { id: 'b1', name: 'Guardián del Agua', description: 'Mantuviste tu tinaco sin fugas durante un mes.', tier: 'bronze', icon: 'tree', earned: true, earnedAt: new Date(2026, 7, 14).getTime() },
  { id: 'b2', name: 'Monitor Maestro', description: 'Revisaste el nivel de tu tinaco 30 días seguidos.', tier: 'silver', icon: 'drop', earned: true, earnedAt: new Date(2026, 8, 2).getTime() },
  { id: 'b3', name: 'Eco-Héroe', description: 'Ahorraste más de 500 L en un mes.', tier: 'gold', icon: 'star', earned: true, earnedAt: new Date(2026, 8, 28).getTime() },
  { id: 'b4', name: 'Raíz Verde', description: 'Completaste tu primer reto semanal.', tier: 'green', icon: 'leaf', earned: true, earnedAt: new Date(2026, 9, 12).getTime() },
  { id: 'b5', name: 'Vigía del Tinaco', description: 'Resolviste tu primera alerta.', tier: 'gold', icon: 'person', earned: true, earnedAt: new Date(2026, 9, 30).getTime() },
  { id: 'b6', name: 'Cazafugas', description: 'Resuelve 5 alertas de fuga.', tier: 'silver', icon: 'drop', earned: false },
  { id: 'b7', name: 'Ciudadano del Planeta', description: 'Ahorra 10% durante un mes completo.', tier: 'green', icon: 'globe', earned: false },
  { id: 'b8', name: 'Racha de Oro', description: 'Cumple 4 metas semanales seguidas.', tier: 'gold', icon: 'star', earned: false },
  { id: 'b9', name: 'Bosque Azul', description: 'Ahorra 2,000 L en total.', tier: 'green', icon: 'tree', earned: false },
  { id: 'b10', name: 'Noche Tranquila', description: 'Sin consumo nocturno durante 7 noches.', tier: 'silver', icon: 'leaf', earned: false },
  { id: 'b11', name: 'Experto AQUAMET', description: 'Alcanza el nivel Oro.', tier: 'gold', icon: 'person', earned: false },
  { id: 'b12', name: 'Comunidad Azul', description: 'Invita a un vecino a AQUAMET.', tier: 'bronze', icon: 'globe', earned: false },
];
