import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Animated,
  Easing,
  I18nManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../theme/scaling';
import { quicksandFonts } from '../../theme/typography';
import { DrawerItem } from './DrawerItem';
import { useTranslation } from '../../utils/translations/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { IMAGES } from '../../theme/images';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const isRTL = I18nManager.isRTL;
  const slideAnim = useRef(new Animated.Value(isRTL ? screenWidth * 0.75 : -screenWidth * 0.75)).current;
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(isRTL ? screenWidth * 0.75 : -screenWidth * 0.75);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: isRTL ? screenWidth * 0.75 : -screenWidth * 0.75,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim, screenWidth, isRTL]);

  const drawerItems = [
    { icon: IMAGES.myAccount, label: t('myAccount'), onPress: onClose },
    { icon: IMAGES.myLocation, label: t('myLocation'), onPress: onClose },
    { icon: IMAGES.myRating, label: t('myRating'), onPress: onClose },
    { icon: IMAGES.myContract, label: t('myContract'), onPress: onClose },
    { icon: IMAGES.payments, label: t('payments'), onPress: onClose },
    { icon: IMAGES.Notifications, label: t('notification'), onPress: onClose },
    { icon: IMAGES.language, label: t('language'), onPress: () => { navigation.navigate('LanguageSelection'); onClose(); } },
    { icon: IMAGES.myQuestions, label: t('myQuestions'), onPress: onClose },
    { icon: IMAGES.setAccess, label: t('setAccess'), onPress: onClose },
    { icon: IMAGES.Security, label: t('security'), onPress: onClose },
    { icon: IMAGES.about, label: t('about'), onPress: onClose },
    { icon: IMAGES.mySubscription, label: t('mySubscription'), onPress: onClose },
    { icon: IMAGES.myExpertise, label: t('myExpertise'), onPress: onClose },
  ];

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.drawerContainer,
            { width: screenWidth * 0.75, transform: [{ translateX: slideAnim }] }
          ]}
          onStartShouldSetResponder={() => true}
        >
          <LinearGradient
            colors={['#FFFFFF', '#E5EFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBackground}
          >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Drawer Items */}
              <View style={styles.drawerContainerInner}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={IMAGES.profilePlaceHolder}
                      style={styles.profileImage}
                    />
                    {/* Edit Button */}
                    <TouchableOpacity style={styles.editButton}>
                      <Image
                        source={IMAGES.edit}
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
                    onPress={item.onPress}
                  />
                ))}
              </View>

              {/* Logout Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={() => { navigation.navigate('OnBoarding'); onClose(); }}>
                <Image
                  source={IMAGES.logout}
                  style={styles.logoutIcon}
                />
                <Text style={styles.logoutText}>{t('logout')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  drawerContainer: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  drawerContainerInner: {
    padding: scale(12),
    marginBottom: verticalScale(16),
    marginTop: verticalScale(46),
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
  rightHalf: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: scale(200),
    alignItems: 'flex-end',
    justifyContent: 'center',
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

export default Drawer;
