import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../../theme/colors';

const PAD = { left: 32, right: 6, top: 8, bottom: 22 };

// Barras agrupadas: semana actual vs semana pasada. data: [{ label, current, previous }]
export default function GroupedBarChart({
  data,
  height = 190,
  currentColor = COLORS.chartCurrent,
  previousColor = COLORS.chartPrevious,
}) {
  const [width, setWidth] = useState(0);

  const maxRaw = Math.max(...data.flatMap((d) => [d.current, d.previous]), 1);
  const max = Math.ceil(maxRaw / 20) * 20;
  const ticks = [0, max / 2, max];

  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;
  const groupW = chartW / data.length;
  const barW = Math.min(12, groupW * 0.3);
  const gap = 3;
  const y = (v) => PAD.top + (1 - v / max) * chartH;

  return (
    <View
      style={{ height }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityLabel={`Consumo por día: ${data
        .map((d) => `${d.label} ${d.current} litros esta semana, ${d.previous} la pasada`)
        .join('; ')}`}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          {ticks.map((t) => (
            <G key={t}>
              <Line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={COLORS.borderLight} strokeWidth={1} />
              <SvgText x={PAD.left - 6} y={y(t) + 4} fontSize={10} fill={COLORS.textSecondary} textAnchor="end">
                {String(t)}
              </SvgText>
            </G>
          ))}

          {data.map((d, i) => {
            const center = PAD.left + groupW * i + groupW / 2;
            return (
              <G key={i}>
                <Rect
                  x={center - barW - gap / 2}
                  y={y(d.previous)}
                  width={barW}
                  height={y(0) - y(d.previous)}
                  rx={3}
                  fill={previousColor}
                />
                <Rect
                  x={center + gap / 2}
                  y={y(d.current)}
                  width={barW}
                  height={y(0) - y(d.current)}
                  rx={3}
                  fill={currentColor}
                />
                <SvgText x={center} y={height - 5} fontSize={11} fill={COLORS.textPrimary} textAnchor="middle">
                  {d.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      ) : null}
    </View>
  );
}
