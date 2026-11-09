import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import AQUAMETLogo from '../components/AQUAMETLogo';
import TinacoGraphic from '../components/TinacoGraphic';
import { COLORS } from '../theme/colors';
import { obtenerNivel } from '../services/sensorApi';
import {
  cargarHistorial,
  guardarHistorial,
  cargarAlertas,
  guardarAlertas,
} from '../services/storage';

const UMBRALES = { minimo: 30, critico: 15 };
const INTERVALO_MS = 5000;
const MAX_HISTORIAL = 100;

const ESTADOS = {
  normal: { texto: 'Normal', fondo: '#E8F8F0', borde: '#A3E6BE', punto: '#2ECC71', color: '#1E8E4E' },
  bajo: { texto: 'Bajo', fondo: '#FFF7E0', borde: '#F5D77A', punto: '#F5A623', color: '#9A6700' },
  critico: { texto: 'Crítico', fondo: '#FDECEC', borde: '#F5A3A3', punto: '#E5484D', color: '#B42318' },
};

const formatoHora = (fecha) =>
  fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export default function DashboardScreen({ onOpenSettings }) {
  const [activeTab, setActiveTab] = useState('INICIO');
  const [lectura, setLectura] = useState(null);
  const [sinConexion, setSinConexion] = useState(false);
  const [historial, setHistorial] = useState([]); // lecturas del sensor, más reciente primero
  const [alertas, setAlertas] = useState([]); // alertas generadas, más reciente primero
  const [cargado, setCargado] = useState(false); // ya se leyó lo guardado en el teléfono
  const estadoPrevio = useRef(null);
  const conexionPrevia = useRef(true);

  // Recupera historial y alertas guardados; las lecturas nuevas (más recientes) van primero
  useEffect(() => {
    let activo = true;
    Promise.all([cargarHistorial(), cargarAlertas()]).then(([h, a]) => {
      if (!activo) return;
      setHistorial((prev) => [...prev, ...h].slice(0, MAX_HISTORIAL));
      setAlertas((prev) => [...prev, ...a].slice(0, 50));
      setCargado(true);
    });
    return () => {
      activo = false;
    };
  }, []);

  // Guarda cada cambio, pero solo después de cargar para no pisar lo almacenado
  useEffect(() => {
    if (cargado) guardarHistorial(historial);
  }, [historial, cargado]);

  useEffect(() => {
    if (cargado) guardarAlertas(alertas);
  }, [alertas, cargado]);

  useEffect(() => {
    let activo = true;

    const agregarAlerta = (alerta) =>
      setAlertas((prev) => [{ ...alerta, id: `${Date.now()}-${prev.length}`, hora: new Date() }, ...prev].slice(0, 50));

    const leer = async () => {
      try {
        const nueva = await obtenerNivel(UMBRALES);
        if (!activo) return;
        setLectura(nueva);
        setSinConexion(false);
        setHistorial((prev) => [nueva, ...prev].slice(0, MAX_HISTORIAL));

        if (!conexionPrevia.current) {
          agregarAlerta({ tipo: 'info', mensaje: 'Se restableció la conexión con el sensor.' });
        }
        conexionPrevia.current = true;

        if (nueva.estado !== estadoPrevio.current && nueva.estado !== 'normal') {
          agregarAlerta({
            tipo: nueva.estado,
            mensaje:
              nueva.estado === 'critico'
                ? `Nivel crítico: ${nueva.porcentaje}% (${nueva.litros} L).`
                : `Nivel bajo: ${nueva.porcentaje}% (${nueva.litros} L).`,
          });
        }
        estadoPrevio.current = nueva.estado;
      } catch (e) {
        if (!activo) return;
        setSinConexion(true);
        if (conexionPrevia.current) {
          agregarAlerta({ tipo: 'critico', mensaje: 'Sin conexión con el sensor.' });
        }
        conexionPrevia.current = false;
      }
    };

    leer();
    const id = setInterval(leer, INTERVALO_MS);
    return () => {
      activo = false;
      clearInterval(id);
    };
  }, []);

  // Litros consumidos durante la sesión: suma de las bajadas entre lecturas consecutivas
  const litrosConsumidos = historial.reduce((total, actual, i) => {
    const anterior = historial[i + 1]; // más antigua
    if (!anterior) return total;
    const baja = anterior.litros - actual.litros;
    return baja > 0 ? total + baja : total;
  }, 0);

  const estadoUI = lectura ? ESTADOS[lectura.estado] : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'INICIO':
        return (
          <ScrollView contentContainerStyle={styles.mainScrollContent}>
            {/* Tinaco Visual Graphic */}
            <TinacoGraphic
              levelPercentage={lectura ? lectura.porcentaje : 0}
              capacityLitros={lectura && lectura.porcentaje > 0 ? lectura.litros / (lectura.porcentaje / 100) : 0}
            />

            {/* Status Badge */}
            {sinConexion && !lectura ? (
              <View style={[styles.statusPill, { backgroundColor: ESTADOS.critico.fondo, borderColor: ESTADOS.critico.borde }]}>
                <Text style={[styles.statusPillText, { color: ESTADOS.critico.color }]}>Sin conexión con el sensor</Text>
              </View>
            ) : estadoUI ? (
              <View style={[styles.statusPill, { backgroundColor: estadoUI.fondo, borderColor: estadoUI.borde }]}>
                <View style={[styles.statusCheckCircle, { backgroundColor: estadoUI.punto }]}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17L4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <Text style={[styles.statusPillText, { color: estadoUI.color }]}>Estado: {estadoUI.texto}</Text>
              </View>
            ) : (
              <Text style={styles.lastUpdateText}>Conectando con el sensor…</Text>
            )}

            {/* Last Updated Timestamp */}
            {lectura && (
              <Text style={styles.lastUpdateText}>
                Última actualización: {formatoHora(lectura.actualizado)}
                {sinConexion ? ' (sin conexión)' : ''}
              </Text>
            )}
          </ScrollView>
        );

      case 'ALERTAS':
        if (alertas.length > 0) {
          return (
            <ScrollView contentContainerStyle={styles.listContent}>
              <Text style={styles.listTitle}>Alertas</Text>
              {alertas.map((a) => {
                const ui = ESTADOS[a.tipo] || ESTADOS.normal;
                return (
                  <View key={a.id} style={[styles.listItem, { borderLeftColor: ui.punto }]}>
                    <Text style={styles.listItemMain}>{a.mensaje}</Text>
                    <Text style={styles.listItemSub}>{formatoHora(a.hora)}</Text>
                  </View>
                );
              })}
            </ScrollView>
          );
        }
        return (
          <View style={styles.emptyTabContainer}>
            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
                stroke="#0F6CBD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M13.73 21A2 2 0 0 1 10.27 21"
                stroke="#0F6CBD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.tabTitle}>Sin Alertas Activas</Text>
            <Text style={styles.tabSubtitle}>
              {lectura
                ? `El nivel de tu tinaco está al ${lectura.porcentaje}%.`
                : 'Esperando datos del sensor…'}
            </Text>
          </View>
        );

      case 'HISTORIAL':
        if (historial.length > 0) {
          return (
            <ScrollView contentContainerStyle={styles.listContent}>
              <Text style={styles.listTitle}>Historial de Consumo</Text>
              <Text style={styles.tabSubtitle}>
                Consumo estimado en las últimas {historial.length} lecturas:{Math.round(litrosConsumidos)} L
              </Text>
              {historial.map((h, i) => (
                <View key={`${h.actualizado.getTime()}-${i}`} style={[styles.listItem, { borderLeftColor: ESTADOS[h.estado].punto }]}>
                  <Text style={styles.listItemMain}>
                    {h.porcentaje}% · {h.litros} L
                  </Text>
                  <Text style={styles.listItemSub}>{formatoHora(h.actualizado)}</Text>
                </View>
              ))}
            </ScrollView>
          );
        }
        return (
          <View style={styles.emptyTabContainer}>
            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="9" stroke="#0F6CBD" strokeWidth="2" />
              <Path d="M12 7V12L15 15" stroke="#0F6CBD" strokeWidth="2" strokeLinecap="round" />
            </Svg>
            <Text style={styles.tabTitle}>Historial de Consumo</Text>
            <Text style={styles.tabSubtitle}>Aún no hay lecturas del sensor.</Text>
          </View>
        );

      case 'RECOMPENSAS':
        return (
          <View style={styles.emptyTabContainer}>
            <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <Rect x="3" y="8" width="18" height="13" rx="2" stroke="#0F6CBD" strokeWidth="2" />
              <Path d="M12 8V21" stroke="#0F6CBD" strokeWidth="2" />
              <Path d="M7.5 8C6 8 5 6.5 6 5C7 3.5 12 8 12 8" stroke="#0F6CBD" strokeWidth="2" />
              <Path d="M16.5 8C18 8 19 6.5 18 5C17 3.5 12 8 12 8" stroke="#0F6CBD" strokeWidth="2" />
            </Svg>
            <Text style={styles.tabTitle}>Puntos AQUAMET</Text>
            <Text style={styles.tabSubtitle}>¡Has ahorrado 150L de agua esta semana!</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar Header */}
      <View style={styles.topBar}>
        <View style={{ width: 30 }} />
        <AQUAMETLogo size="small" />
        <TouchableOpacity style={styles.settingsButton} onPress={onOpenSettings}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="#64748B"
              strokeWidth="2"
            />
            <Path
              d="M19.4 15A1.65 1.65 0 0 0 20 12A1.65 1.65 0 0 0 19.4 9L21 7.4L19.4 5.8L17.8 7.4A1.65 1.65 0 0 0 14.8 6.8V4.6H12.6V6.8A1.65 1.65 0 0 0 9.6 7.4L8 5.8L6.4 7.4L8 9A1.65 1.65 0 0 0 7.4 12A1.65 1.65 0 0 0 8 15L6.4 16.6L8 18.2L9.6 16.6A1.65 1.65 0 0 0 12.6 17.2V19.4H14.8V17.2A1.65 1.65 0 0 0 17.8 16.6L19.4 18.2L21 16.6L19.4 15Z"
              stroke="#64748B"
              strokeWidth="2"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Dynamic Screen Content */}
      <View style={styles.contentContainer}>{renderTabContent()}</View>

      {/* Bottom Tab Bar matching Image 5 */}
      <View style={styles.bottomTabBar}>
        {/* Tab 1: INICIO */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('INICIO')}
        >
          {activeTab === 'INICIO' && <View style={styles.activeTabIndicator} />}
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z"
              fill={activeTab === 'INICIO' ? '#0F6CBD' : 'none'}
              stroke={activeTab === 'INICIO' ? '#0F6CBD' : '#64748B'}
              strokeWidth="2"
            />
          </Svg>
          <Text style={[styles.tabLabel, activeTab === 'INICIO' && styles.activeTabLabel]}>
            INICIO
          </Text>
        </TouchableOpacity>

        {/* Tab 2: ALERTAS */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('ALERTAS')}
        >
          {activeTab === 'ALERTAS' && <View style={styles.activeTabIndicator} />}
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
              fill={activeTab === 'ALERTAS' ? '#0F6CBD' : 'none'}
              stroke={activeTab === 'ALERTAS' ? '#0F6CBD' : '#64748B'}
              strokeWidth="2"
            />
          </Svg>
          <Text style={[styles.tabLabel, activeTab === 'ALERTAS' && styles.activeTabLabel]}>
            ALERTAS
          </Text>
        </TouchableOpacity>

        {/* Tab 3: HISTORIAL */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('HISTORIAL')}
        >
          {activeTab === 'HISTORIAL' && <View style={styles.activeTabIndicator} />}
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle
              cx="12"
              cy="12"
              r="9"
              fill={activeTab === 'HISTORIAL' ? '#0F6CBD' : 'none'}
              stroke={activeTab === 'HISTORIAL' ? '#0F6CBD' : '#64748B'}
              strokeWidth="2"
            />
            <Path
              d="M12 7V12L15 14"
              stroke={activeTab === 'HISTORIAL' ? '#FFFFFF' : '#64748B'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={[styles.tabLabel, activeTab === 'HISTORIAL' && styles.activeTabLabel]}>
            HISTORIAL
          </Text>
        </TouchableOpacity>

        {/* Tab 4: RECOMPENSAS */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('RECOMPENSAS')}
        >
          {activeTab === 'RECOMPENSAS' && <View style={styles.activeTabIndicator} />}
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Rect
              x="3"
              y="8"
              width="18"
              height="12"
              rx="2"
              fill={activeTab === 'RECOMPENSAS' ? '#0F6CBD' : 'none'}
              stroke={activeTab === 'RECOMPENSAS' ? '#0F6CBD' : '#64748B'}
              strokeWidth="2"
            />
            <Path
              d="M12 8V20"
              stroke={activeTab === 'RECOMPENSAS' ? '#FFFFFF' : '#64748B'}
              strokeWidth="2"
            />
          </Svg>
          <Text style={[styles.tabLabel, activeTab === 'RECOMPENSAS' && styles.activeTabLabel]}>
            RECOMPENSAS
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: COLORS.background,
  },
  settingsButton: {
    padding: 6,
  },
  contentContainer: {
    flex: 1,
  },
  mainScrollContent: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#A3E6BE',
  },
  statusCheckCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusPillText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E8E4E',
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 14,
    fontWeight: '500',
  },
  emptyTabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  listItemMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  listItemSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  tabSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0F6CBD',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#0F6CBD',
  },
});
