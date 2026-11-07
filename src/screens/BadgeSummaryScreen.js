import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../components/HeaderWithBack';
import WaterMascot from '../components/WaterMascot';
import BadgeMedal from '../components/BadgeMedal';
import { FlowFooter } from '../components/ui';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

// Resumen final (paso 4/4): insignia destacada y próximas por desbloquear.
export default function BadgeSummaryScreen({ navigation }) {
  const { badges, points } = useApp();
  const earned = badges.filter((b) => b.earned);
  const featured = earned[0];
  const upcoming = badges.filter((b) => !b.earned).slice(0, 3);

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Mis Insignias" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <WaterMascot size={120} />
        <Text style={styles.headline}>¡Vas muy bien!</Text>
        <Text style={styles.subhead}>
          {earned.length} insignias · {points} puntos
        </Text>

        {featured ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insignia destacada</Text>
            <View style={styles.row}>
              <BadgeMedal tier={featured.tier} icon={featured.icon} size={54} />
              <View style={styles.text}>
                <Text style={styles.name}>{featured.name}</Text>
                <Text style={styles.description}>{featured.description}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {upcoming.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas por desbloquear</Text>
            {upcoming.map((b, i) => (
              <View key={b.id} style={[styles.row, i > 0 && styles.divider]}>
                <BadgeMedal tier={b.tier} icon={b.icon} locked size={50} />
                <View style={styles.text}>
                  <Text style={[styles.name, styles.lockedName]}>{b.name}</Text>
                  <Text style={styles.description}>{b.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <FlowFooter
        step={4}
        total={4}
        onPrev={navigation.goBack}
        onNext={() => navigation.switchTab('rewards')}
        nextLabel="Finalizar"
        nextVariant="success"
      />
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
    alignItems: 'center',
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textStrong,
  },
  subhead: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
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
  lockedName: {
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
