import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

export const TABS = [
  { key: 'home', label: 'INICIO', icon: 'home' },
  { key: 'alerts', label: 'ALERTAS', icon: 'bell' },
  { key: 'history', label: 'HISTORIAL', icon: 'history' },
  { key: 'rewards', label: 'RECOMPENSAS', icon: 'gift' },
];

export default function TabBar({ activeTab, onChange }) {
  const insets = useSafeAreaInsets();
  const { alerts } = useApp();
  const badges = { alerts: alerts.filter((a) => a.status !== 'resolved').length };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        const color = active ? COLORS.primary : COLORS.textSecondary;
        const count = badges[tab.key] || 0;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={count ? `${tab.label}, ${count} pendientes` : tab.label}
          >
            {active ? <View style={styles.indicator} /> : null}
            <View>
              <Icon name={tab.icon} color={color} />
              {count > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  indicator: {
    position: 'absolute',
    top: -8,
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -9,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
