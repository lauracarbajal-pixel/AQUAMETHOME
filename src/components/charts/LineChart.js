import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../../theme/colors';

const PAD = { left: 36, right: 12, top: 10, bottom: 34 };
const TICKS = [0, 25, 50, 75, 100];

// Gráfica de línea para porcentajes (0–100). data: [{ day, month, value }]
export default function LineChart({ data, height = 200, color = COLORS.primary, threshold }) {
  const [width, setWidth] = useState(0);

  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
  const y = (v) => PAD.top + (1 - v / 100) * chartH;

  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)} ${y(d.value)}`).join(' ');
  const area = `${line} L${x(data.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;

  // Con muchos puntos (vista de día o de mes) se muestran menos etiquetas y puntos más chicos
  const maxLabels = Math.max(2, Math.floor(chartW / 34));
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));
  const dotRadius = data.length > 14 ? 3 : 4.5;

  return (
    <View
      style={{ height }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityLabel={`Gráfica de nivel: ${data.map((d) => `${d.day} ${d.month} ${d.value}%`).join(', ')}`}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          {TICKS.map((t) => (
            <G key={t}>
              <Line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={COLORS.borderLight} strokeWidth={1} />
              <SvgText x={PAD.left - 6} y={y(t) + 4} fontSize={10} fill={COLORS.textSecondary} textAnchor="end">
                {`${t}%`}
              </SvgText>
            </G>
          ))}

          {threshold != null ? (
            <Line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={y(threshold)}
              y2={y(threshold)}
              stroke={COLORS.warning}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ) : null}

          <Path d={area} fill={color} fillOpacity={0.12} />
          <Path d={line} stroke={color} strokeWidth={2.5} fill="none" strokeLinejoin="round" />

          {data.map((d, i) => (
            <Circle
              key={`p${i}`}
              cx={x(i)}
              cy={y(d.value)}
              r={dotRadius}
              fill={threshold != null && d.value <= threshold ? COLORS.warning : color}
              stroke={COLORS.white}
              strokeWidth={1.5}
            />
          ))}

          {data.map((d, i) => (i % labelStep !== 0 ? null : (
            <G key={`l${i}`}>
              <SvgText x={x(i)} y={height - 18} fontSize={10} fill={COLORS.textPrimary} textAnchor="middle">
                {d.day}
              </SvgText>
              <SvgText x={x(i)} y={height - 5} fontSize={10} fill={COLORS.textSecondary} textAnchor="middle">
                {d.month}
              </SvgText>
            </G>
          )))}
        </Svg>
      ) : null}
    </View>
  );
}
