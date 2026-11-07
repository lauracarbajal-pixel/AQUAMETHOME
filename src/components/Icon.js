import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Íconos de línea (estilo feather) dibujados con SVG.
export default function Icon({ name, size = 24, color = '#64748B', strokeWidth = 2 }) {
  const p = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  let content = null;
  switch (name) {
    case 'home':
      content = <Path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" {...p} />;
      break;
    case 'bell':
      content = (
        <>
          <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...p} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...p} />
        </>
      );
      break;
    case 'history':
      content = (
        <>
          <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" {...p} />
          <Path d="M3 3v5h5" {...p} />
          <Path d="M12 7v5l3 2" {...p} />
        </>
      );
      break;
    case 'gift':
      content = (
        <>
          <Rect x="3" y="8" width="18" height="4" rx="1" {...p} />
          <Path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" {...p} />
          <Path d="M12 8v13" {...p} />
          <Path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5" {...p} />
          <Path d="M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5" {...p} />
        </>
      );
      break;
    case 'back':
      content = <Path d="M19 12H5M12 19l-7-7 7-7" {...p} />;
      break;
    case 'check':
      content = <Path d="M20 6L9 17l-5-5" {...p} />;
      break;
    case 'chevronDown':
      content = <Path d="M6 9l6 6 6-6" {...p} />;
      break;
    case 'chevronLeft':
      content = <Path d="M15 18l-6-6 6-6" {...p} />;
      break;
    case 'chevronRight':
      content = <Path d="M9 18l6-6-6-6" {...p} />;
      break;
    case 'arrowDown':
      content = <Path d="M12 5v14M19 12l-7 7-7-7" {...p} />;
      break;
    case 'arrowUp':
      content = <Path d="M12 19V5M5 12l7-7 7 7" {...p} />;
      break;
    case 'gear':
      content = (
        <>
          <Circle cx="12" cy="12" r="3" {...p} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            {...p}
          />
        </>
      );
      break;
    case 'lock':
      content = (
        <>
          <Rect x="5" y="11" width="14" height="10" rx="2" {...p} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...p} />
        </>
      );
      break;
    case 'drop':
      content = <Path d="M12 2.7S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.7 12 2.7z" {...p} />;
      break;
    case 'alert':
      content = (
        <>
          <Path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" {...p} />
          <Path d="M12 9v4M12 17h.01" {...p} />
        </>
      );
      break;
    case 'chart':
      content = <Path d="M4 20V10M10 20V4M16 20v-6M22 20H2" {...p} />;
      break;
    case 'hand':
      content = (
        <Path
          d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"
          {...p}
        />
      );
      break;
    case 'trophy':
      content = (
        <>
          <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" {...p} />
          <Path d="M6 3h12v6a6 6 0 0 1-12 0z" {...p} />
          <Path d="M12 15v4M8 21h8" {...p} />
        </>
      );
      break;
    default:
      content = <Circle cx="12" cy="12" r="9" {...p} />;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {content}
    </Svg>
  );
}
