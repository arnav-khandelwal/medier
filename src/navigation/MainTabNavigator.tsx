import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar, { TabName } from '../components/BottomNavBar';
import HomeScreen from '../screens/main/HomeScreen';
import AppointmentsScreen from '../screens/main/AppointmentsScreen';
import AgendaScreen from '../screens/main/AgendaScreen';
import MatchScreen from '../screens/main/MatchScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const SCREENS: Record<TabName, React.FC> = {
  Home: HomeScreen,
  Appointments: AppointmentsScreen,
  Agenda: AgendaScreen,
  Match: MatchScreen,
  Profile: ProfileScreen,
};

const MainTabNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const ActiveScreen = SCREENS[activeTab];

  return (
    <View style={styles.root}>
      <ActiveScreen />
      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default MainTabNavigator;
