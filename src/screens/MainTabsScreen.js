import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import HomeTab from './tabs/HomeTab';
import AlertsTab from './tabs/AlertsTab';
import HistoryTab from './tabs/HistoryTab';
import RewardsTab from './tabs/RewardsTab';
import { COLORS } from '../theme/colors';

const TAB_SCREENS = {
  home: HomeTab,
  alerts: AlertsTab,
  history: HistoryTab,
  rewards: RewardsTab,
};

export default function MainTabsScreen({ activeTab, navigation }) {
  const Screen = TAB_SCREENS[activeTab] || HomeTab;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Screen navigation={navigation} />
      </View>
      <TabBar activeTab={activeTab} onChange={navigation.switchTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
});
