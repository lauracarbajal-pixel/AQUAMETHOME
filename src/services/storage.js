// src/services/storage.js
// Persistencia local (AsyncStorage) de lecturas, alertas y eventos del sensor
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  samples: 'aquamet:samples',
  alerts: 'aquamet:alerts',
  events: 'aquamet:events',
};

export const loadList = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const saveList = async (key, list) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Si falla el guardado, la app sigue funcionando con los datos en memoria
  }
};

export const clearLocalData = () => AsyncStorage.multiRemove(Object.values(KEYS)).catch(() => {});
