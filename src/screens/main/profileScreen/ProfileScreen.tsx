import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { DrawerItem } from './DrawerItem';

export interface DrawerItemProps {
  icon: any;
  label: string;
  onPress?: () => void;
}

const ProfileScreen: React.FC = () => {
  const drawerItems = [
    { icon: require('../../../../assets/icons/drawer/myAccount.png'), label: 'My Account' },
    { icon: require('../../../../assets/icons/drawer/myLocation.png'), label: 'My Location' },
    { icon: require('../../../../assets/icons/drawer/myRating.png'), label: 'My Rating' },
    { icon: require('../../../../assets/icons/drawer/myContract.png'), label: 'My Contract' },
    { icon: require('../../../../assets/icons/drawer/payments.png'), label: 'Payments' },
    { icon: require('../../../../assets/icons/drawer/Notifications.png'), label: 'Notification' },
    { icon: require('../../../../assets/icons/drawer/language.png'), label: 'Language' },
    { icon: require('../../../../assets/icons/drawer/myQuestions.png'), label: 'My Questions' },
    { icon: require('../../../../assets/icons/drawer/setAccess.png'), label: 'Set Access' },
    { icon: require('../../../../assets/icons/drawer/Security.png'), label: 'Security' },
    { icon: require('../../../../assets/icons/drawer/about.png'), label: 'About' },
    { icon: require('../../../../assets/icons/drawer/mySubscription.png'), label: 'My Subscription' },
    { icon: require('../../../../assets/icons/drawer/myExpertise.png'), label: 'My Expertise' },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FFFFFF', '#E5EFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        <View style={styles.contentContainer}>
          {/* Left Half - Drawer Content */}
          <ScrollView style={styles.leftHalf} showsVerticalScrollIndicator={false}>
            {/* Drawer Items */}
            <View style={styles.drawerContainer}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={require('../../../../assets/objects/profilePlaceHolder.png')}
                    style={styles.profileImage}
                  />
                  {/* Edit Button */}
                  <TouchableOpacity style={styles.editButton}>
                    <Image
                      source={require('../../../../assets/icons/drawer/edit.png')}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                  {/* Decorative circles */}
                  <View style={[styles.decorativeCircle, { width: scale(13.73), height: scale(13.08), top: scale(-12), left: scale(-8) }]} />
                  <View style={[styles.decorativeCircle, { width: scale(7.19), height: scale(7.19), top: scale(60.65), left: scale(-5) }]} />
                  <View style={[styles.decorativeCircle, { width: scale(8.5), height: scale(8.5), top: scale(12), left: scale(73.96) }]} />
                  <View style={[styles.decorativeCircle, { width: scale(3.27), height: scale(3.27), top: scale(27.37), left: scale(83.87) }]} />
                </View>
                <Text style={styles.profileName}>Dr. William Jhonon</Text>
              </View>
              {drawerItems.map((item, index) => (
                <DrawerItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton}>
              <Image
                source={require('../../../../assets/icons/drawer/logout.png')}
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Right Half - Right Drawer Image */}
          <View style={styles.rightHalf}>
            <Image
              source={require('../../../../assets/objects/rightDrawerImage.png')}
              style={styles.rightDrawerImage}
            />
            {/* Bottom Right Blur */}
            <Image
              source={require('../../../../assets/objects/bottomRightBlur.png')}
              style={styles.bottomRightBlur}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftHalf: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    height: '85%',
  },
  rightHalf: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: verticalScale(12),
    marginLeft: scale(10),
  },
  profileImage: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    borderWidth: 3,
    borderColor: colors.primary,
    resizeMode: 'cover',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: scale(10),
    height: scale(10),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: scale(6),
    backgroundColor: '#0099FF',
    opacity: 1,
    borderWidth: 1,
    borderColor: '#0099FF',
  },
  profileName: {
    fontSize: moderateScale(16),
    color: colors.textDark,
    fontFamily: quicksandFonts.semiBold,
  },
  drawerContainer: {
    padding: scale(12),
    marginBottom: verticalScale(16),
    marginTop: verticalScale(46),
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  iconBackground: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    backgroundColor: '#518CFF0D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  drawerIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  drawerLabel: {
    fontSize: moderateScale(14),
    color: colors.textDark,
    fontFamily: quicksandFonts.semiBold,
  },
  logoutButton: {
    backgroundColor: '#FFDDDB',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  logoutIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
    marginRight: scale(8),
  },
  logoutText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#A30014',
    fontFamily: quicksandFonts.semiBold,
  },
  rightDrawerImage: {
    height: scale(650),
    resizeMode: 'contain',
    marginRight: scale(-30),
  },
  bottomRightBlur: {
    position: 'absolute',
    bottom: scale(-60),
    right: scale(-20),
    width: scale(250),
    height: scale(250),
    resizeMode: 'contain',
  },
});

export default ProfileScreen;
