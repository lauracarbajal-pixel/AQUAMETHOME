import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../components/HeaderWithBack';
import BadgeMedal from '../components/BadgeMedal';
import { Card, FlowFooter } from '../components/ui';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

// Catálogo completo de insignias (paso 3/4)
export default function BadgesScreen({ navigation }) {
  const { badges } = useApp();
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Insignias" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.summary}>
          Has desbloqueado {earnedCount} de {badges.length} insignias
        </Text>
        {badges.map((b) => (
          <Card key={b.id} style={[styles.row, !b.earned && styles.lockedRow]}>
            <BadgeMedal tier={b.tier} icon={b.icon} locked={!b.earned} size={52} />
            <View style={styles.text}>
              <Text style={[styles.name, !b.earned && styles.lockedText]}>{b.name}</Text>
              <Text style={styles.description}>{b.description}</Text>
              {!b.earned ? <Text style={styles.lockedLabel}>Bloqueada</Text> : null}
            </View>
          </Card>
        ))}
      </ScrollView>
      <FlowFooter step={3} total={4} onPrev={navigation.goBack} onNext={() => navigation.navigate('badgeSummary')} />
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
  summary: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  lockedRow: {
    backgroundColor: '#F8FAFC',
  },
  text: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  lockedText: {
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  lockedLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
