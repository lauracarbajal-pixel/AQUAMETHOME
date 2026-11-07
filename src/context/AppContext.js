import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  INITIAL_TANK,
  INITIAL_ALERTS,
  INITIAL_POINTS,
  INITIAL_CHALLENGES,
  BADGES,
  ALERT_RESOLVE_POINTS,
} from '../data/mockData';

const AppContext = createContext(null);

// Estado global de la app (por ahora con datos simulados).
export function AppProvider({ children }) {
  const [tank, setTank] = useState(INITIAL_TANK);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [badges] = useState(BADGES);

  const updateTank = useCallback((patch) => {
    setTank((prev) => ({ ...prev, ...patch }));
  }, []);

  const markAlertReviewing = useCallback((id) => {
    setAlerts((list) =>
      list.map((a) => (a.id === id && a.status === 'pending' ? { ...a, status: 'reviewing' } : a))
    );
  }, []);

  // Devuelve true si la alerta se resolvió en esta llamada (para no dar puntos dos veces).
  const resolveAlert = useCallback(
    (id) => {
      const alert = alerts.find((a) => a.id === id);
      if (!alert || alert.status === 'resolved') return false;
      setAlerts((list) => list.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a)));
      setPoints((p) => p + ALERT_RESOLVE_POINTS);
      return true;
    },
    [alerts]
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

  const value = useMemo(
    () => ({
      tank,
      updateTank,
      alerts,
      markAlertReviewing,
      resolveAlert,
      points,
      challenges,
      claimChallenge,
      badges,
    }),
    [tank, updateTank, alerts, markAlertReviewing, resolveAlert, points, challenges, claimChallenge, badges]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
