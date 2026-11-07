import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../../components/HeaderWithBack';
import LineChart from '../../components/charts/LineChart';
import Icon from '../../components/Icon';
import { Card, StatusDot } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { LEVEL_HISTORY, EVENT_LOG } from '../../data/mockData';
import { COLORS } from '../../theme/colors';

const EVENT_COLORS = {
  info: COLORS.primaryLight,
  warning: COLORS.warning,
  critical: COLORS.danger,
  success: COLORS.success,
};

export default function HistoryTab() {
  const { tank } = useApp();
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = LEVEL_HISTORY[periodIndex];
  const canGoOlder = periodIndex < LEVEL_HISTORY.length - 1;
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

          <LineChart data={period.points} threshold={tank.minLevel} />

          <View style={styles.legendRow}>
            <View style={styles.legendDash} />
            <Text style={styles.legendText}>Nivel mínimo ({tank.minLevel}%)</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Registro de eventos</Text>
          {EVENT_LOG.map((event, i) => (
            <View key={event.id} style={[styles.eventRow, i > 0 && styles.eventDivider]}>
              <View style={styles.eventDot}>
                <StatusDot color={EVENT_COLORS[event.type]} size={10} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventDate}>
                  {event.date} · {event.time}
                </Text>
                <Text style={styles.eventText}>{event.text}</Text>
              </View>
            </View>
          ))}
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
