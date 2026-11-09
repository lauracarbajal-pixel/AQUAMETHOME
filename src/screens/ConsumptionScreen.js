import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../components/HeaderWithBack';
import TabBar from '../components/TabBar';
import GroupedBarChart from '../components/charts/GroupedBarChart';
import RingProgress from '../components/charts/RingProgress';
import WaterMascot from '../components/WaterMascot';
import Icon from '../components/Icon';
import { Card } from '../components/ui';
import { WEEKLY_CONSUMPTION, DAILY_GOAL_LITERS } from '../data/mockData';
import { COLORS } from '../theme/colors';

function sum(list, key) {
  return list.reduce((total, item) => total + item[key], 0);
}

export default function ConsumptionScreen({ navigation }) {
  const current = sum(WEEKLY_CONSUMPTION, 'current');
  const previous = sum(WEEKLY_CONSUMPTION, 'previous');
  const avgDaily = Math.round(current / WEEKLY_CONSUMPTION.length);
  const savings = previous > 0 ? Math.round(((previous - current) / previous) * 100) : 0;
  const saving = savings >= 0;

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Análisis de Consumo" onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.cardTitle}>Comparación semanal (L)</Text>
          <View style={styles.legend}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.chartCurrent }]} />
            <Text style={styles.legendText}>Esta semana</Text>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.chartPrevious, marginLeft: 16 }]} />
            <Text style={styles.legendText}>Semana pasada</Text>
          </View>
          <GroupedBarChart data={WEEKLY_CONSUMPTION} />
        </Card>

        <Card style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.statLabel}>Consumo estimado</Text>
            <Text style={styles.statSub}>(Promedio diario)</Text>
            <Text style={styles.statValue}>{avgDaily} L</Text>
            <Text style={styles.statHint}>Meta diaria: {DAILY_GOAL_LITERS} L</Text>
          </View>
          <RingProgress size={68} progress={avgDaily / DAILY_GOAL_LITERS} color={COLORS.success}>
            <Icon name="drop" size={24} color={COLORS.primary} />
          </RingProgress>
        </Card>

        <Card style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.statLabel}>Ahorro proyectado</Text>
            <Text style={styles.savingsText}>
              <Text style={{ color: saving ? COLORS.successText : COLORS.danger, fontWeight: '800' }}>
                {Math.abs(savings)}%
              </Text>
              {saving ? ' menos que el periodo anterior' : ' más que el periodo anterior'}
            </Text>
          </View>
          <Icon name={saving ? 'arrowUp' : 'arrowDown'} size={28} color={saving ? COLORS.success : COLORS.danger} strokeWidth={3} />
          <WaterMascot size={46} style={styles.mascot} />
        </Card>
      </ScrollView>

      <TabBar activeTab="home" onChange={navigation.switchTab} />
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  statSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textStrong,
    marginTop: 4,
  },
  statHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  savingsText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  mascot: {
    marginVertical: 0,
    marginLeft: 6,
  },
});
