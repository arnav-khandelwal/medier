import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar, { TabName } from '../components/BottomNavBar';
import HomeScreen from '../screens/main/homeScreen/HomeScreen';
import AppointmentsScreen from '../screens/main/appointmentsScreen/AppointmentsScreen';
import AgendaScreen from '../screens/main/agendaScreen/AgendaScreen';
import MatchScreen from '../screens/main/matchScreen/MatchScreen';
import Drawer from '../components/Drawer/Drawer';

const SCREENS: Record<TabName, React.ComponentType<any>> = {
  Home: HomeScreen,
  Appointments: AppointmentsScreen,
  Agenda: AgendaScreen,
  Match: MatchScreen,
  Profile: HomeScreen, // Profile now opens drawer instead of navigating
};

const MainTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const ActiveScreen = SCREENS[activeTab];

  const handleTabPress = (tab: TabName) => {
    if (tab === 'Profile') {
      setDrawerVisible(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <View style={styles.root}>
      {activeTab === 'Home' ? (
        <HomeScreen activeTab={activeTab} onTabPress={handleTabPress} />
      ) : (
        <View style={styles.root}>
          <ActiveScreen activeTab={activeTab} onTabPress={handleTabPress} />
          <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
        </View>
      )}
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default MainTabNavigator;
