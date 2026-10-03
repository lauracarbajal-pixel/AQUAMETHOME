# AQUAMET

Aplicación móvil para monitorear el nivel de agua de tu tinaco (tanque) en tiempo real mediante un sensor conectado por Wi‑Fi. Construida con React Native y Expo.

> **Estado:** prototipo de interfaz (v1.0.0). Los datos mostrados (nivel, estado, redes Wi‑Fi, prueba del sensor) son simulados; aún no hay conexión real con el sensor ni con un backend.

## Funcionalidades

- **Inicio de sesión** de acceso a la app.
- **Asistente de configuración en 3 pasos:**
  1. **Datos del tinaco:** capacidad en litros y ubicación (Azotea, Jardín, Patio Trasero, Cisterna).
  2. **Conexión Wi‑Fi:** selección de red y prueba de comunicación con el sensor AM‑01.
  3. **Preferencias de uso:** umbrales con sliders para *Nivel mínimo* y *Alertas críticas*.
- **Dashboard** con cuatro pestañas (Inicio, Alertas, Historial y Recompensas), gráfico visual del tinaco con su porcentaje de llenado, estado actual y hora de la última actualización.

## Tecnologías

| Herramienta | Versión |
|---|---|
| Expo | ~51.0.0 |
| React / React Native | 18.2.0 / 0.74.5 |
| react-native-svg | 15.2.0 |
| react-native-safe-area-context | 4.10.5 |
| react-native-screens | ~3.31.1 |
| react-native-web | ~0.19.10 |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior y npm
- App **Expo Go** en tu dispositivo, o un emulador de Android / simulador de iOS

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

Después escanea el código QR con Expo Go, o ejecuta directamente:

```bash
npm run android   # Emulador / dispositivo Android
npm run ios       # Simulador iOS (solo macOS)
npm run web       # Navegador
```

## Estructura del proyecto

```
aquamet-app/
├── App.js               # Raíz de la app y navegación entre pantallas (por estado)
├── index.js             # Punto de entrada
├── app.json             # Configuración de Expo
├── android/  ios/       # Proyectos nativos
└── src/
    ├── components/      # AQUAMETLogo, CustomSlider, FloatingInput,
    │                    # HeaderWithBack, TinacoGraphic, WaterMascot
    ├── screens/         # LoginScreen, SetupStep1-3Screen, DashboardScreen
    └── theme/colors.js  # Paleta de colores
```

### Flujo de navegación

`Login → Paso 1 → Paso 2 → Paso 3 → Dashboard`

La navegación se maneja con un estado simple (`currentScreen`) en `App.js`, sin librerías de navegación. Desde el Dashboard, el botón de ajustes regresa al asistente de configuración.

## Permisos (Android)

`INTERNET`, `ACCESS_WIFI_STATE` y `CHANGE_WIFI_STATE`, necesarios para la comunicación Wi‑Fi con el sensor.

## Próximos pasos

- Integración real con el sensor AM‑01 y lectura de nivel en vivo.
- Autenticación y backend.
- Persistencia de la configuración del tinaco.
- Notificaciones push de alertas de nivel bajo y crítico.
- Pantallas completas de Alertas, Historial y Recompensas.

