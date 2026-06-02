import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import BottomNavBar, { TabName } from '../../../components/BottomNavBar';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';

interface HomeScreenProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ activeTab, onTabPress }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ImageBackground
      source={require('../../../../assets/background/firstscreenbg.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={styles.heroSafeArea}>
        <View style={styles.heroContent}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            {/* Dropdown Box */}
            <View style={{ zIndex: 50 }}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setDropdownOpen(!dropdownOpen)}
                style={styles.dropdownBox}
              >
                <Image source={require('../../../../assets/icons/dropdownHome.png')} style={styles.dropdownHomeIcon} />
                <Text style={styles.dropdownText}>NovaCare</Text>
                <Image 
                  source={dropdownOpen ? require('../../../../assets/icons/dropdownUpArrow.png') : require('../../../../assets/icons/dropdownDownArrow.png')} 
                  style={styles.dropdownArrowIcon} 
                />
              </TouchableOpacity>
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => setDropdownOpen(false)}>
                    <Text style={styles.dropdownItem}>Advantal Clinic</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Right Icons */}
              <View style={styles.topRightIcons}>
                <TouchableOpacity style={[styles.iconCircle, { backgroundColor: '#19A3FF' }]}>
                  <Image source={require('../../../../assets/icons/chatTop.png')} style={styles.chatTopIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
                  <Image source={require('../../../../assets/icons/notification.png')} style={styles.notificationIcon} />
                  {/* Notification dot */}
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Greeting */}
            <Text style={styles.greetingHeader}>Hope You're Feeling Well Today!</Text>

            {/* Doctor Text Info */}
            <View style={styles.doctorTextContainer}>
              <Text style={styles.doctorName}>Dr. William{'\n'}Jhonon</Text>
              <View style={styles.specialtyPill}>
                <Text style={styles.specialtyText}>Dentist</Text>
              </View>
            </View>
            
            <Image 
              source={require('../../../../assets/objects/femaleDoctorStock.png')} 
              style={styles.doctorImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        {/* Dashboard Section */}
        <View style={styles.dashboardContainer}>
          <ScrollView contentContainerStyle={styles.dashboardScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>

          <View style={styles.cardsRow}>
            {/* Consultations Card */}
            <View style={[styles.card, { flex: 1.05 }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#E1F3FF' }]}>
                  <Image source={require('../../../../assets/icons/consultations.png')} style={styles.cardIcon} />
                </View>
                <Text style={styles.cardTitle}>Consultations</Text>
              </View>
              <View style={styles.statsBox}>
                <View style={[styles.statColumn, { flex: 0.7 }]}>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statValue}>55</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={[styles.statColumn, { flex: 1.3 }]}>
                  <Text style={styles.statLabel}>Upcoming</Text>
                  <Text style={styles.statValue}>32</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewMoreBtn}>
                <Text style={styles.viewMoreText}>View More</Text>
                <Image source={require('../../../../assets/icons/viewMore.png')} style={styles.viewMoreIcon} />
              </TouchableOpacity>
            </View>

            {/* Chat Card */}
            <View style={[styles.card, { flex: 0.95 }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: '#E1F3FF' }]}>
                  <Image source={require('../../../../assets/icons/chat.png')} style={styles.cardIcon} />
                </View>
                <Text style={styles.cardTitle}>Chat</Text>
              </View>
              <View style={styles.statsBox}>
                <View style={[styles.statColumn, { flex: 0.7 }]}>
                  <Text style={styles.statLabel}>Total</Text>
                  <Text style={styles.statValue}>445</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={[styles.statColumn, { flex: 1.3 }]}>
                  <Text style={styles.statLabel}>New</Text>
                  <Text style={styles.statValue}>12</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewMoreBtn}>
                <Text style={styles.viewMoreText}>View More</Text>
                <Image source={require('../../../../assets/icons/viewMore.png')} style={styles.viewMoreIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Extra spacer at the bottom for BottomNavBar */}
          <View style={{ height: 120 }} />
        </ScrollView>
        <BottomNavBar activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  heroSafeArea: {
    height: '55%',
  },
  heroContent: {
    paddingHorizontal: scale(20),
    flex: 1,
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    zIndex: 10,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19A3FF',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    borderRadius: scale(12),
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    marginTop: verticalScale(4),
    borderRadius: scale(12),
    padding: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(4),
  },
  dropdownItemText: {
    fontSize: moderateScale(15),
    color: '#333',
    fontFamily: quicksandFonts.regular,
  },
  dropdownHomeIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(8),
    resizeMode: 'contain',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.regular,
    marginRight: scale(10),
  },
  dropdownArrowIcon: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  iconCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatTopIcon: {
    width: scale(22),
    height: scale(22),
    resizeMode: 'contain',
  },
  notificationIcon: {
    width: scale(22),
    height: scale(22),
    resizeMode: 'contain',
  },
  notificationDot: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    width: scale(8),
    height: scale(8),
    backgroundColor: '#FF4C4C',
    borderRadius: scale(4),
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  greetingHeader: {
    color: '#FFF',
    fontSize: moderateScale(34),
    fontFamily: quicksandFonts.semiBold,
    marginBottom: verticalScale(44),
    zIndex: 10,
  },
  doctorTextContainer: {
    zIndex: 10,
  },
  doctorName: {
    color: '#FFF',
    fontSize: moderateScale(26),
    fontFamily: quicksandFonts.bold,
    marginBottom: verticalScale(10),
  },
  specialtyPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: scale(20),
    alignSelf: 'flex-start',
  },
  specialtyText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.regular,
  },
  doctorImage: {
    position: 'absolute',
    bottom: verticalScale(-60),
    right: 0,
    width: scale(262),
    zIndex: 5,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: scale(36),
    borderTopRightRadius: scale(36),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
    marginTop: 0,
    zIndex: 10,
  },
  dashboardScroll: {
    paddingTop: verticalScale(22),
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(18),
  },
  dashboardTitle: {
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.semiBold,
    color: '#000',
    marginBottom: verticalScale(12),
    marginLeft: scale(4),
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: scale(24),
    padding: scale(14),
    borderWidth: 1,
    borderColor: '#EAF1F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  cardIconBox: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  cardIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#333',
    flexShrink: 1,
  },
  statsBox: {
    backgroundColor: '#E1F3FF',
    borderRadius: scale(16),
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(8),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statColumn: {
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: scale(6),
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#D6E8FD',
  },
  statLabel: {
    fontSize: moderateScale(10),
    color: '#666',
    marginBottom: verticalScale(4),
    fontFamily: quicksandFonts.semiBold,
  },
  statValue: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#222',
  },
  viewMoreBtn: {
    backgroundColor: colors.primary,
    borderRadius: scale(14),
    paddingVertical: verticalScale(11),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    color: colors.textLight,
    fontSize: moderateScale(13),
    fontFamily: quicksandFonts.regular,
    marginRight: scale(8),
  },
  viewMoreIcon: {
    width: scale(11),
    height: scale(11),
    resizeMode: 'contain',
  },
});

export default HomeScreen;
