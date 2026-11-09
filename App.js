import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';
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

// Navegación simple basada en una pila de pantallas (sin librerías externas).
function Navigator() {
  const [stack, setStack] = useState([{ name: 'login', params: {} }]);
  const [activeTab, setActiveTab] = useState('home');

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
    }),
    []
  );

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
        return <LoginScreen onLogin={() => navigation.navigate('setup1')} />;
      case 'setup1':
        return <SetupStep1Screen onNext={() => navigation.navigate('setup2')} onBack={navigation.goBack} />;
      case 'setup2':
        return <SetupStep2Screen onNext={() => navigation.navigate('setup3')} onBack={navigation.goBack} />;
      case 'setup3':
        return <SetupStep3Screen onFinish={() => navigation.switchTab('home')} onBack={navigation.goBack} />;
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
        return <LoginScreen onLogin={() => navigation.navigate('setup1')} />;
    }
  };

  // Texto claro sobre las barras azules; oscuro en pantallas con fondo claro.
  const lightBackground = route.name === 'login' || (route.name === 'main' && activeTab === 'home');

  return (
    <>
      <StatusBar style={lightBackground ? 'dark' : 'light'} />
      {renderScreen()}
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
});
