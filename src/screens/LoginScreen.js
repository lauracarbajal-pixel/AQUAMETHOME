import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AQUAMETLogo from '../components/AQUAMETLogo';
import WaterMascot from '../components/WaterMascot';
import FloatingInput from '../components/FloatingInput';
import { COLORS } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

// `loading`: mientras se lee del teléfono si ya hay un sensor registrado
export default function LoginScreen({ onLogin, loading = false }) {
  const [email, setEmail] = useState('laura.carbajal@aquamet.mx');
  const [password, setPassword] = useState('123456789');
  const insets = useSafeAreaInsets();
  const { isShort, isCompact, scale } = useResponsive();
  // En pantallas bajitas la mascota se achica para que el botón quede a la vista
  const mascotSize = isShort ? 95 : scale(130);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 15, paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* Header Logo */}
        <AQUAMETLogo size="large" />

        {/* Mascot */}
        <WaterMascot size={mascotSize} />

        {/* Tagline */}
        <Text style={[styles.tagline, { fontSize: scale(22), lineHeight: scale(28) }]}>
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

          <View style={[styles.signupRow, isCompact && styles.signupRowCompact]}>
            <Text style={styles.newUserText}>¿Nuevo en AQUAMET?</Text>
            <TouchableOpacity onPress={() => alert('Crear una cuenta')}>
              <Text style={styles.signupText}>Crear una cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={onLogin}
          disabled={loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading, busy: loading }}
        >
          <Text style={styles.primaryButtonText}>{loading ? 'Cargando…' : 'Comenzar'}</Text>
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
    </View>
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
  // En teléfonos angostos el texto y el enlace se apilan para no encimarse
  signupRowCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
