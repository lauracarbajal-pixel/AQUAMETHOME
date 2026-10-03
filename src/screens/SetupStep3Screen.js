import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { HeaderWithBack, ProgressBar } from '../components/HeaderWithBack';
import CustomSlider from '../components/CustomSlider';
import { COLORS } from '../theme/colors';

export default function SetupStep3Screen({ onFinish, onBack }) {
  const [minLevel, setMinLevel] = useState(35);
  const [criticalLevel, setCriticalLevel] = useState(15);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="Configurar mi tinaco" onBack={onBack} />
      <ProgressBar progress={1.0} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepTitle}>Paso 3: Preferencias de Uso</Text>

        {/* Card: Alertas de Nivel Bajo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alertas de Nivel Bajo</Text>

          <CustomSlider
            label="Nivel Mínimo"
            value={minLevel}
            onChange={setMinLevel}
          />

          <CustomSlider
            label="Alertas Críticas"
            value={criticalLevel}
            onChange={setCriticalLevel}
          />
        </View>

        {/* Green Finish Button */}
        <TouchableOpacity style={styles.greenButton} onPress={onFinish}>
          <Text style={styles.greenButtonText}>Finalizar Configuración</Text>
        </TouchableOpacity>

        {/* Outline Back Button */}
        <TouchableOpacity style={styles.outlineButton} onPress={onBack}>
          <Text style={styles.outlineButtonText}>Anterior</Text>
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  greenButton: {
    backgroundColor: '#23A05B',
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#23A05B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  greenButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#0F6CBD',
    fontSize: 17,
    fontWeight: '700',
  },
});
