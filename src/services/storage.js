// src/services/storage.js
// Persistencia local (AsyncStorage) del historial de lecturas y de las alertas
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_HISTORIAL = 'aquamet:historial';
const KEY_ALERTAS = 'aquamet:alertas';

// Las fechas se guardan como texto ISO y se reconstruyen al leer
const cargarLista = async (key, campoFecha) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw).map((item) => ({ ...item, [campoFecha]: new Date(item[campoFecha]) }));
  } catch {
    return [];
  }
};

const guardarLista = async (key, lista) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(lista));
  } catch {
    // Si falla el guardado, la app sigue funcionando con los datos en memoria
  }
};

export const cargarHistorial = () => cargarLista(KEY_HISTORIAL, 'actualizado');
export const guardarHistorial = (lista) => guardarLista(KEY_HISTORIAL, lista);

export const cargarAlertas = () => cargarLista(KEY_ALERTAS, 'hora');
export const guardarAlertas = (lista) => guardarLista(KEY_ALERTAS, lista);

export const borrarDatosLocales = () =>
  AsyncStorage.multiRemove([KEY_HISTORIAL, KEY_ALERTAS]).catch(() => {});
