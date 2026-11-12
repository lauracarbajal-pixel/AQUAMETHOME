import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import SetupStep1Screen from './src/screens/SetupStep1Screen';
import SetupStep2Screen from './src/screens/SetupStep2Screen';
import SetupStep3Screen from './src/screens/SetupStep3Screen';
import MainTabsScreen from './src/screens/MainTabsScreen';
import ConsumptionScreen from './src/screens/ConsumptionScreen';
import AlertDetailScreen from './src/screens/AlertDetailScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import BadgesScreen from './src/screens/BadgesScreen';
import BadgeSummaryScreen from './src/screens/BadgeSummaryScreen';
import SetupPromptScreen from './src/screens/SetupPromptScreen';
import SensorSettingsScreen from './src/screens/SensorSettingsScreen';
import { MAX_CONTENT_WIDTH, useResponsive } from './src/utils/responsive';
import { COLORS } from './src/theme/colors';

// Navegación simple basada en una pila de pantallas (sin librerías externas).
function Navigator() {
  const [stack, setStack] = useState([{ name: 'login', params: {} }]);
  const [activeTab, setActiveTab] = useState('home');
  const { isWide } = useResponsive();
  const { sensor, sensorReady, startSetupDraft, finishSetupDraft } = useApp();

  const navigation = useMemo(
    () => ({
      navigate: (name, params = {}) => setStack((s) => [...s, { name, params }]),
      goBack: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      reset: (name, params = {}) => setStack([{ name, params }]),
      // Regresa a las pestañas principales y selecciona una.
      switchTab: (tab) => {
        setActiveTab(tab);
        setStack([{ name: 'main', params: {} }]);
      },
      // Cierra sesión: vuelve al inicio de sesión y borra el historial de pantallas.
      logout: () => {
        setActiveTab('home');
        setStack([{ name: 'login', params: {} }]);
      },
      // Abre el asistente para dar de alta un sensor (empieza con valores por defecto).
      startSetup: () => {
        startSetupDraft();
        setStack((s) => [...s, { name: 'setup1', params: {} }]);
      },
    }),
    [startSetupDraft]
  );

  // Al iniciar sesión: con sensor registrado entra directo; si no, pregunta si quiere configurarlo.
  const handleLogin = () => {
    if (sensor) navigation.switchTab('home');
    else navigation.reset('setupPrompt');
  };

  const loginScreen = <LoginScreen onLogin={handleLogin} loading={!sensorReady} />;

  // Botón "atrás" de Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        navigation.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, navigation]);

  const route = stack[stack.length - 1];

  const renderScreen = () => {
    switch (route.name) {
      case 'login':
        return loginScreen;
      case 'setupPrompt':
        return <SetupPromptScreen onConfigure={navigation.startSetup} onSkip={() => navigation.switchTab('home')} />;
      case 'sensorSettings':
        return <SensorSettingsScreen navigation={navigation} />;
      case 'setup1':
        return <SetupStep1Screen onNext={() => navigation.navigate('setup2')} onBack={navigation.goBack} />;
      case 'setup2':
        return <SetupStep2Screen onNext={() => navigation.navigate('setup3')} onBack={navigation.goBack} />;
      case 'setup3':
        return (
          <SetupStep3Screen
            onFinish={(thresholds) => {
              finishSetupDraft(thresholds);
              navigation.switchTab('home');
            }}
            onBack={navigation.goBack}
          />
        );
      case 'main':
        return <MainTabsScreen activeTab={activeTab} navigation={navigation} />;
      case 'consumption':
        return <ConsumptionScreen navigation={navigation} />;
      case 'alertDetail':
        return <AlertDetailScreen alertId={route.params.alertId} navigation={navigation} />;
      case 'challenges':
        return <ChallengesScreen navigation={navigation} />;
      case 'badges':
        return <BadgesScreen navigation={navigation} />;
      case 'badgeSummary':
        return <BadgeSummaryScreen navigation={navigation} />;
      default:
        return loginScreen;
    }
  };

  // Texto claro sobre las barras azules; oscuro en pantallas con fondo claro.
  const lightBackground =
    route.name === 'login' || route.name === 'setupPrompt' || (route.name === 'main' && activeTab === 'home');

  return (
    <>
      <StatusBar style={lightBackground ? 'dark' : 'light'} />
      {/* En tablets y navegador el contenido se centra con un ancho máximo */}
      <View style={[styles.frame, isWide && styles.frameWide]}>{renderScreen()}</View>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <AppProvider>
        <Navigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  frameWide: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.borderLight,
  },
});
