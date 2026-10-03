import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { HeaderWithBack, ProgressBar } from '../components/HeaderWithBack';
import { COLORS } from '../theme/colors';

export default function SetupStep2Screen({ onNext, onBack }) {
  const [wifiNetwork, setWifiNetwork] = useState('Infinitum_2.4G_Hogar');
  const [showWifiList, setShowWifiList] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const availableNetworks = [
    'Infinitum_2.4G_Hogar',
    'Izzi-5G_Casa',
    'Totalplay_WiFi_Plus',
  ];

  const handleTestSensor = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      Alert.alert('Prueba Exitosa', 'El sensor AM-01 se ha comunicado correctamente.');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithBack title="Configurar mi tinaco" onBack={onBack} />
      <ProgressBar progress={0.66} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.stepTitle}>Paso 2: Conexión Wifi</Text>

        {/* Card 1: Vincular Sensor */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vincular Sensor</Text>

          <View style={styles.greenBanner}>
            <View style={styles.greenBannerHeader}>
              <View style={styles.checkCircle}>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17L4 12"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.greenBannerText}>
                Estado: <Text style={styles.greenBold}>Conectado</Text>
              </Text>
            </View>
            <Text style={styles.greenModelText}>Modelo: AM-01</Text>
          </View>
        </View>

        {/* Card 2: Señal Wifi & Probar Sensor */}
        <View style={styles.card}>
          <View style={styles.wifiHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Señal Wifi</Text>
              <TouchableOpacity
                style={styles.wifiSelectorRow}
                onPress={() => setShowWifiList(!showWifiList)}
              >
                <Text style={styles.wifiNetworkName}>
                  Red: <Text style={styles.wifiValue}>{wifiNetwork}</Text>
                </Text>
                <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4 }}>
                  <Path
                    d="M6 9L12 15L18 9"
                    stroke="#0F6CBD"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Wifi Signal Strength Bars SVG */}
            <Svg width="30" height="26" viewBox="0 0 30 26" fill="none">
              <Rect x="2" y="18" width="4" height="6" rx="1" fill="#2ECC71" />
              <Rect x="8" y="13" width="4" height="11" rx="1" fill="#2ECC71" />
              <Rect x="14" y="8" width="4" height="16" rx="1" fill="#2ECC71" />
              <Rect x="20" y="3" width="4" height="21" rx="1" fill="#2ECC71" />
            </Svg>
          </View>

          {showWifiList && (
            <View style={styles.wifiDropdown}>
              {availableNetworks.map((net) => (
                <TouchableOpacity
                  key={net}
                  style={styles.wifiItem}
                  onPress={() => {
                    setWifiNetwork(net);
                    setShowWifiList(false);
                  }}
                >
                  <Text style={styles.wifiItemText}>{net}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestSensor}
            disabled={isTesting}
          >
            <Text style={styles.testButtonText}>
              {isTesting ? 'Probando...' : 'Probar Sensor'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Button: Siguiente (White with blue outline) */}
        <TouchableOpacity style={styles.outlineButton} onPress={onNext}>
          <Text style={styles.outlineButtonText}>Siguiente</Text>
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  greenBanner: {
    backgroundColor: '#E8F8F0',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A3E6BE',
  },
  greenBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  greenBannerText: {
    fontSize: 16,
    color: '#0F172A',
  },
  greenBold: {
    fontWeight: '800',
    color: '#27AE60',
  },
  greenModelText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 30,
  },
  wifiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wifiSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  wifiNetworkName: {
    fontSize: 13,
    color: '#0F6CBD',
  },
  wifiValue: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  wifiDropdown: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
    overflow: 'hidden',
  },
  wifiItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  wifiItemText: {
    fontSize: 14,
    color: '#1E293B',
  },
  testButton: {
    backgroundColor: '#0F6CBD',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F6CBD',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  outlineButtonText: {
    color: '#0F6CBD',
    fontSize: 17,
    fontWeight: '700',
  },
});
