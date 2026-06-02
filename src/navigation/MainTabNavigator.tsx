import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar, { TabName } from '../components/BottomNavBar';
import HomeScreen from '../screens/main/homeScreen/HomeScreen';
import AppointmentsScreen from '../screens/main/appointmentsScreen/AppointmentsScreen';
import AgendaScreen from '../screens/main/agendaScreen/AgendaScreen';
import MatchScreen from '../screens/main/matchScreen/MatchScreen';
import ProfileScreen from '../screens/main/profileScreen/ProfileScreen';

const SCREENS: Record<TabName, React.ComponentType<any>> = {
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
      {activeTab === 'Home' ? (
        <HomeScreen activeTab={activeTab} onTabPress={setActiveTab} />
      ) : (
        <View style={styles.root}>
          <ActiveScreen activeTab={activeTab} onTabPress={setActiveTab} />
          <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />  
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default MainTabNavigator;
