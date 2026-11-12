import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_TANK,
  INITIAL_POINTS,
  INITIAL_CHALLENGES,
  BADGES,
  ALERT_RESOLVE_POINTS,
} from '../data/mockData';
import { obtenerNivel } from '../services/sensorApi';
import { KEYS, loadList, loadObject, saveList, saveObject } from '../services/storage';
import { getTankStatus } from '../utils/status';
import { dayLabel, timeLabel24 } from '../utils/format';

const AppContext = createContext(null);

const POLL_MS = 5000; // cada cuánto se consulta el sensor
const SAMPLE_MS = 10 * 60 * 1000; // cada cuánto se guarda un punto para el historial
const MAX_SAMPLES = 90 * 24 * 6; // ~90 días (un punto cada 10 min) para poder consultar periodos anteriores
const MAX_EVENTS = 200;
const MAX_ALERTS = 50;

// Campos de la configuración del sensor que se guardan en el teléfono
const SENSOR_FIELDS = ['capacity', 'location', 'minLevel', 'criticalLevel', 'sensorModel'];
const pickSensorFields = (obj) =>
  SENSOR_FIELDS.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Estado global de la app. El nivel, las alertas y el historial vienen del sensor (sensorApi.js).
export function AppProvider({ children }) {
  const [tank, setTank] = useState(INITIAL_TANK);
  const [connection, setConnection] = useState('connecting'); // 'connecting' | 'online' | 'offline'
  const [samples, setSamples] = useState([]); // [{ ts, value }] más reciente primero
  const [events, setEvents] = useState([]); // [{ id, ts, text, type }] más reciente primero
  const [alertRecords, setAlertRecords] = useState([]); // [{ id, ts, level, percent, status }]
  const [loaded, setLoaded] = useState(false);
  // Sensor registrado: undefined = cargando, null = no hay sensor, objeto = configuración guardada
  const [sensor, setSensor] = useState(undefined);
  // Borrador del asistente de alta (no se aplica hasta terminar el paso 3)
  const [setupDraft, setSetupDraft] = useState(() => pickSensorFields(INITIAL_TANK));
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [badges] = useState(BADGES);

  // Refs para que el ciclo de lectura use siempre los valores más recientes
  const tankRef = useRef(tank);
  const alertsRef = useRef(alertRecords);
  const connectionRef = useRef('connecting');
  const lastSampleRef = useRef(0);
  const sensorRef = useRef(sensor);
  tankRef.current = tank;
  alertsRef.current = alertRecords;
  sensorRef.current = sensor;

  // 1) Recupera lo guardado en el teléfono
  useEffect(() => {
    let active = true;
    Promise.all([
      loadList(KEYS.samples),
      loadList(KEYS.events),
      loadList(KEYS.alerts),
      loadObject(KEYS.sensor),
    ]).then(([s, e, a, savedSensor]) => {
      if (!active) return;
      setSamples(s);
      setEvents(e);
      setAlertRecords(a);
      setSensor(savedSensor);
      if (savedSensor) setTank((prev) => ({ ...prev, ...pickSensorFields(savedSensor) }));
      lastSampleRef.current = s.length ? s[0].ts : 0;
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // 2) Guarda cada cambio (solo después de cargar, para no pisar lo almacenado)
  useEffect(() => {
    if (loaded) saveList(KEYS.samples, samples);
  }, [samples, loaded]);
  useEffect(() => {
    if (loaded) saveList(KEYS.events, events);
  }, [events, loaded]);
  useEffect(() => {
    if (loaded) saveList(KEYS.alerts, alertRecords);
  }, [alertRecords, loaded]);

  // 3) Consulta el sensor periódicamente
  // (solo si hay un sensor registrado)
  const hasSensor = Boolean(sensor);
  useEffect(() => {
    if (!loaded) return undefined;
    if (!hasSensor) {
      connectionRef.current = 'none';
      setConnection('none');
      return undefined;
    }
    let active = true;
    connectionRef.current = 'connecting';
    setConnection('connecting');

    const addEvent = (ts, text, type) =>
      setEvents((list) => [{ id: newId('ev'), ts, text, type }, ...list].slice(0, MAX_EVENTS));

    const leer = async () => {
      let reading;
      try {
        reading = await obtenerNivel();
      } catch {
        if (!active) return;
        if (connectionRef.current !== 'offline') {
          connectionRef.current = 'offline';
          setConnection('offline');
          addEvent(Date.now(), 'Sin conexión con el sensor', 'critical');
        }
        return;
      }
      if (!active) return;

      const now = Date.now();
      const percent = Math.round(reading.porcentaje);

      if (connectionRef.current === 'offline') addEvent(now, 'Conexión con el sensor restablecida', 'info');
      connectionRef.current = 'online';
      setConnection('online');
      setTank((prev) => ({ ...prev, level: percent, lastUpdate: now }));

      // Punto para la gráfica del historial
      if (now - lastSampleRef.current >= SAMPLE_MS) {
        lastSampleRef.current = now;
        setSamples((list) => [{ ts: now, value: percent }, ...list].slice(0, MAX_SAMPLES));
      }

      // Alertas según los umbrales configurados en el paso 3
      const { minLevel, criticalLevel } = tankRef.current;
      const key = getTankStatus({ level: percent, minLevel, criticalLevel }).key; // normal | low | critical
      const open = alertsRef.current.filter((a) => a.status !== 'resolved');

      if (key === 'normal') {
        if (open.length > 0) {
          setAlertRecords((list) => list.map((a) => (a.status !== 'resolved' ? { ...a, status: 'resolved' } : a)));
          addEvent(now, `Nivel recuperado: ${percent}%`, 'success');
        }
      } else if (!open.some((a) => a.level === key)) {
        const label = key === 'critical' ? 'Nivel crítico' : 'Nivel bajo';
        setAlertRecords((list) =>
          [
            { id: newId('lvl'), ts: now, level: key, percent, status: 'pending' },
            // la alerta anterior (por ejemplo "bajo" que ahora es "crítico") queda reemplazada
            ...list.map((a) => (a.status !== 'resolved' ? { ...a, status: 'resolved' } : a)),
          ].slice(0, MAX_ALERTS)
        );
        addEvent(now, `${label}: ${percent}%`, key === 'critical' ? 'critical' : 'warning');
      }
    };

    leer();
    const id = setInterval(leer, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [loaded, hasSensor]);

  const updateTank = useCallback((patch) => {
    setTank((prev) => ({ ...prev, ...patch }));
  }, []);

  // Guarda la configuración del sensor (alta o edición) en memoria y en el teléfono.
  // `isNew` marca un alta: se registra la fecha y se reinicia la lectura del nivel.
  const saveSensor = useCallback((config, { isNew = false } = {}) => {
    const fields = pickSensorFields(config);
    const prev = sensorRef.current;
    const next = {
      ...(isNew ? {} : prev || {}),
      ...fields,
      registeredAt: !isNew && prev?.registeredAt ? prev.registeredAt : Date.now(),
    };
    sensorRef.current = next;
    setSensor(next);
    saveObject(KEYS.sensor, next);
    setTank((prev) => ({ ...prev, ...fields, ...(isNew ? { level: 0, lastUpdate: null } : null) }));
  }, []);

  // Asistente de alta: empieza con valores por defecto y solo se aplica al terminar.
  const startSetupDraft = useCallback(() => setSetupDraft(pickSensorFields(INITIAL_TANK)), []);
  const updateSetupDraft = useCallback((patch) => setSetupDraft((prev) => ({ ...prev, ...patch })), []);
  const finishSetupDraft = useCallback(
    (patch = {}) => saveSensor({ ...setupDraft, ...patch }, { isNew: true }),
    [saveSensor, setupDraft]
  );

  // Alertas con el formato que usan las pantallas
  const alerts = useMemo(
    () =>
      alertRecords.map((r) => ({
        id: r.id,
        type: 'level',
        title: r.level === 'critical' ? 'Nivel crítico' : 'Nivel bajo',
        summary: `El tinaco está al ${r.percent}%`,
        date: dayLabel(r.ts),
        detectedAt: timeLabel24(r.ts),
        metric: { label: 'Nivel detectado', value: `${r.percent}%` },
        status: r.status,
      })),
    [alertRecords]
  );

  const markAlertReviewing = useCallback((id) => {
    setAlertRecords((list) =>
      list.map((a) => (a.id === id && a.status === 'pending' ? { ...a, status: 'reviewing' } : a))
    );
  }, []);

  // Devuelve true si la alerta se resolvió en esta llamada (para no dar puntos dos veces).
  const resolveAlert = useCallback(
    (id) => {
      const alert = alertRecords.find((a) => a.id === id);
      if (!alert || alert.status === 'resolved') return false;
      setAlertRecords((list) => list.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a)));
      setPoints((p) => p + ALERT_RESOLVE_POINTS);
      return true;
    },
    [alertRecords]
  );

  const claimChallenge = useCallback(
    (id) => {
      const challenge = challenges.find((c) => c.id === id);
      if (!challenge || challenge.claimed || challenge.current < challenge.target) return;
      setChallenges((list) => list.map((c) => (c.id === id ? { ...c, claimed: true } : c)));
      setPoints((p) => p + challenge.reward);
    },
    [challenges]
  );

  // Insignia obtenida más recientemente (o null si aún no tiene ninguna)
  const latestBadge = useMemo(
    () =>
      badges
        .filter((b) => b.earned)
        .reduce((latest, b) => (!latest || (b.earnedAt || 0) > (latest.earnedAt || 0) ? b : latest), null),
    [badges]
  );

  const value = useMemo(
    () => ({
      tank,
      updateTank,
      connection,
      samples,
      events,
      alerts,
      markAlertReviewing,
      resolveAlert,
      points,
      challenges,
      claimChallenge,
      badges,
      latestBadge,
      sensor,
      sensorReady: sensor !== undefined,
      saveSensor,
      setupDraft,
      startSetupDraft,
      updateSetupDraft,
      finishSetupDraft,
    }),
    [
      tank, updateTank, connection, samples, events, alerts, markAlertReviewing, resolveAlert, points, challenges,
      claimChallenge, badges, latestBadge, sensor, saveSensor, setupDraft, startSetupDraft, updateSetupDraft,
      finishSetupDraft,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
