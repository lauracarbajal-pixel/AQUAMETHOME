import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { MEDAL_TIERS } from '../theme/colors';

function Glyph({ icon }) {
  switch (icon) {
    case 'tree':
      return (
        <G>
          <Rect x={10.5} y={13} width={3} height={8} rx={1} fill="#8B5A2B" />
          <Circle cx={12} cy={9} r={7} fill="#3FA34D" />
          <Circle cx={9.5} cy={7.5} r={2} fill="#6CC56F" />
        </G>
      );
    case 'drop':
      return (
        <G>
          <Path d="M12 2S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2 12 2z" fill="#4FA8EE" />
          <Path d="M9 14c0-2 1-4 2-5" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </G>
      );
    case 'star':
      return (
        <Path
          d="M12 2l3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21.1l1.5-7L2 9.3l7-.8z"
          fill="#F5C518"
          stroke="#B7791F"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      );
    case 'leaf':
      return (
        <G>
          <Path d="M12 21V11" stroke="#2F7D35" strokeWidth={2} strokeLinecap="round" />
          <Path d="M12 13C7 13 5 9 5 5c4 0 7 2 7 8z" fill="#46A04C" />
          <Path d="M12 11c0-5 3-7 7-7 0 4-2 7-7 7z" fill="#6CC56F" />
        </G>
      );
    case 'person':
      return (
        <G>
          <Circle cx={12} cy={8} r={4} fill="#3F9E5A" />
          <Path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="#3F9E5A" />
        </G>
      );
    case 'globe':
      return (
        <G>
          <Circle cx={12} cy={12} r={9} fill="#4FA8EE" />
          <Path d="M8 6c2 0 3 2 2 4s-3 1-3 3-2 0-3-2c0-2 2-5 4-5z" fill="#46A04C" />
          <Path d="M15 13c2-1 4 0 4 2s-2 4-4 4c0-2-2-4 0-6z" fill="#46A04C" />
        </G>
      );
    case 'lock':
    default:
      return (
        <G>
          <Rect x={6} y={11} width={12} height={9} rx={2} fill="#94A3B8" />
          <Path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" stroke="#94A3B8" strokeWidth={2.4} fill="none" />
        </G>
      );
  }
}

// Medalla con listones. Si está bloqueada se muestra en gris con candado.
export default function BadgeMedal({ tier = 'bronze', icon = 'drop', locked = false, size = 56 }) {
  const colors = MEDAL_TIERS[locked ? 'locked' : tier] || MEDAL_TIERS.bronze;

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 60 72">
      <Path d="M19 44 L12 70 L22 64 L28 70 L31 48 Z" fill={colors.ribbon} />
      <Path d="M41 44 L48 70 L38 64 L32 70 L29 48 Z" fill={colors.ribbon} />
      <Circle cx={30} cy={28} r={26} fill={colors.ring} stroke={colors.dark} strokeWidth={2} />
      <Circle cx={30} cy={28} r={19} fill={locked ? '#EEF2F6' : '#F8FAFC'} stroke={colors.dark} strokeWidth={1.5} />
      <G transform="translate(19.2 17.2) scale(0.9)">
        <Glyph icon={locked ? 'lock' : icon} />
      </G>
    </Svg>
  );
}
