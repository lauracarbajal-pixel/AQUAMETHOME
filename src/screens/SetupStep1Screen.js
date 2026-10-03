import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { HeaderWithBack, ProgressBar } from '../components/HeaderWithBack';
import FloatingInput from '../components/FloatingInput';
import { COLORS } from '../theme/colors';

export default function SetupStep1Screen({ onNext, onBack }) {
  const [capacity, setCapacity] = useState('1100');
  const [location, setLocation] = useState('Azotea');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const locationsList = ['Azotea', 'Jardín', 'Patio Trasero', 'CISTERNA'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="Configurar mi tinaco" onBack={onBack} />
      <ProgressBar progress={0.33} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepTitle}>Paso 1: Datos del Tinaco</Text>

        {/* Card 1: Capacity & Location */}
        <View style={styles.card}>
          <FloatingInput
            label="Capacidad (Litros)"
            required
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
          />

          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Ubicación</Text>
            <TouchableOpacity
              style={styles.dropdownSelect}
              onPress={() => setShowLocationPicker(!showLocationPicker)}
            >
              <Text style={styles.dropdownText}>{location}</Text>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 9L12 15L18 9"
                  stroke="#475569"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            {showLocationPicker && (
              <View style={styles.pickerOptionsContainer}>
                {locationsList.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={styles.pickerOption}
                    onPress={() => {
                      setLocation(loc);
                      setShowLocationPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        loc === location && styles.pickerOptionSelected,
                      ]}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Card 2: Sensor Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado del Sensor</Text>
          <View style={styles.statusBox}>
            <View style={styles.statusRow}>
              <View style={styles.greenDot} />
              <Text style={styles.statusText}>Conectado</Text>
            </View>
            <Text style={styles.modelText}>Modelo: AM-01</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#0F172A',
  },
  pickerOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#334155',
  },
  pickerOptionSelected: {
    fontWeight: '700',
    color: '#0F6CBD',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statusBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ECC71',
    marginRight: 8,
  },
  statusText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modelText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#0F6CBD',
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
