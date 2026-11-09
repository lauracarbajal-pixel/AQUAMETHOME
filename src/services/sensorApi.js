// src/services/sensorApi.js
// Cliente para el endpoint del sensor AM-01 (ESP32 + HC-SR04)

// El firmware publica el sensor como aquamet.local (mDNS).
// Si falla en algún teléfono, usa la IP del monitor serie: 'http://192.168.1.50'
let BASE_URL = 'http://aquamet.local';

export const setSensorUrl = (url) => {
  BASE_URL = url.replace(/\/$/, '');
};

const fetchConTimeout = async (path, ms = 4000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

// Paso 2 del asistente: prueba de comunicación con el sensor
export const probarConexion = async () => {
  try {
    const data = await fetchConTimeout('/api/ping');
    return data.ok === true;
  } catch {
    return false;
  }
};

// Paso 1 del asistente: enviar altura (cm) y capacidad (L) al sensor
export const guardarConfig = async ({ alturaCm, capacidadLitros }) => {
  const params = new URLSearchParams();
  if (alturaCm != null) params.append('altura', String(alturaCm));
  if (capacidadLitros != null) params.append('capacidad', String(capacidadLitros));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(`${BASE_URL}/api/config?${params.toString()}`, {
      method: 'POST',
      signal: controller.signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
};

export const obtenerConfig = () => fetchConTimeout('/api/config');

// Estado según los umbrales del paso 3 (porcentajes)
export const calcularEstado = (porcentaje, nivelMinimo = 30, nivelCritico = 15) => {
  if (porcentaje <= nivelCritico) return 'critico';
  if (porcentaje <= nivelMinimo) return 'bajo';
  return 'normal';
};

// Lectura actual del nivel
export const obtenerNivel = async (umbrales = {}) => {
  const data = await fetchConTimeout('/api/nivel');
  return {
    porcentaje: data.porcentaje,
    litros: data.litros,
    nivelCm: data.nivel_cm,
    distanciaCm: data.distancia_cm,
    estado: calcularEstado(data.porcentaje, umbrales.minimo, umbrales.critico),
    actualizado: new Date(),
  };
};

/* Ejemplo de uso en DashboardScreen.js:

import { useEffect, useState } from 'react';
import { obtenerNivel } from '../services/sensorApi';

const [lectura, setLectura] = useState(null);

useEffect(() => {
  const leer = async () => {
    try {
      setLectura(await obtenerNivel({ minimo: 30, critico: 15 }));
    } catch (e) {
      console.log('Sin conexión con el sensor', e.message);
    }
  };
  leer();
  const id = setInterval(leer, 5000); // refresca cada 5 s
  return () => clearInterval(id);
}, []);
*/