import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from '../theme/colors';

export default function CustomSlider({ value = 35, onChange, label, suffix = '%' }) {
  const handleTouch = (evt) => {
    const { locationX } = evt.nativeEvent;
    // Estimate width as 280
    const trackWidth = 260;
    let newPercentage = Math.round((locationX / trackWidth) * 100);
    newPercentage = Math.max(5, Math.min(95, newPercentage));
    if (onChange) {
      onChange(newPercentage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{value}{suffix}</Text>
      </View>

      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={styles.trackContainer}>
          <View style={styles.trackBackground} />
          <View style={[styles.trackFill, { width: `${value}%` }]} />
          <View style={[styles.thumb, { left: `${value}%` }]} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  valueText: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '800',
  },
  trackContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
  },
  trackBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
  },
  trackFill: {
    height: 6,
    backgroundColor: '#0F6CBD',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F6CBD',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    position: 'absolute',
    marginLeft: -12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
