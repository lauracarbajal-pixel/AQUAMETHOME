import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import SetupStep1Screen from './src/screens/SetupStep1Screen';
import SetupStep2Screen from './src/screens/SetupStep2Screen';
import SetupStep3Screen from './src/screens/SetupStep3Screen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  // Screen navigation state: 'login' | 'step1' | 'step2' | 'step3' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('step1')} />;
      case 'step1':
        return (
          <SetupStep1Screen
            onNext={() => setCurrentScreen('step2')}
            onBack={() => setCurrentScreen('login')}
          />
        );
      case 'step2':
        return (
          <SetupStep2Screen
            onNext={() => setCurrentScreen('step3')}
            onBack={() => setCurrentScreen('step1')}
          />
        );
      case 'step3':
        return (
          <SetupStep3Screen
            onFinish={() => setCurrentScreen('dashboard')}
            onBack={() => setCurrentScreen('step2')}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            onOpenSettings={() => setCurrentScreen('step1')}
          />
        );
      default:
        return <LoginScreen onLogin={() => setCurrentScreen('step1')} />;
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF5FF',
  },
});
