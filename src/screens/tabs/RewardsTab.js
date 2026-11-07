import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../../components/HeaderWithBack';
import WaterMascot from '../../components/WaterMascot';
import BadgeMedal from '../../components/BadgeMedal';
import { FlowFooter } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { LEVELS } from '../../data/mockData';
import { getLevelInfo } from '../../utils/status';
import { COLORS } from '../../theme/colors';

export default function RewardsTab({ navigation }) {
  const { points, badges } = useApp();
  const level = getLevelInfo(points);
  const maxPoints = LEVELS[LEVELS.length - 1].min;

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Recompensas" centered right={<WaterMascot size={30} style={styles.headerMascot} />} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.points} accessibilityLabel={`${points} puntos`}>
          {points}
        </Text>
        <Text style={styles.pointsLabel}>PUNTOS</Text>
        <Text style={styles.levelTitle}>{level.current.title}</Text>

        <View style={styles.levelBox}>
          <Text style={styles.nextLabel}>
            {level.next ? `Faltan ${level.pointsToNext} pts para ${level.next.name}` : '¡Nivel máximo alcanzado!'}
          </Text>
          <View style={styles.levelTrack}>
            <View style={[styles.levelFill, { width: `${level.progress * 100}%` }]} />
            {LEVELS.slice(1, -1).map((l) => (
              <View key={l.name} style={[styles.levelTick, { left: `${(l.min / maxPoints) * 100}%` }]} />
            ))}
            <View style={[styles.levelThumb, { left: `${level.progress * 100}%` }]} />
          </View>
          <View style={styles.levelLabels}>
            {LEVELS.map((l) => (
              <Text
                key={l.name}
                style={[styles.levelName, l.name === level.current.name && styles.levelNameActive]}
              >
                {l.name}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          {badges.map((b) => (
            <View
              key={b.id}
              style={styles.gridItem}
              accessibilityLabel={`${b.name}${b.earned ? '' : ', bloqueada'}`}
            >
              <BadgeMedal tier={b.tier} icon={b.icon} locked={!b.earned} size={54} />
            </View>
          ))}
        </View>
      </ScrollView>

      <FlowFooter step={1} total={4} onNext={() => navigation.navigate('challenges')} nextLabel="Ver retos" safeBottom={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerMascot: {
    marginVertical: 0,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  points: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.primaryDark,
    lineHeight: 70,
  },
  pointsLabel: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginTop: 8,
  },
  levelBox: {
    width: '100%',
    marginTop: 18,
  },
  nextLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.successText,
    marginBottom: 10,
  },
  levelTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
  },
  levelFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  levelTick: {
    position: 'absolute',
    width: 3,
    height: 16,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: COLORS.primaryDark,
  },
  levelThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  levelName: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  levelNameActive: {
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 22,
    width: '100%',
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 12,
  },
});
