import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../theme/colors';
import { quicksandFonts } from '../../../theme/typography';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../../theme/scaling';
import { RootStackParamList } from '../../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

function ForgotPassword({ navigation }: Props): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

        {/* Swirl Top Right */}
        <Image
          source={require('../../../../assets/objects/swirlTop.png')}
          style={styles.swirlTopRight}
        />
        {/* Swirl Top Left */}
        <Image
          source={require('../../../../assets/objects/swirlTopBlack.png')}
          style={styles.swirlLeft}
        />
        {/* Swirl Mid */}
        <Image
          source={require('../../../../assets/objects/swirlMid.png')}
          style={styles.swirlMid}
        />
        
        {/* Bottom Left Blur */}
        <Image
          source={require('../../../../assets/objects/bottomLeftBlur.png')}
          style={styles.blurLeft}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Header Texts */}
            <Text style={styles.titleContainer}>
              <Text style={styles.titleBlue}>Forgot</Text>
              <Text style={styles.titleBlack}> Password</Text>
            </Text>

            <Text style={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <View style={[styles.gradientWrapper, isEmailFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                {!isEmailFocused && (
                  <LinearGradient
                    colors={['#FFFFFF', '#C6D3E7']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={styles.gradientBackground}
                  />
                )}
                <View style={[styles.inputBoxInner, isEmailFocused && styles.inputBoxInnerFocused]}>
                  <Image 
                    source={isEmailFocused 
                      ? require('../../../../assets/icons/usernameSelected.png')
                      : require('../../../../assets/icons/usernameUnselected.png')} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      { fontFamily: email.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, 
                        fontSize: email.length > 0 ? moderateScale(15) : moderateScale(12),
                      }
                    ]}
                    placeholder="Enter Email Address"
                    placeholderTextColor="#7a7676"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
            </View>

            {/* Back to Login */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.replace('Login')}
              style={styles.backToLoginButton}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton} 
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(60),
  },
  
  // Background images
  swirlTopRight: {
    position: 'absolute',
    top: verticalScale(40),
    right: -scale(0),
    width: scale(200),
    height: scale(200),
    resizeMode: 'contain',
    zIndex: 0,
  },
  swirlLeft: {
    position: 'absolute',
    top: verticalScale(110),
    left: scale(5),
    resizeMode: 'contain',
    zIndex: 0,
  },
  swirlMid: {
    position: 'absolute',
    top: verticalScale(500),
    right: -scale(30),
    width: scale(300),
    height: scale(300),
    resizeMode: 'contain',
    zIndex: 0,
  },
  blurLeft: {
    position: 'absolute',
    bottom: -verticalScale(40),
    left: -scale(70),
    width: scale(300),
    height: scale(300),
    resizeMode: 'contain',
    zIndex: 0,
    opacity: 0.85,
  },
  
  // Typography
  titleContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  titleBlue: {
    fontFamily: quicksandFonts.bold,
    fontSize: moderateScale(29),
    color: colors.primary,
    lineHeight: moderateScale(36),
  },
  titleBlack: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(29),
    color: '#0E1726',
    lineHeight: moderateScale(36),
  },
  description: {
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
    color: '#666666',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(40),
  },

  // Forms
  formContainer: {
    marginBottom: verticalScale(30),
  },
  inputLabel: {
    fontFamily: quicksandFonts.medium,
    fontSize: moderateScale(14),
    color: '#000000',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(14),
  },
  gradientWrapper: {
    height: verticalScale(56),
    borderRadius: scale(16),
    backgroundColor: '#FFFFFF',
  },
  shadowUnfocused: {
    shadowColor: '#C6D3E7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowFocused: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: scale(16),
  },
  inputBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(15), 
    flex: 1,
    margin: 1,
    paddingHorizontal: scale(15),
    backgroundColor: '#FFFFFF',
  },
  inputBoxInnerFocused: {
    margin: 0,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale(16),
  },
  inputIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginRight: scale(12),
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0E1726',
  },
  backToLoginButton: {
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  backToLoginText: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(14),
    color: colors.primary,
  },

  // Actions
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(16),
    height: verticalScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
});

export default ForgotPassword;
