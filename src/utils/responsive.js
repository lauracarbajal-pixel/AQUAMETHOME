import { useWindowDimensions } from 'react-native';

// En tablets y en la web el contenido se limita a este ancho y se centra.
export const MAX_CONTENT_WIDTH = 600;

// Ancho de referencia del diseño (teléfono promedio).
const BASE_WIDTH = 390;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Medidas de la pantalla para adaptar tamaños.
// `scale(n)` ajusta un tamaño de diseño al ancho disponible (entre 82% y 120%).
export function useResponsive() {
  const { width: windowWidth, height } = useWindowDimensions();
  const width = Math.min(windowWidth, MAX_CONTENT_WIDTH);
  const factor = clamp(width / BASE_WIDTH, 0.82, 1.2);

  return {
    width,
    height,
    isCompact: width < 360, // teléfonos angostos
    isShort: height < 700, // teléfonos bajitos
    isWide: windowWidth > MAX_CONTENT_WIDTH, // tablets / navegador
    scale: (size) => Math.round(size * factor),
  };
}
