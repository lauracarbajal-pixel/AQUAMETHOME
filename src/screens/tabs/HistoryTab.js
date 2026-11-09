import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../../components/HeaderWithBack';
import LineChart from '../../components/charts/LineChart';
import Icon from '../../components/Icon';
import { Card, StatusDot } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { buildLevelPeriods, dateLabel, timeLabel12 } from '../../utils/format';
import { COLORS } from '../../theme/colors';

const EVENT_COLORS = {
  info: COLORS.primaryLight,
  warning: COLORS.warning,
  critical: COLORS.danger,
  success: COLORS.success,
};

export default function HistoryTab() {
  const { tank, samples, events } = useApp();
  const periods = useMemo(() => buildLevelPeriods(samples), [samples]);
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = periods[Math.min(periodIndex, periods.length - 1)];
  const canGoOlder = periodIndex < periods.length - 1;
  const canGoNewer = periodIndex > 0;

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Historial de Nivel" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.periodRow}>
            <TouchableOpacity
              onPress={() => setPeriodIndex((i) => i + 1)}
              disabled={!canGoOlder}
              style={[styles.periodBtn, !canGoOlder && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel="Periodo anterior"
            >
              <Icon name="chevronLeft" color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.periodLabel}>{period.label}</Text>
            <TouchableOpacity
              onPress={() => setPeriodIndex((i) => i - 1)}
              disabled={!canGoNewer}
              style={[styles.periodBtn, !canGoNewer && styles.disabled]}
              accessibilityRole="button"
              accessibilityLabel="Periodo siguiente"
            >
              <Icon name="chevronRight" color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {period.points.length > 0 ? (
            <>
              <LineChart data={period.points} threshold={tank.minLevel} />

              <View style={styles.legendRow}>
                <View style={styles.legendDash} />
                <Text style={styles.legendText}>Nivel mínimo ({tank.minLevel}%)</Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>Aún no hay lecturas del sensor en este periodo.</Text>
          )}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Registro de eventos</Text>
          {events.length === 0 ? (
            <Text style={styles.emptyText}>Todavía no hay eventos registrados.</Text>
          ) : (
            events.map((event, i) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
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
  disabled: {
    opacity: 0.3,
  },
  periodLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textStrong,
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
