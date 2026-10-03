import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../theme/colors';

export default function AQUAMETLogo({ size = 'large' }) {
  const isSmall = size === 'small';
  
  return (
    <View style={styles.container}>
      {/* Water Droplet SVG Icon */}
      <Svg
        width={isSmall ? 28 : 44}
        height={isSmall ? 36 : 56}
        viewBox="0 0 44 56"
        fill="none"
      >
        <Path
          d="M22 0C22 0 0 24.5 0 37.33C0 47.64 9.85 56 22 56C34.15 56 44 47.64 44 37.33C44 24.5 22 0 22 0Z"
          fill="#1C92FF"
        />
        {/* Inner highlight */}
        <Path
          d="M16 30C16 23 21 15 22 13C23 15 28 23 28 30C28 34.5 25.5 37 22 37C18.5 37 16 34.5 16 30Z"
          fill="#66C2FF"
          opacity={0.8}
        />
      </Svg>

      <Text style={[styles.brandText, isSmall && styles.brandTextSmall]}>
        AQUA<Text style={styles.brandTextHighlight}>MET</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: 10,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0B4D87',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  brandTextSmall: {
    fontSize: 22,
    marginTop: 4,
  },
  brandTextHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
});
