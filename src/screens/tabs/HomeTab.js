import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AQUAMETLogo from '../../components/AQUAMETLogo';
import TinacoGraphic from '../../components/TinacoGraphic';
import Icon from '../../components/Icon';
import { Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { WEEKLY_CONSUMPTION } from '../../data/mockData';
import { getTankStatus } from '../../utils/status';
import { timeLabel12 } from '../../utils/format';
import { COLORS } from '../../theme/colors';

export default function HomeTab({ navigation }) {
  const insets = useSafeAreaInsets();
  const { tank, connection } = useApp();
  const hasReading = tank.lastUpdate != null;
  const status = hasReading
    ? getTankStatus({ level: tank.level, minLevel: tank.minLevel, criticalLevel: tank.criticalLevel })
    : connection === 'offline'
      ? { key: 'offline', label: 'Sin conexión', color: COLORS.danger, bg: COLORS.dangerBg, border: COLORS.dangerBorder, icon: 'alert' }
      : { key: 'connecting', label: 'Conectando…', color: COLORS.textSecondary, bg: COLORS.white, border: COLORS.borderLight, icon: 'alert' };

  const avgDaily = Math.round(WEEKLY_CONSUMPTION.reduce((s, d) => s + d.current, 0) / WEEKLY_CONSUMPTION.length);

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        <View style={styles.sideSlot} />
        <AQUAMETLogo size="small" />
        <TouchableOpacity
          style={[styles.sideSlot, styles.settingsButton]}
          onPress={() => navigation.navigate('setup1')}
          accessibilityRole="button"
          accessibilityLabel="Configuración del tinaco"
        >
          <Icon name="gear" color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <TinacoGraphic levelPercentage={tank.level} capacityLitros={tank.capacity} />

      <View style={[styles.statusPill, { backgroundColor: status.bg, borderColor: status.border }]}>
        <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
          <Icon name={status.icon} size={15} color={COLORS.white} strokeWidth={3.2} />
        </View>
        <Text style={[styles.statusText, { color: status.color }]}>Estado: {status.label}</Text>
      </View>

      {hasReading ? (
        <Text style={styles.lastUpdate}>
          Última actualización: {timeLabel12(tank.lastUpdate)}
          {connection === 'offline' ? ' (sin conexión)' : ''}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('consumption')}
        accessibilityRole="button"
        accessibilityLabel="Ver análisis de consumo"
        style={styles.linkWrapper}
      >
        <Card style={styles.linkCard}>
          <View style={styles.linkIcon}>
            <Icon name="chart" color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>Análisis de consumo</Text>
            <Text style={styles.linkSubtitle}>Promedio diario: {avgDaily} L</Text>
          </View>
          <Icon name="chevronRight" color={COLORS.textSecondary} />
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSlot: {
    width: 40,
  },
  settingsButton: {
    alignItems: 'flex-end',
    paddingVertical: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 12,
    borderWidth: 1,
  },
  statusIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '800',
  },
  lastUpdate: {
    fontSize: 14,
    color: '#475569',
    marginTop: 12,
    fontWeight: '500',
  },
  linkWrapper: {
    width: '100%',
    marginTop: 22,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  linkSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
