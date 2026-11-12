import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../../components/HeaderWithBack';
import LineChart from '../../components/charts/LineChart';
import Icon from '../../components/Icon';
import { Card, StatusDot } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { HISTORY_RANGES, buildLevelSeries, dateLabel, timeLabel12 } from '../../utils/format';
import { COLORS } from '../../theme/colors';

const EVENT_COLORS = {
  info: COLORS.primaryLight,
  warning: COLORS.warning,
  critical: COLORS.danger,
  success: COLORS.success,
};

export default function HistoryTab() {
  const { tank, samples, events } = useApp();
  const [rangeKey, setRangeKey] = useState('week'); // 'day' | 'week' | 'month'
  const [offset, setOffset] = useState(0); // 0 = periodo actual, 1 = anterior, ...

  const series = useMemo(() => buildLevelSeries(samples, rangeKey, offset), [samples, rangeKey, offset]);
  const periodEvents = useMemo(
    () => events.filter((e) => e.ts >= series.start && e.ts < series.end),
    [events, series.start, series.end]
  );

  const changeRange = (key) => {
    setRangeKey(key);
    setOffset(0);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Historial de Nivel" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Tipo de periodo */}
        <View style={styles.segmented} accessibilityRole="tablist">
          {HISTORY_RANGES.map((r) => {
            const active = r.key === rangeKey;
            return (
              <TouchableOpacity
                key={r.key}
                onPress={() => changeRange(r.key)}
                style={[styles.segment, active && styles.segmentActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Card>
          {/* Navegación entre periodos */}
          <View style={styles.periodRow}>
            <TouchableOpacity
              onPress={() => setOffset((o) => o + 1)}
              disabled={!series.canGoOlder}
              style={[styles.periodBtn, !series.canGoOlder && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel="Periodo anterior"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="chevronLeft" color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={styles.periodCenter}>
              <Text style={styles.periodLabel} numberOfLines={1}>
                {series.label}
              </Text>
              <Text style={styles.periodRange}>{series.rangeText}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setOffset((o) => Math.max(0, o - 1))}
              disabled={!series.canGoNewer}
              style={[styles.periodBtn, !series.canGoNewer && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel="Periodo siguiente"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="chevronRight" color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {offset > 0 ? (
            <TouchableOpacity onPress={() => setOffset(0)} style={styles.todayLink} accessibilityRole="button">
              <Text style={styles.todayLinkText}>Volver al periodo actual</Text>
            </TouchableOpacity>
          ) : null}

          {series.points.length > 0 ? (
            <>
              <LineChart data={series.points} threshold={tank.minLevel} />

              <View style={styles.legendRow}>
                <View style={styles.legendDash} />
                <Text style={styles.legendText}>Nivel mínimo ({tank.minLevel}%)</Text>
              </View>

              {series.stats ? (
                <View style={styles.statsRow}>
                  <Stat label="Promedio" value={`${series.stats.avg}%`} />
                  <Stat label="Mínimo" value={`${series.stats.min}%`} />
                  <Stat label="Máximo" value={`${series.stats.max}%`} />
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.emptyText}>No hay lecturas del sensor en este periodo.</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Eventos del periodo</Text>
          {periodEvents.length === 0 ? (
            <Text style={styles.emptyText}>No hay eventos registrados en este periodo.</Text>
          ) : (
            periodEvents.map((event, i) => (
              <View key={event.id} style={[styles.eventRow, i > 0 && styles.eventDivider]}>
                <View style={styles.eventDot}>
                  <StatusDot color={EVENT_COLORS[event.type]} size={10} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventDate}>
                    {dateLabel(event.ts)} · {timeLabel12(event.ts)}
                  </Text>
                  <Text style={styles.eventText}>{event.text}</Text>
                </View>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 4,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  segmentTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodBtn: {
    padding: 6,
  },
  periodCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  disabled: {
    opacity: 0.3,
  },
  periodLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  periodRange: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  todayLink: {
    alignSelf: 'center',
    paddingVertical: 4,
    marginBottom: 6,
  },
  todayLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  legendDash: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.warning,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginBottom: 6,
  },
  eventRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  eventDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  eventDot: {
    paddingTop: 5,
    marginRight: 12,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  eventText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
