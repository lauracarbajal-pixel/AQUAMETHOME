import React from 'react';
import Svg, { Path, Circle, Rect, G, Text as SvgText } from 'react-native-svg';

const OUTLINE = '#0B4D87';

function WarningTriangle() {
  return (
    <G>
      <Path d="M74 56 L95 93 L53 93 Z" fill="#E53E3E" stroke="#FFFFFF" strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M74 68 V80" stroke="#FFFFFF" strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx={74} cy={87} r={2.6} fill="#FFFFFF" />
    </G>
  );
}

// type: 'leak' | 'lid'.  withWarning agrega el triángulo rojo.
export default function AlertIllustration({ type, size = 96, withWarning }) {
  const showWarning = withWarning ?? type === 'lid';

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {type === 'leak' ? (
        <G>
          <Path
            d="M40 12 C40 12 14 44 14 62 C14 78 26 89 40 89 C54 89 66 78 66 62 C66 44 40 12 40 12 Z"
            fill="#5DB7F5"
            stroke={OUTLINE}
            strokeWidth={3}
          />
          <Path d="M25 62 C25 54 30 46 33 42" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.75} fill="none" />
          <Circle cx={70} cy={24} r={14} fill="#FCD9B6" stroke={OUTLINE} strokeWidth={3} />
          <SvgText x={70} y={31} fontSize={19} fontWeight="bold" fill={OUTLINE} textAnchor="middle">
            ?
          </SvgText>
        </G>
      ) : (
        <G>
          {/* Cuerpo del tinaco */}
          <Path
            d="M16 54 L80 54 L74 88 Q73 92 68 92 L28 92 Q23 92 22 88 Z"
            fill="#7CC3F2"
            stroke={OUTLINE}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <Rect x={12} y={47} width={72} height={9} rx={3} fill="#A9D8F7" stroke={OUTLINE} strokeWidth={3} />
          {/* Tapa levantada */}
          <G transform="rotate(-22 22 44)">
            <Rect x={18} y={30} width={58} height={9} rx={3} fill="#5DB7F5" stroke={OUTLINE} strokeWidth={3} />
            <Rect x={40} y={23} width={14} height={7} rx={2} fill="#5DB7F5" stroke={OUTLINE} strokeWidth={2.5} />
          </G>
        </G>
      )}
      {showWarning ? <WarningTriangle /> : null}
    </Svg>
  );
}
