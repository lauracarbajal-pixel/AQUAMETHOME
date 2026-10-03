import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, LinearGradient, Stop, Defs, Mask } from 'react-native-svg';

export default function TinacoGraphic({ levelPercentage = 72, capacityLitros = 1100 }) {
  const currentLitros = Math.round((levelPercentage / 100) * capacityLitros);

  // Height of water container in SVG coordinates
  const tankTopY = 40;
  const tankBottomY = 220;
  const tankHeight = tankBottomY - tankTopY; // 180 units
  
  // Calculate water y position from bottom
  const waterHeight = (levelPercentage / 100) * tankHeight;
  const waterTopY = tankBottomY - waterHeight;

  return (
    <View style={styles.container}>
      <View style={styles.graphicWrapper}>
        <Svg width={180} height={250} viewBox="0 0 180 250">
          <Defs>
            {/* Water gradient */}
            <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <Stop offset="30%" stopColor="#7DD3FC" stopOpacity="0.95" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
            </LinearGradient>

            {/* Tank shell outline path for clip mask */}
            <Mask id="tankMask">
              <Path
                d="M 40 40 
                   L 140 40 
                   L 165 80 
                   L 165 200 
                   L 140 220 
                   L 40 220 
                   L 15 200 
                   L 15 80 
                   Z"
                fill="#FFFFFF"
              />
            </Mask>
          </Defs>

          {/* Background tank interior */}
          <Path
            d="M 40 40 L 140 40 L 165 80 L 165 200 L 140 220 L 40 220 L 15 200 L 15 80 Z"
            fill="#F1F5F9"
          />

          {/* Water Fill Layer */}
          <Rect
            x="0"
            y={waterTopY}
            width="180"
            height={waterHeight + 20}
            fill="url(#waterGrad)"
            mask="url(#tankMask)"
          />

          {/* Water Top Surface Wave line */}
          <Path
            d={`M 15 ${waterTopY} Q 90 ${waterTopY - 4} 165 ${waterTopY}`}
            stroke="#93C5FD"
            strokeWidth="3"
            fill="none"
            mask="url(#tankMask)"
          />

          {/* Tank Horizontal Ribs / Grooves */}
          <Path d="M 15 90 L 165 90" stroke="#1E3A8A" strokeWidth="2" opacity={0.3} />
          <Path d="M 15 130 L 165 130" stroke="#1E3A8A" strokeWidth="2" opacity={0.3} />
          <Path d="M 15 170 L 165 170" stroke="#1E3A8A" strokeWidth="2" opacity={0.3} />

          {/* Tank Outer Border Shape */}
          <Path
            d="M 40 40 
               L 140 40 
               L 165 80 
               L 165 200 
               L 140 220 
               L 40 220 
               L 15 200 
               L 15 80 
               Z"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="4"
          />

          {/* Tank Top Cap Structure */}
          <Rect x="55" y="22" width="70" height="18" rx="5" fill="#334155" stroke="#1E3A8A" strokeWidth="3" />
          <Rect x="65" y="16" width="50" height="8" rx="3" fill="#475569" stroke="#1E3A8A" strokeWidth="2" />

          {/* Tank Bottom Stand */}
          <Path d="M 50 220 L 130 220 L 125 230 L 55 230 Z" fill="#334155" stroke="#1E3A8A" strokeWidth="2" />
        </Svg>
      </View>

      {/* Level Info Side Section */}
      <View style={styles.infoSection}>
        <Text style={styles.labelText}>Nivel Actual:</Text>
        <Text style={styles.percentageText}>{levelPercentage}%</Text>
        <Text style={styles.subLabelText}>Litros:</Text>
        <Text style={styles.litrosText}>{currentLitros}L / {capacityLitros}L</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  graphicWrapper: {
    marginRight: 15,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 2,
  },
  subLabelText: {
    fontSize: 15,
    color: '#475569',
    marginTop: 6,
    fontWeight: '500',
  },
  litrosText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
});
