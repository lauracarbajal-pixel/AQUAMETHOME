import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { HeaderWithBack } from '../components/HeaderWithBack';
import TabBar from '../components/TabBar';
import AlertIllustration from '../components/AlertIllustration';
import WaterMascot from '../components/WaterMascot';
import Icon from '../components/Icon';
import { Button, Card, StatusDot, StepProgress } from '../components/ui';
import { useApp } from '../context/AppContext';
import { ALERT_TYPES, ALERT_RESOLVE_POINTS } from '../data/mockData';
import { ALERT_STATUS } from '../utils/status';
import { COLORS } from '../theme/colors';

// Flujo: detalle (paso 2/3) → resolución con checklist (paso 3/3) → alerta resuelta.
export default function AlertDetailScreen({ alertId, navigation }) {
  const { alerts, markAlertReviewing, resolveAlert } = useApp();
  const alert = alerts.find((a) => a.id === alertId);

  const [stage, setStage] = useState(alert?.status === 'resolved' ? 'done' : 'detail');
  const [checkedSteps, setCheckedSteps] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  if (!alert) {
    return (
      <View style={styles.container}>
        <HeaderWithBack title="Detalle de Alerta" onBack={navigation.goBack} />
        <Text style={styles.missing}>Esta alerta ya no existe.</Text>
      </View>
    );
  }

  const config = ALERT_TYPES[alert.type];
  const status = ALERT_STATUS[alert.status];
  const allChecked = config.steps.every((_, i) => checkedSteps[i]);
  const canFinish = allChecked && confirmed;

  const toggleStep = (i) => setCheckedSteps((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleFinish = () => {
    resolveAlert(alert.id);
    setStage('done');
  };

  const renderDetail = () => (
    <>
      <Card style={styles.heroCard}>
        <AlertIllustration type={alert.type} size={110} withWarning={alert.status === 'reviewing' || alert.type === 'lid'} />
        <Text style={styles.heroTitle}>{alert.title}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>{alert.metric.label}</Text>
            <View style={styles.metricValueRow}>
              {alert.metric.trend === 'down' ? (
                <Icon name="arrowDown" size={18} color={COLORS.textStrong} strokeWidth={2.5} />
              ) : null}
              <Text style={styles.metricValue}>{alert.metric.value}</Text>
            </View>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Hora detectada</Text>
            <Text style={styles.metricValue}>{alert.detectedAt}</Text>
          </View>
        </View>

        <View style={styles.recommendations}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          {config.recommendations.map((rec) => (
            <Text key={rec} style={styles.bullet}>
              •  {rec}
            </Text>
          ))}
        </View>
      </Card>

      <Card style={styles.statusCard}>
        <StatusDot color={status.color} />
        <Text style={styles.statusText}>Estado: {status.label}</Text>
      </Card>

      {alert.status === 'pending' ? (
        <Button title="Confirmar revisión" onPress={() => markAlertReviewing(alert.id)} />
      ) : (
        <>
          <Button title="Revisión confirmada" variant="outlinePrimary" iconLeft="check" disabled style={styles.doneButton} />
          <Button title="Verificar reparación" variant="success" onPress={() => setStage('resolve')} style={{ marginTop: 12 }} />
        </>
      )}
    </>
  );

  const renderResolve = () => (
    <>
      <View style={styles.heroPlain}>
        <AlertIllustration type={alert.type} size={110} withWarning />
        <Text style={styles.heroTitle}>{alert.title}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Resolución de problemas</Text>
        {config.steps.map((step, i) => {
          const checked = !!checkedSteps[i];
          return (
            <TouchableOpacity
              key={step}
              style={styles.stepRow}
              onPress={() => toggleStep(i)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                {checked ? <Icon name="check" size={16} color={COLORS.white} strokeWidth={3.2} /> : null}
              </View>
              <Text style={[styles.stepText, checked && styles.stepTextDone]}>{step}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.confirmBox, confirmed && styles.confirmBoxOn, !allChecked && styles.confirmBoxDisabled]}
          onPress={() => setConfirmed((c) => !c)}
          disabled={!allChecked}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: confirmed, disabled: !allChecked }}
        >
          {confirmed ? <Icon name="check" size={18} color={COLORS.successText} strokeWidth={3} /> : null}
          <Text style={[styles.confirmText, confirmed && styles.confirmTextOn]}>
            {confirmed ? config.confirmedLabel : config.confirmLabel}
          </Text>
        </TouchableOpacity>
        {!allChecked ? <Text style={styles.hint}>Marca todos los pasos para poder confirmar.</Text> : null}
      </Card>

      <Button title="Finalizar resolución" onPress={handleFinish} disabled={!canFinish} />
      <Button title="Anterior" variant="outline" onPress={() => setStage('detail')} style={{ marginTop: 12 }} />
    </>
  );

  const renderDone = () => (
    <View style={styles.doneContainer}>
      <WaterMascot size={130} />
      <Text style={styles.doneTitle}>¡Alerta resuelta!</Text>
      <Text style={styles.doneText}>Gracias por cuidar tu tinaco. Ganaste +{ALERT_RESOLVE_POINTS} puntos.</Text>
      <Button title="Volver a alertas" onPress={navigation.goBack} style={styles.doneBack} />
    </View>
  );

  const step = stage === 'detail' ? 2 : 3;

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Detalle de Alerta" onBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        {stage === 'detail' && renderDetail()}
        {stage === 'resolve' && renderResolve()}
        {stage === 'done' && renderDone()}
      </ScrollView>
      {stage !== 'done' ? (
        <View style={styles.progress}>
          <StepProgress step={step} total={3} />
        </View>
      ) : null}
      <TabBar activeTab="alerts" onChange={navigation.switchTab} />
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
  missing: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  heroCard: {
    alignItems: 'center',
  },
  heroPlain: {
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginTop: 8,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: COLORS.borderLight,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginTop: 4,
  },
  recommendations: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textStrong,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 4,
    marginLeft: 4,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  doneButton: {
    opacity: 1,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxOn: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  stepTextDone: {
    color: COLORS.textSecondary,
  },
  confirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.infoBg,
  },
  confirmBoxOn: {
    borderColor: COLORS.successBorder,
    backgroundColor: COLORS.successBg,
  },
  confirmBoxDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginLeft: 6,
  },
  confirmTextOn: {
    color: COLORS.successText,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  doneContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textStrong,
    marginTop: 8,
  },
  doneText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  doneBack: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  progress: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
});
