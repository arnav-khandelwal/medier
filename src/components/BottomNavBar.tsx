import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { IMAGES } from '../theme/images';

export type TabName = 'Home' | 'Appointments' | 'Agenda' | 'Match' | 'Profile';

interface TabItem {
  name: TabName;
  selectedIcon: any;
  unselectedIcon: any;
}

const TABS: TabItem[] = [
  {
    name: 'Home',
    selectedIcon: IMAGES.homeSelected,
    unselectedIcon: IMAGES.homeUnselected,
  },
  {
    name: 'Appointments',
    selectedIcon: IMAGES.appointmentsSelected,
    unselectedIcon: IMAGES.appointmentsUnselected,
  },
  {
    name: 'Agenda',
    selectedIcon: IMAGES.agendaSelected,
    unselectedIcon: IMAGES.agendaUnselected,
  },
  {
    name: 'Match',
    selectedIcon: IMAGES.matchSelected,
    unselectedIcon: IMAGES.matchUnselected,
  },
  {
    name: 'Profile',
    selectedIcon: IMAGES.profileSelected,
    unselectedIcon: IMAGES.profileUnselected,
  },
];

interface BottomNavBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.name)}
              activeOpacity={0.7}>
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Image
                  source={isActive ? tab.selectedIcon : tab.unselectedIcon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 38 : 26,
    left: 24,
    right: 24,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    // Shadow for Android
    elevation: 12,
    zIndex: 100,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  activeIconWrapper: {
    backgroundColor: `${colors.primary}15`,
    borderRadius: 6,
  },
  icon: {
    width: 48,
    height: 48,
  },
});

export default BottomNavBar;
