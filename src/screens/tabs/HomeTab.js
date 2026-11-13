import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AQUAMETLogo from '../../components/AQUAMETLogo';
import TinacoGraphic from '../../components/TinacoGraphic';
import BadgeMedal from '../../components/BadgeMedal';
import WaterMascot from '../../components/WaterMascot';
import Icon from '../../components/Icon';
import { Button, Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { WEEKLY_CONSUMPTION } from '../../data/mockData';
import { getTankStatus } from '../../utils/status';
import { dateLabel, timeLabel12 } from '../../utils/format';
import { useResponsive } from '../../utils/responsive';
import { COLORS } from '../../theme/colors';

const LOGOUT_MESSAGE = '¿Seguro que quieres cerrar sesión?';
const REPLACE_SENSOR_MESSAGE =
  'Por ahora la app maneja un solo sensor. Si configuras uno nuevo, reemplazará al actual. ¿Quieres continuar?';

// Alert.alert no muestra botones en la web, ahí se usa el confirm del navegador.
function confirmAction({ title, message, confirmText, onConfirm }) {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}

// Botón de ícono con etiqueta para la barra superior de Inicio
function HeaderAction({ icon, label, a11y, onPress, compact, style }) {
  return (
    <TouchableOpacity
      style={[styles.action, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
    >
      <Icon name={icon} color={COLORS.textSecondary} />
      {compact ? null : <Text style={styles.sideLabel}>{label}</Text>}
    </TouchableOpacity>
  );
}

export default function HomeTab({ navigation }) {
  const insets = useSafeAreaInsets();
  const { tank, connection, latestBadge, sensor } = useApp();
  const { width } = useResponsive();
  // Con etiquetas la barra superior necesita ~330 px; en teléfonos angostos solo se muestran los íconos
  const isCompact = width < 380;
  const hasSensor = Boolean(sensor);
  const hasReading = tank.lastUpdate != null;
  const status = hasReading
    ? getTankStatus({ level: tank.level, minLevel: tank.minLevel, criticalLevel: tank.criticalLevel })
    : connection === 'offline'
      ? { key: 'offline', label: 'Sin conexión', color: COLORS.danger, bg: COLORS.dangerBg, border: COLORS.dangerBorder, icon: 'alert' }
      : { key: 'connecting', label: 'Conectando…', color: COLORS.textSecondary, bg: COLORS.white, border: COLORS.borderLight, icon: 'alert' };

  const avgDaily = Math.round(WEEKLY_CONSUMPTION.reduce((s, d) => s + d.current, 0) / WEEKLY_CONSUMPTION.length);

  const confirmLogout = () =>
    confirmAction({ title: 'Cerrar sesión', message: LOGOUT_MESSAGE, confirmText: 'Cerrar sesión', onConfirm: navigation.logout });

  // + : alta de un sensor. Por ahora la app maneja un solo sensor, así que el nuevo reemplaza al actual.
  const handleAddSensor = () => {
    if (!hasSensor) {
      navigation.startSetup();
      return;
    }
    confirmAction({
      title: 'Agregar sensor',
      message: REPLACE_SENSOR_MESSAGE,
      confirmText: 'Continuar',
      onConfirm: navigation.startSetup,
    });
  };

  const sideSlotStyle = isCompact ? styles.sideSlotCompact : styles.sideSlot;

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topRow}>
        <View style={[sideSlotStyle, styles.sideLeft]}>
          <HeaderAction icon="logout" label="Salir" a11y="Cerrar sesión" onPress={confirmLogout} compact={isCompact} />
        </View>
        <AQUAMETLogo size="small" />
        <View style={[sideSlotStyle, styles.sideRight]}>
          <HeaderAction icon="plus" label="Agregar" a11y="Agregar sensor" onPress={handleAddSensor} compact={isCompact} />
          {hasSensor ? (
            <HeaderAction
              icon="gear"
              label="Ajustes"
              a11y="Ajustes del sensor"
              onPress={() => navigation.navigate('sensorSettings')}
              compact={isCompact}
              style={styles.actionGap}
            />
          ) : null}
        </View>
      </View>

      {hasSensor ? (
        <>
          <TinacoGraphic levelPercentage={tank.level} capacityLitros={tank.capacity} />

          <View style={[styles.statusPill, { backgroundColor: status.bg, borderColor: status.border }]}>
            <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
              <Icon name={status.icon} size={15} color={COLORS.white} strokeWidth={3.2} />
            </View>
            <Text style={[styles.statusText, { color: status.color }]} numberOfLines={1} adjustsFontSizeToFit>
              Estado: {status.label}
            </Text>
          </View>

          {hasReading ? (
            <Text style={styles.lastUpdate}>
              Última actualización: {timeLabel12(tank.lastUpdate)}
              {connection === 'offline' ? ' (sin conexión)' : ''}
            </Text>
          ) : null}
        </>
      ) : (
        // Sin sensor registrado: invitación a configurarlo
        <Card style={styles.noSensorCard}>
          <WaterMascot size={90} />
          <Text style={styles.noSensorTitle}>Aún no tienes un sensor registrado</Text>
          <Text style={styles.noSensorText}>Configúralo para ver el nivel de tu tinaco y recibir alertas.</Text>
          <Button title="Configurar sensor" iconLeft="plus" onPress={navigation.startSetup} style={styles.noSensorButton} />
        </Card>
      )}

      {/* Insignia más reciente → lleva a Recompensas */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.switchTab('rewards')}
        accessibilityRole="button"
        accessibilityLabel={
          latestBadge
            ? `Insignia más reciente: ${latestBadge.name}. Ver recompensas`
            : 'Aún no tienes insignias. Ver recompensas'
        }
        style={styles.linkWrapper}
      >
        <Card style={styles.linkCard}>
          <View style={styles.badgeSlot}>
            {latestBadge ? (
              <BadgeMedal tier={latestBadge.tier} icon={latestBadge.icon} size={40} />
            ) : (
              <BadgeMedal locked size={40} />
            )}
          </View>
          <View style={styles.linkText}>
            <Text style={styles.linkOverline}>Insignia más reciente</Text>
            <Text style={styles.linkTitle} numberOfLines={1}>
              {latestBadge ? latestBadge.name : 'Aún no tienes insignias'}
            </Text>
            <Text style={styles.linkSubtitle} numberOfLines={1}>
              {latestBadge
                ? latestBadge.earnedAt
                  ? `Obtenida el ${dateLabel(latestBadge.earnedAt)}`
                  : 'Obtenida'
                : 'Completa retos para ganar la primera'}
            </Text>
          </View>
          <Icon name="chevronRight" color={COLORS.textSecondary} />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('consumption')}
        accessibilityRole="button"
        accessibilityLabel="Ver análisis de consumo"
        style={[styles.linkWrapper, styles.linkWrapperNext]}
      >
        <Card style={styles.linkCard}>
          <View style={styles.linkIcon}>
            <Icon name="chart" color={COLORS.primary} />
          </View>
          <View style={styles.linkText}>
            <Text style={styles.linkTitle} numberOfLines={1}>Análisis de consumo</Text>
            <Text style={styles.linkSubtitle} numberOfLines={1}>Promedio diario: {avgDaily} L</Text>
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
  // Ambos lados miden lo mismo para que el logo quede centrado
  sideSlot: {
    width: 100,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  sideSlotCompact: {
    width: 64,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  sideLeft: {
    justifyContent: 'flex-start',
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  action: {
    alignItems: 'center',
    minWidth: 28,
  },
  actionGap: {
    marginLeft: 12,
  },
  noSensorCard: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 0,
  },
  noSensorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
    textAlign: 'center',
  },
  noSensorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  noSensorButton: {
    marginTop: 14,
    alignSelf: 'stretch',
  },
  sideLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
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
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  lastUpdate: {
    fontSize: 14,
    color: '#475569',
    marginTop: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  linkWrapper: {
    width: '100%',
    marginTop: 22,
  },
  linkWrapperNext: {
    marginTop: 12,
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
  badgeSlot: {
    width: 42,
    alignItems: 'center',
    marginRight: 12,
  },
  linkText: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  linkOverline: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
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
