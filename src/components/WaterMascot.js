import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

export default function WaterMascot({ size = 150 }) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size * 1.1} viewBox="0 0 160 180" fill="none">
        {/* Shadow base */}
        <Ellipse cx="80" cy="170" rx="45" ry="7" fill="#D0E3F7" />

        {/* Feet */}
        <Path d="M52 155 C52 165 65 165 65 155 Z" fill="#0F6CBD" />
        <Path d="M95 155 C95 165 108 165 108 155 Z" fill="#0F6CBD" />

        {/* Body Main Droplet Shape */}
        <Path
          d="M80 15 C80 15 25 75 25 115 C25 145 49 160 80 160 C111 160 135 145 135 115 C135 75 80 15 80 15 Z"
          fill="#38BDF8"
          stroke="#0F6CBD"
          strokeWidth="3.5"
        />

        {/* Inner Highlight */}
        <Path
          d="M42 105 C42 85 70 40 75 35 C72 45 48 85 48 105 C48 122 55 135 60 138 C50 134 42 122 42 105 Z"
          fill="#FFFFFF"
          opacity={0.6}
        />

        {/* Left Arm (resting) */}
        <Path
          d="M32 110 C20 115 16 128 22 132 C28 135 34 122 36 116"
          stroke="#0F6CBD"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Arm (Waving up) */}
        <Path
          d="M126 100 C140 85 148 65 140 60 C135 56 125 75 122 88"
          stroke="#0F6CBD"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Waving Hand Fingers */}
        <Circle cx="140" cy="62" r="4" fill="#0F6CBD" />

        {/* Left Eye */}
        <Circle cx="64" cy="100" r="7" fill="#0F172A" />
        <Circle cx="66" cy="98" r="2.5" fill="#FFFFFF" />

        {/* Right Eye */}
        <Circle cx="96" cy="100" r="7" fill="#0F172A" />
        <Circle cx="98" cy="98" r="2.5" fill="#FFFFFF" />

        {/* Cute Eyebrows */}
        <Path d="M57 90 Q64 86 70 90" stroke="#0F6CBD" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Path d="M90 90 Q96 86 103 90" stroke="#0F6CBD" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Rosy Cheeks */}
        <Ellipse cx="55" cy="110" rx="5" ry="3" fill="#FF8A8A" opacity={0.7} />
        <Ellipse cx="105" cy="110" rx="5" ry="3" fill="#FF8A8A" opacity={0.7} />

        {/* Happy Open Mouth */}
        <Path
          d="M70 112 Q80 128 90 112 Z"
          fill="#0F172A"
        />
        {/* Tongue */}
        <Path
          d="M74 120 Q80 126 86 120 C84 124 76 124 74 120 Z"
          fill="#FF6B81"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});
