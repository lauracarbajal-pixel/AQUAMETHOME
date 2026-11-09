import { COLORS } from '../theme/colors';
import { LEVELS } from '../data/mockData';

export function getTankStatus({ level, minLevel, criticalLevel }) {
  if (level <= criticalLevel) {
    return { key: 'critical', label: 'Crítico', color: COLORS.danger, bg: COLORS.dangerBg, border: COLORS.dangerBorder, icon: 'alert' };
  }
  if (level <= minLevel) {
    return { key: 'low', label: 'Nivel bajo', color: COLORS.warning, bg: COLORS.warningBg, border: COLORS.warningBorder, icon: 'alert' };
  }
  return { key: 'normal', label: 'Normal', color: COLORS.successText, bg: COLORS.successBg, border: COLORS.successBorder, icon: 'check' };
}

export const ALERT_STATUS = {
  pending: { label: 'Pendiente de revisión', color: COLORS.pending },
  reviewing: { label: 'En revisión', color: COLORS.primaryLight },
  resolved: { label: 'Resuelta', color: COLORS.success },
};

export function getLevelInfo(points) {
  let index = 0;
  LEVELS.forEach((lvl, i) => {
    if (points >= lvl.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const max = LEVELS[LEVELS.length - 1].min;
  return {
    current,
    next,
    pointsToNext: next ? next.min - points : 0,
    progress: Math.min(points / max, 1),
  };
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
