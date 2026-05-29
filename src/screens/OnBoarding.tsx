import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import {
  scale,
  verticalScale,
  moderateScale,
  screenWidth,
  topOffset,
} from '../theme/scaling';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OnBoarding'>;

function OnBoarding({ navigation }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/background/firstscreenbg.png')}
        style={styles.background}>

        <TouchableOpacity onPress={() => navigation.navigate('LanguageSelection')} style={styles.iconButton}>
          <Image
            source={require('../../assets/icons/language.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <Image
          source={require('../../assets/objects/manshakinghand.png')}
          style={styles.doctorImage}
        />

        <View style={styles.bottomContainer}>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationActive} />
            <View style={styles.paginationInactive} />
          </View>

          <View style={styles.contentWrapper}>
            <Text style={styles.title}>MEDIER</Text>
            <Text style={styles.subtitle}>
              Become a Doctor, For a Healthier Future
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login To Your Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    position: 'absolute',
    top: topOffset,
    right: scale(20),
    zIndex: 10,
  },
  icon: {
    width: scale(40),
    height: scale(40),
    resizeMode: 'contain',
  },
  doctorImage: {
    position: 'absolute',
    bottom: verticalScale(350),
    alignSelf: 'center',
    width: screenWidth * 0.88,
    height: verticalScale(420),
    resizeMode: 'contain',
    zIndex: 1,
  },
  bottomContainer: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: scale(36),
    borderTopRightRadius: scale(36),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(38),
    alignItems: 'center',
    minHeight: verticalScale(380),
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  paginationActive: {
    width: scale(24),
    height: verticalScale(6),
    borderRadius: scale(3),
    backgroundColor: colors.pagerActive,
    marginHorizontal: scale(3),
  },
  paginationInactive: {
    width: scale(6),
    height: verticalScale(6),
    borderRadius: scale(3),
    backgroundColor: colors.pagerInactive,
    marginHorizontal: scale(3),
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(34),
    color: colors.textPrimary,
    marginBottom: verticalScale(14),
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(26),
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: moderateScale(42),
    letterSpacing: scale(0.25),
    paddingHorizontal: scale(10),
  },
  buttonContainer: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(11),
    paddingVertical: verticalScale(16),
    width: '100%',
    alignItems: 'center',
    marginBottom: verticalScale(14),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(13),
    color: colors.textLight,
    lineHeight: moderateScale(20),
    letterSpacing: scale(0.75),
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: colors.secondary,
    borderRadius: scale(11),
    paddingVertical: verticalScale(16),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderPrimary,
  },
  registerButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(13),
    color: colors.textPrimary,
    lineHeight: moderateScale(20),
    letterSpacing: scale(0.75),
    textAlign: 'center',
  },
});

export default OnBoarding;
