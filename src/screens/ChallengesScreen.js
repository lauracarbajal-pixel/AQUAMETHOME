import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../components/HeaderWithBack';
import { Button, Card, FlowFooter, ProgressTrack } from '../components/ui';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

function ChallengeCard({ challenge, featured, onClaim }) {
  const progress = challenge.target > 0 ? challenge.current / challenge.target : 0;
  const complete = challenge.current >= challenge.target;

  return (
    <Card>
      <Text style={featured ? styles.featuredTitle : styles.title}>{challenge.title}</Text>
      <ProgressTrack progress={progress} color={COLORS.success} style={{ marginTop: 12 }} />
      <Text style={styles.progressText}>
        Progreso: {challenge.current}
        {challenge.unit} de {challenge.target}
        {challenge.unit}
      </Text>

      {challenge.claimed ? (
        <View style={[styles.rewardChip, styles.claimedChip]}>
          <Text style={styles.claimedText}>Recompensa reclamada ✓</Text>
        </View>
      ) : complete ? (
        <Button title={`Reclamar +${challenge.reward} pts`} variant="success" size="sm" onPress={onClaim} style={{ marginTop: 12 }} />
      ) : (
        <View style={styles.rewardChip}>
          <Text style={styles.rewardText}>+{challenge.reward} pts</Text>
        </View>
      )}
    </Card>
  );
}

export default function ChallengesScreen({ navigation }) {
  const { challenges, claimChallenge } = useApp();

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Retos" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {challenges.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} featured={i === 0} onClaim={() => claimChallenge(c.id)} />
        ))}
      </ScrollView>
      <FlowFooter step={2} total={4} onPrev={navigation.goBack} onNext={() => navigation.navigate('badges')} />
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
  featuredTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  progressText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  rewardChip: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.successText,
  },
  claimedChip: {
    backgroundColor: COLORS.borderLight,
  },
  claimedText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
