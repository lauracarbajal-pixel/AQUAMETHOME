import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AQUAMETLogo from '../components/AQUAMETLogo';
import WaterMascot from '../components/WaterMascot';
import { Button, Card } from '../components/ui';
import { useResponsive } from '../utils/responsive';
import { COLORS } from '../theme/colors';

// Se muestra al iniciar sesión cuando todavía no hay un sensor registrado.
export default function SetupPromptScreen({ onConfigure, onSkip }) {
  const insets = useSafeAreaInsets();
  const { isShort } = useResponsive();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      >
        <AQUAMETLogo size="small" />
        <WaterMascot size={isShort ? 90 : 120} />

        <Card style={styles.card}>
          <Text style={styles.title}>Aún no tienes un sensor registrado</Text>
          <Text style={styles.text}>
            Para ver el nivel de tu tinaco y recibir alertas necesitas configurar tu sensor AQUAMET. ¿Quieres
            configurarlo ahora?
          </Text>

          <Button title="Configurar sensor" onPress={onConfigure} style={styles.button} />
          <Button title="Más tarde" variant="outline" onPress={onSkip} style={styles.button} />
        </Card>

        <Text style={styles.hint}>Puedes configurarlo después con el botón + de la pantalla de inicio.</Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    padding: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textStrong,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
  hint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
