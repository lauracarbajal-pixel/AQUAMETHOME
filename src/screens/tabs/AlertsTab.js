import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../../components/HeaderWithBack';
import AlertIllustration from '../../components/AlertIllustration';
import Icon from '../../components/Icon';
import { Button, Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { ALERT_STATUS } from '../../utils/status';
import { COLORS } from '../../theme/colors';

const TYPE_STYLE = {
  leak: { bg: COLORS.infoBg, border: COLORS.infoBorder },
  lid: { bg: COLORS.warningBg, border: COLORS.warningBorder },
};

function AlertCard({ alert, onReview }) {
  const tone = TYPE_STYLE[alert.type] || TYPE_STYLE.leak;
  return (
    <View style={[styles.alertCard, { backgroundColor: tone.bg, borderColor: tone.border }]}>
      <AlertIllustration type={alert.type} size={60} />
      <View style={styles.alertBody}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertSummary}>{alert.summary}</Text>
        <Text style={styles.alertMeta}>
          {alert.date} · {alert.detectedAt}
          {alert.status === 'reviewing' ? '  ·  En revisión' : ''}
        </Text>
        <Button title="Revisar" size="sm" onPress={onReview} style={styles.reviewButton} />
      </View>
    </View>
  );
}

export default function AlertsTab({ navigation }) {
  const { alerts } = useApp();
  const active = alerts.filter((a) => a.status !== 'resolved');
  const resolved = alerts.filter((a) => a.status === 'resolved');

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Alertas" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Activas ({active.length})</Text>

        {active.length === 0 ? (
          <Card style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Icon name="check" color={COLORS.white} strokeWidth={3} />
            </View>
            <Text style={styles.emptyTitle}>Sin alertas activas</Text>
            <Text style={styles.emptyText}>Tu tinaco está funcionando correctamente.</Text>
          </Card>
        ) : (
          active.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onReview={() => navigation.navigate('alertDetail', { alertId: alert.id })}
            />
          ))
        )}

        {resolved.length > 0 ? (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Resueltas</Text>
            {resolved.map((alert) => (
              <View key={alert.id} style={styles.resolvedRow}>
                <View style={[styles.resolvedIcon, { backgroundColor: ALERT_STATUS.resolved.color }]}>
                  <Icon name="check" size={14} color={COLORS.white} strokeWidth={3} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resolvedTitle}>{alert.title}</Text>
                  <Text style={styles.resolvedMeta}>
                    {alert.date} · {alert.detectedAt}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : null}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  alertBody: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textStrong,
  },
  alertSummary: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  alertMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  reviewButton: {
    marginTop: 10,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  resolvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  resolvedIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resolvedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  resolvedMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
