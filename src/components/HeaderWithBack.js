import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function HeaderWithBack({ title, onBack }) {
  return (
    <View style={styles.headerBar}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export function ProgressBar({ progress = 0.33 }) {
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: '#0F6CBD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#D1E5F7',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F6CBD',
    borderRadius: 4,
  },
});
