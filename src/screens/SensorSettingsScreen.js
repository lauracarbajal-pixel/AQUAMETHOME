import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderWithBack } from '../components/HeaderWithBack';
import FloatingInput from '../components/FloatingInput';
import CustomSlider from '../components/CustomSlider';
import { Button, Card } from '../components/ui';
import { useApp } from '../context/AppContext';
import { TANK_LOCATIONS } from '../data/mockData';
import { dateLabel } from '../utils/format';
import { COLORS } from '../theme/colors';

// Ajustes del sensor ya registrado (botón de engrane en Inicio).
export default function SensorSettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { sensor, tank, saveSensor } = useApp();
  const current = sensor || tank;

  const [capacity, setCapacity] = useState(String(current.capacity));
  const [location, setLocation] = useState(current.location);
  const [minLevel, setMinLevel] = useState(current.minLevel);
  const [criticalLevel, setCriticalLevel] = useState(current.criticalLevel);

  const capacityNumber = parseInt(capacity, 10);
  const capacityValid = Number.isFinite(capacityNumber) && capacityNumber > 0;
  const criticalTooHigh = criticalLevel > minLevel;

  const handleSave = () => {
    if (!capacityValid) return;
    saveSensor({
      capacity: capacityNumber,
      location,
      minLevel,
      // El nivel crítico no puede quedar por encima del mínimo.
      criticalLevel: Math.min(criticalLevel, minLevel),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack title="Ajustes del sensor" onBack={navigation.goBack} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Card>
          <Text style={styles.cardTitle}>Sensor</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Modelo</Text>
            <Text style={styles.infoValue}>{current.sensorModel || 'AM-01'}</Text>
          </View>
          {sensor?.registeredAt ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registrado el</Text>
              <Text style={styles.infoValue}>{dateLabel(sensor.registeredAt)}</Text>
            </View>
          ) : null}
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Datos del tinaco</Text>
          <FloatingInput
            label="Capacidad (Litros)"
            required
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />
          {!capacityValid ? <Text style={styles.errorText}>Ingresa una capacidad válida en litros.</Text> : null}

          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.chips}>
            {TANK_LOCATIONS.map((loc) => {
              const selected = loc === location;
              return (
                <TouchableOpacity
                  key={loc}
                  onPress={() => setLocation(loc)}
                  style={[styles.chip, selected && styles.chipSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{loc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Alertas de nivel</Text>
          <CustomSlider label="Nivel mínimo" value={minLevel} onChange={setMinLevel} />
          <CustomSlider label="Alerta crítica" value={criticalLevel} onChange={setCriticalLevel} />
          {criticalTooHigh ? (
            <Text style={styles.hintText}>
              La alerta crítica no puede ser mayor que el nivel mínimo; se guardará en {minLevel}%.
            </Text>
          ) : null}
        </Card>

        <Button title="Guardar cambios" variant="success" onPress={handleSave} disabled={!capacityValid} />
        <Button title="Cancelar" variant="outline" onPress={navigation.goBack} style={styles.cancel} />
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textStrong,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textStrong,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.infoBg,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  chipTextSelected: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    marginTop: -4,
    marginBottom: 4,
  },
  hintText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cancel: {
    marginTop: 12,
  },
});
