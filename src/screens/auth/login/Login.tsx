import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
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
import StyledTextInput from '../../../components/StyledTextInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function Login({ navigation }: Props): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    // If validation passes, navigate to MainTabs
    navigation.replace('MainTabs');
  };

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
            <Text style={styles.titleBlue}>Login</Text>
            <Text style={styles.titleBlack}> to Your Account</Text>
          </Text>

          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleBlack}>New to Medicine App ?  </Text>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.replace('Register')}
            >
              <Text style={styles.subtitleBlue}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>User Name *</Text>
            <StyledTextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter Username"
              iconUnselected={require('../../../../assets/icons/usernameUnselected.png')}
              iconSelected={require('../../../../assets/icons/usernameSelected.png')}
              autoCapitalize="none"
            />

            <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Password *</Text>
            <StyledTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Password"
              iconUnselected={require('../../../../assets/icons/passwordUnselected.png')}
              iconSelected={require('../../../../assets/icons/passwordSelected.png')}
              secureTextEntry
              showPasswordToggle
            />

            <TouchableOpacity activeOpacity={0.8} style={styles.forgotPasswordButton}  onPress={() => navigation.replace('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forget Password ?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
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
    paddingTop: verticalScale(60), // Add top padding to act as distance from top
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
    marginBottom: verticalScale(20),
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
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  subtitleBlack: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(14),
    color: '#0E1726',
    lineHeight: moderateScale(14),
  },
  subtitleBlue: {
    fontFamily: quicksandFonts.bold,
    fontSize: moderateScale(15),
    color: colors.primary,
    lineHeight: moderateScale(15),
  },

  // Forms
  formContainer: {
    marginBottom: verticalScale(10),
  },
  inputLabel: {
    fontFamily: quicksandFonts.medium,
    fontSize: moderateScale(14),
    color: '#000000',
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(14),
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  forgotPasswordText: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(14),
    color: colors.primary,
  },

  // Actions
  loginButton: {
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
  loginButtonText: {
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
});

export default Login;