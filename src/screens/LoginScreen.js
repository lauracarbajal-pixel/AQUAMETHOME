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
import AQUAMETLogo from '../components/AQUAMETLogo';
import WaterMascot from '../components/WaterMascot';
import FloatingInput from '../components/FloatingInput';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('laura.carbajal@aquamet.mx');
  const [password, setPassword] = useState('123456789');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Logo */}
        <AQUAMETLogo size="large" />

        {/* Mascot */}
        <WaterMascot size={130} />

        {/* Tagline */}
        <Text style={styles.tagline}>
          Monitorea tu tinaco de{'\n'}agua fácilmente.
        </Text>

        {/* Login Card */}
        <View style={styles.card}>
          <FloatingInput
            label="Correo Electrónico"
            required
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <FloatingInput
            label="Contraseña"
            required
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.signupRow}>
            <Text style={styles.newUserText}>¿Nuevo en AQUAMET?</Text>
            <TouchableOpacity onPress={() => alert('Crear una cuenta')}>
              <Text style={styles.signupText}>Crear una cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
          <Text style={styles.primaryButtonText}>Comenzar</Text>
        </TouchableOpacity>

        {/* Bottom Status Circle Indicator */}
        <View style={styles.bottomIconContainer}>
          <View style={styles.greenCheckCircle}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>
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
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 30,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 28,
    marginVertical: 14,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  newUserText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  signupText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F6CBD',
  },
  primaryButton: {
    backgroundColor: '#0F6CBD',
    width: '100%',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#0F6CBD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  bottomIconContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  greenCheckCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
