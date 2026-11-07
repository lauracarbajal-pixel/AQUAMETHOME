import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { COLORS } from '../theme/colors';

// Barra superior azul. `onBack` es opcional (las pestañas principales no tienen flecha).
export function HeaderWithBack({ title, onBack, right, centered = false }) {
  const insets = useSafeAreaInsets();
  const showSideSlots = centered || right;

  return (
    <View style={[styles.headerBar, { paddingTop: insets.top + 12 }]}>
      {onBack ? (
        <TouchableOpacity
          style={styles.side}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Regresar"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="back" color={COLORS.white} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : showSideSlots ? (
        <View style={styles.side} />
      ) : null}

      <Text style={[styles.headerTitle, centered && styles.centeredTitle]} numberOfLines={1}>
        {title}
      </Text>

      {showSideSlots ? <View style={[styles.side, styles.sideRight]}>{right}</View> : null}
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
    backgroundColor: COLORS.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  side: {
    width: 40,
    height: 34,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  centeredTitle: {
    textAlign: 'center',
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
