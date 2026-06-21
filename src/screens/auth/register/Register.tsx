import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Modal,
  Platform,
  I18nManager
} from 'react-native';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../../theme/colors';
import { quicksandFonts } from '../../../theme/typography';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { RootStackParamList } from '../../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { handlePickCV, handlePickLicense } from './handleDocPicker';
import StyledTextInput from '../../../components/StyledTextInput';
import PrivacyPolicyModal from '../PrivacyPolicy/PrivacyPolicyModal';
import TermsAndConditionsModal from '../TermsAndConditions/TermsAndConditionsModal';
import { useTranslation } from '../../../utils/translations/LanguageContext';
import DropdownModal from '../../../components/DropdownModal';
type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const { width } = Dimensions.get('window');

const profiles = ['Doctor', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist', 'Lab Technician'];
const specializations = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Surgery', 'Internal Medicine', 'Orthopedics', 'Gynecology', 'Radiology'];
const countries = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Egypt', 'Jordan', 'United States', 'United Kingdom'];
const countryCodes = ['+966 (Saudi Arabia)', '+1 (USA)', '+44 (UK)', '+971 (UAE)', '+20 (Egypt)', '+91 (India)'];

function Register({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<'female' | 'male' | null>(null);

  // Step 2 Form States
  const [cvFile, setCvFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [licenseFile, setLicenseFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [sector, setSector] = useState<'Private' | 'Public' | 'Both'>('Private');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showCountrySelectDropdown, setShowCountrySelectDropdown] = useState(false);
  const [address, setAddress] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);

  const [step, setStep] = useState(1);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Calculate progress based on filled fields in Personnel step
  const calculatePersonnelProgress = (): number => {
    const fields = [firstName, lastName, email, mobile, password, gender];
    const filledFields = fields.filter(field => field !== null && field !== '' && field !== undefined).length;
    return filledFields / fields.length;
  };

  // Calculate progress based on filled fields in Professional step
  const calculateProfessionalProgress = (): number => {
    const fields = [cvFile, licenseFile, selectedProfile, specialization, selectedCountry, address, acceptedTerms];
    const filledFields = fields.filter(field => field !== null && field !== '' && field !== undefined).length;
    return filledFields / fields.length;
  };

  const personnelProgress = calculatePersonnelProgress();
  const professionalProgress = calculateProfessionalProgress();

  // Calculate total progress: Personnel takes first 50%, Professional takes second 50%
  const totalProgress = (personnelProgress * 0.5) + (professionalProgress * 0.5);

  // Animate progress bar smoothly
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: totalProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [totalProgress]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validatePersonnelFields = (): boolean => {
    if (!firstName.trim()) return false;
    if (!lastName.trim()) return false;
    if (!email.trim()) return false;
    if (!validateEmail(email)) return false;
    if (!mobile.trim()) return false;
    if (!validatePhone(mobile)) return false;
    if (!password.trim()) return false;
    if (!validatePassword(password)) return false;
    if (!gender) return false;
    return true;
  };



  const handleTabPress = (targetStep: number) => {
    if (targetStep === 2 && !validatePersonnelFields()) {
      Toast.show({
        type: 'error',
        text1: t('incompleteFields'),
        text2: t('pleaseCompleteAllPersonnelFields'),
      });
      return;
    }

    setStep(targetStep);
    Animated.timing(slideAnim, {
      toValue: targetStep === 1 ? 0 : (I18nManager.isRTL ? width : -width),
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    // Validate Step 1 fields
    if (!firstName.trim()) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseEnterYourFirstName'),
      });
      return;
    }
    if (!lastName.trim()) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseEnterYourLastName'),
      });
      return;
    }
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseEnterYourEmail'),
      });
      return;
    }
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: t('invalidEmail'),
        text2: t('pleaseEnterAValidEmail'),
      });
      return;
    }
    if (!mobile.trim()) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseEnterYourMobileNumber'),
      });
      return;
    }
    if (!validatePhone(mobile)) {
      Toast.show({
        type: 'error',
        text1: t('invalidPhone'),
        text2: t('pleaseEnterAValid10digit'),
      });
      return;
    }
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseEnterYourPassword'),
      });
      return;
    }
    if (!validatePassword(password)) {
      Toast.show({
        type: 'error',
        text1: t('weakPassword'),
        text2: t('passwordMustBeAtLeast'),
      });
      return;
    }
    if (!gender) {
      Toast.show({
        type: 'error',
        text1: t('requiredField'),
        text2: t('pleaseSelectYourGender'),
      });
      return;
    }

    // All validations passed, move to step 2
    handleTabPress(2);
  };



  // Helper to map string arrays to option objects
  const mapToOptions = (arr: string[]) => arr.map(item => ({ label: item, value: item }));

  // State for selected location in HomeScreen
  // Add this near other state declarations in HomeScreen component
  // const [selectedLocation, setSelectedLocation] = useState('');

  // Remove renderDropdownModal function and replace its calls with DropdownModal component


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

          {/* Background Elements (copied from Login) */}
          <Image source={require('../../../../assets/objects/swirlTop.png')} style={styles.swirlTopRight} />
          <Image source={require('../../../../assets/objects/swirlTopBlack.png')} style={styles.swirlLeft} />
          <Image source={require('../../../../assets/objects/swirlMid.png')} style={styles.swirlMid} />
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>

              {/* Header texts */}
              <View style={styles.headerArea}>
                <Text style={styles.titleContainer}>
                  <Text style={styles.titleBlue}>{t('sign')}</Text>
                  <Text style={styles.titleBlack}>{t('up')}</Text>
                </Text>

                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitleBlack}>{t('alreadyHaveAnAccount')}</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace('Login')}>
                    <Text style={styles.subtitleBlue}>{t('login')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleTabPress(1)}
                    style={styles.tabActive}
                  >
                    <Text style={styles.tabTextActive}>{t('1Personnel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleTabPress(2)}
                    style={step === 2 ? styles.tabActive : styles.tabInactive}
                  >
                    <Text style={step === 2 ? styles.tabTextActive : styles.tabTextInactive}>{t('2Professional')}</Text>
                  </TouchableOpacity>
                </View>
                <Animated.View style={[styles.tabDividerLine, {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }]} />
              </View>

              <Animated.View style={[styles.sliderContainer, { transform: [{ translateX: slideAnim }] }]}>
                {/* Step 1: Personnel */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  style={styles.pageScreen}
                  nestedScrollEnabled={true}
                >
                  <View style={styles.formContainer}>
                    {/* First Name */}
                    <Text style={styles.inputLabel}>{t('firstName')}</Text>
                    <StyledTextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder={t('enterFirstName')}
                      iconUnselected={require('../../../../assets/icons/usernameUnselected.png')}
                      iconSelected={require('../../../../assets/icons/usernameSelected.png')}
                    />

                    {/* Last Name */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('lastName')}</Text>
                    <StyledTextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder={t('enterLastName')}
                      iconUnselected={require('../../../../assets/icons/usernameUnselected.png')}
                      iconSelected={require('../../../../assets/icons/usernameSelected.png')}
                    />

                    {/* Email */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('email')}</Text>
                    <StyledTextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder={t('enterEmail')}
                      iconUnselected={require('../../../../assets/icons/emailUnselected.png')}
                      iconSelected={require('../../../../assets/icons/emailSelected.png')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    {/* Mobile No */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('mobileNo')}</Text>
                    <View style={[styles.gradientWrapper, styles.shadowUnfocused]}>
                      <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      <View style={styles.inputBoxInner}>
                        <TouchableOpacity style={styles.mobilePrefixContainer} onPress={() => setShowCountryDropdown(!showCountryDropdown)}>
                          <View style={styles.flagPlaceholder}>
                            <Text style={{ fontSize: moderateScale(12) }}>
                              {countryCode === '+966' ? '🇸🇦' :
                                countryCode === '+1' ? '🇺🇸' :
                                  countryCode === '+44' ? '🇬🇧' :
                                    countryCode === '+971' ? '🇦🇪' :
                                      countryCode === '+20' ? '🇪🇬' :
                                        countryCode === '+91' ? '🇮🇳' : ''}
                            </Text>
                          </View>
                          <Text style={styles.prefixText}>{countryCode}</Text>
                          <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownIcon} />
                        </TouchableOpacity>

                        <View style={styles.divider} />
                        <Image source={require('../../../../assets/icons/mobileUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[
                            styles.textInput,
                            {
                              fontFamily: mobile.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light,
                              fontSize: mobile.length > 0 ? moderateScale(15) : moderateScale(12),
                              textAlign: I18nManager.isRTL ? 'right' : 'left',
                              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                            }
                          ]}
                          placeholder={t('enterNumber')}
                          placeholderTextColor="#7a7676"
                          value={mobile}
                          onChangeText={(text: string) => {
                            // Only allow numbers and limit to 10 digits
                            const numericText = text.replace(/[^0-9]/g, '');
                            if (numericText.length <= 10) {
                              setMobile(numericText);
                            }
                          }}
                          keyboardType="phone-pad"
                          maxLength={10}
                          textContentType="telephoneNumber"
                        />
                      </View>
                    </View>

                    {/* Password */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('password1')}</Text>
                    <StyledTextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder={t('enterPassword')}
                      iconUnselected={require('../../../../assets/icons/passwordUnselected.png')}
                      iconSelected={require('../../../../assets/icons/passwordSelected.png')}
                      secureTextEntry
                      showPasswordToggle
                    />

                    {/* Select Gender */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('selectGender')}</Text>
                    <View style={styles.genderRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.genderButton, gender === 'female' ? styles.genderButtonSelected : styles.genderButtonUnselected]}
                        onPress={() => setGender('female')}
                      >
                        <Image source={require('../../../../assets/icons/female.png')} style={styles.genderIcon} resizeMode="contain" />
                        <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>{t('female')}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.genderButton, gender === 'male' ? styles.genderButtonSelected : styles.genderButtonUnselected, { marginLeft: scale(15) }]}
                        onPress={() => setGender('male')}
                      >
                        <Image source={require('../../../../assets/icons/male.png')} style={styles.genderIcon} resizeMode="contain" />
                        <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>{t('male')}</Text>
                      </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleNext}>
                      <Text style={styles.loginButtonText}>{t('next')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Render Country Code Modal */}
                  <DropdownModal
                    visible={showCountryDropdown}
                    onClose={() => setShowCountryDropdown(false)}
                    title={t('selectCountryCode')}
                    options={mapToOptions(countryCodes)}
                    onSelect={(opt) => {
                      setCountryCode(opt.value.split(' ')[0]);
                    }}
                  />
                </ScrollView>

                {/* Step 2: Professional Fields */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  style={styles.pageScreen}
                  nestedScrollEnabled={true}
                >
                  <View style={styles.formContainer}>
                    {/* CV Upload */}
                    <Text style={styles.inputLabel}>{t('cv')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.dashedUploadBox}
                      onPress={() => handlePickCV(setCvFile)}
                    >
                      <Image source={require('../../../../assets/icons/upload.png')} style={styles.uploadIcon} />
                      <Text style={[styles.uploadText, cvFile ? styles.uploadTextSelected : styles.uploadTextPlaceholder]}>
                        {cvFile ? cvFile.name : t('uploadCv')}
                      </Text>
                    </TouchableOpacity>

                    {/* Medical License */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('medicalLicenseDocument')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.dashedUploadBox}
                      onPress={() => handlePickLicense(setLicenseFile)}
                    >
                      <Image source={require('../../../../assets/icons/upload.png')} style={styles.uploadIcon} />
                      <Text style={[styles.uploadText, licenseFile ? styles.uploadTextSelected : styles.uploadTextPlaceholder]}>
                        {licenseFile ? licenseFile.name : t('upload')}
                      </Text>
                    </TouchableOpacity>

                    {/* Select Profile */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('selectProfile')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.dropdownWrapper,
                        showProfileDropdown && styles.dropdownWrapperFocused
                      ]}
                      onPress={() => setShowProfileDropdown(true)}
                    >
                      <Image
                        source={selectedProfile ? require('../../../../assets/icons/usernameSelected.png') : require('../../../../assets/icons/usernameUnselected.png')}
                        style={styles.dropdownLeftIcon}
                      />
                      <Text style={[
                        styles.dropdownValueText,
                        !selectedProfile && styles.dropdownPlaceholderText
                      ]}>
                        {selectedProfile ? selectedProfile : t('select')}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Specialization */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('specialization')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.dropdownWrapper,
                        showSpecializationDropdown && styles.dropdownWrapperFocused
                      ]}
                      onPress={() => setShowSpecializationDropdown(true)}
                    >
                      <Image
                        source={specialization ? require('../../../../assets/icons/doctorSpecialisationSelected.png') : require('../../../../assets/icons/doctorSpecialisationUnselected.png')}
                        style={styles.dropdownLeftIcon}
                      />
                      <Text style={[
                        styles.dropdownValueText,
                        !specialization && styles.dropdownPlaceholderText
                      ]}>
                        {specialization ? specialization : t('enterSpecialization')}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Select Sector */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('selectSector')}</Text>
                    <View style={styles.sectorRow}>
                      {(['Private', 'Public', 'Both'] as const).map((option) => {
                        const isSelected = sector === option;
                        return (
                          <TouchableOpacity
                            key={option}
                            activeOpacity={0.8}
                            style={[
                              styles.sectorButton,
                              isSelected ? styles.sectorButtonSelected : styles.sectorButtonUnselected
                            ]}
                            onPress={() => setSector(option)}
                          >
                            <Image
                              source={require('../../../../assets/icons/doctorSector.png')}
                              style={[
                                styles.sectorIcon,
                                isSelected ? styles.sectorIconSelected : styles.sectorIconUnselected
                              ]}
                            />
                            <Text style={[
                              styles.sectorText,
                              isSelected && styles.sectorTextSelected
                            ]}>
                              {t(option.toLowerCase())}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Select Country */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('selectCountry')}</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.dropdownWrapper,
                        showCountrySelectDropdown && styles.dropdownWrapperFocused
                      ]}
                      onPress={() => setShowCountrySelectDropdown(true)}
                    >
                      <Image
                        source={selectedCountry ? require('../../../../assets/icons/countrySelectSelected.png') : require('../../../../assets/icons/countrySelectUnselected.png')}
                        style={styles.dropdownLeftIcon}
                      />
                      <Text style={[
                        styles.dropdownValueText,
                        !selectedCountry && styles.dropdownPlaceholderText
                      ]}>
                        {selectedCountry ? selectedCountry : t('select')}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Address */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>{t('address')}</Text>
                    <View style={[styles.addressInputWrapper]}>
                      <TextInput
                        style={[
                          styles.addressInput,
                          {
                            textAlign: I18nManager.isRTL ? 'right' : 'left',
                            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                          }
                        ]}
                        multiline
                        numberOfLines={3}
                        placeholder={t('enterAddress')}
                        placeholderTextColor="#7a7676"
                        value={address}
                        onChangeText={setAddress}
                        textAlignVertical="top"
                      />
                    </View>

                    {/* Terms Checkbox */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.termsContainer}
                      onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                      <Image
                        source={
                          acceptedTerms
                            ? require('../../../../assets/icons/checkboxTermsCondSelected.png')
                            : require('../../../../assets/icons/checkboxTermsCondUnselected.png')
                        }
                        style={styles.checkboxIcon}
                      />
                      <Text style={styles.termsText}>
                        {t('iAccept')}
                        <Text
                          style={styles.termsLink}
                          onPress={(e) => {
                            e.stopPropagation();
                            setShowTermsAndConditions(true);
                          }}
                        >
                          {t('termsConditions1')}
                        </Text>
                        {t('and')}
                        <Text
                          style={styles.termsLink}
                          onPress={(e) => {
                            e.stopPropagation();
                            setShowPrivacyPolicy(true);
                          }}
                        >
                          {t('privacyPolicy')}
                        </Text>
                      </Text>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                      style={styles.signUpButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        // Validate Step 1 fields again (in case user went back)
                        if (!firstName.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourFirstName'),
                          });
                          return;
                        }
                        if (!lastName.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourLastName'),
                          });
                          return;
                        }
                        if (!email.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourEmail'),
                          });
                          return;
                        }
                        if (!validateEmail(email)) {
                          Toast.show({
                            type: 'error',
                            text1: t('invalidEmail'),
                            text2: t('pleaseEnterAValidEmail'),
                          });
                          return;
                        }
                        if (!mobile.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourMobileNumber'),
                          });
                          return;
                        }
                        if (!validatePhone(mobile)) {
                          Toast.show({
                            type: 'error',
                            text1: t('invalidPhone'),
                            text2: t('pleaseEnterAValid10digit'),
                          });
                          return;
                        }
                        if (!password.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourPassword'),
                          });
                          return;
                        }
                        if (!validatePassword(password)) {
                          Toast.show({
                            type: 'error',
                            text1: t('weakPassword'),
                            text2: t('passwordMustBeAtLeast'),
                          });
                          return;
                        }
                        if (!gender) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseSelectYourGender'),
                          });
                          return;
                        }

                        // Validate Step 2 fields
                        if (!cvFile) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseUploadYourCv'),
                          });
                          return;
                        }
                        if (!licenseFile) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseUploadYourMedicalLicense'),
                          });
                          return;
                        }
                        if (!selectedProfile) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseSelectAProfile'),
                          });
                          return;
                        }
                        if (!specialization) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseSelectYourSpecialization'),
                          });
                          return;
                        }
                        if (!selectedCountry) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseSelectACountry'),
                          });
                          return;
                        }
                        if (!address.trim()) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseEnterYourAddress'),
                          });
                          return;
                        }
                        if (!acceptedTerms) {
                          Toast.show({
                            type: 'error',
                            text1: t('requiredField'),
                            text2: t('pleaseAcceptTheTermsConditions'),
                          });
                          return;
                        }

                        // All validations passed
                        Toast.show({
                          type: 'success',
                          text1: t('registrationSuccessful'),
                          text2: t('welcomeToMedier'),
                        });
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'MainTabs' }],
                        });
                      }}
                    >
                      <Text style={styles.signUpButtonText}>{t('signUp')}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Render Modals */}
                  <DropdownModal
                    visible={showProfileDropdown}
                    onClose={() => setShowProfileDropdown(false)}
                    title={t('selectProfile')}
                    options={mapToOptions(profiles)}
                    onSelect={(opt) => setSelectedProfile(opt.value)}
                  />
                  <DropdownModal
                    visible={showSpecializationDropdown}
                    onClose={() => setShowSpecializationDropdown(false)}
                    title={t('selectSpecialization')}
                    options={mapToOptions(specializations)}
                    onSelect={(opt) => setSpecialization(opt.value)}
                  />
                  <DropdownModal
                    visible={showCountrySelectDropdown}
                    onClose={() => setShowCountrySelectDropdown(false)}
                    title={t('selectCountry')}
                    options={mapToOptions(countries)}
                    onSelect={(opt) => setSelectedCountry(opt.value)}
                  />
                </ScrollView>
              </Animated.View>

            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>

      {/* Modals */}
      <PrivacyPolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
      <TermsAndConditionsModal
        visible={showTermsAndConditions}
        onClose={() => setShowTermsAndConditions(false)}
      />
    </KeyboardAvoidingView>
  );
}
// STYLES TO BE CONTINUED

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: Platform.OS === 'ios' ? scale(10) : 0 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingTop: verticalScale(60) },
  // Background images
  swirlTopRight: { position: 'absolute', top: verticalScale(40), right: -scale(0), width: scale(200), height: scale(200), resizeMode: 'contain', zIndex: 0 },
  swirlLeft: { position: 'absolute', top: verticalScale(110), left: scale(5), resizeMode: 'contain', zIndex: 0 },
  swirlMid: { position: 'absolute', top: verticalScale(500), right: -scale(30), width: scale(300), height: scale(300), resizeMode: 'contain', zIndex: 0 },
  blurLeft: { position: 'absolute', bottom: -verticalScale(40), left: -scale(70), width: scale(300), height: scale(300), resizeMode: 'contain', zIndex: 0, opacity: 0.85 },

  headerArea: { paddingHorizontal: scale(16) },
  titleContainer: { marginTop: verticalScale(20), marginBottom: verticalScale(20), writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' },
  titleBlue: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(29), color: colors.primary, lineHeight: moderateScale(36) },
  titleBlack: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(29), color: '#0E1726', lineHeight: moderateScale(36) },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(20) },
  subtitleBlack: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(14), color: '#0E1726', lineHeight: moderateScale(14) },
  subtitleBlue: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(15), color: colors.primary, lineHeight: moderateScale(15) },

  tabsContainer: { flexDirection: 'row', marginTop: verticalScale(10) },
  tabActive: { marginRight: scale(30), alignItems: 'center', width: '50%' },
  tabTextActive: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(15), color: colors.primary, paddingBottom: verticalScale(8) },
  tabInactive: { alignItems: 'center', width: '50%' },
  tabTextInactive: { fontFamily: quicksandFonts.medium, fontSize: moderateScale(15), color: '#7a7676', paddingBottom: verticalScale(8) },
  tabDividerLine: { height: 2, backgroundColor: colors.primary, marginTop: verticalScale(8), width: '0%' },

  sliderContainer: { flex: 1, flexDirection: 'row', width: width * 2 },
  pageScreen: { width: width, paddingHorizontal: scale(16), paddingTop: verticalScale(20), flex: 1 },
  step2Screen: { justifyContent: 'center', alignItems: 'center' },
  professionalHeading: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(24), color: colors.primary },
  scrollContent: { paddingBottom: verticalScale(40) },

  formContainer: {},
  inputLabel: { fontFamily: quicksandFonts.medium, fontSize: moderateScale(14), color: '#000000', marginBottom: verticalScale(8), lineHeight: moderateScale(14), writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr', marginRight: I18nManager.isRTL ? scale(44) : 0 },
  gradientWrapper: { height: verticalScale(56), borderRadius: scale(16), backgroundColor: '#FFFFFF' },
  shadowUnfocused: { shadowColor: '#C6D3E7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 8, elevation: 3 },
  shadowFocused: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  gradientBackground: { ...StyleSheet.absoluteFill, borderRadius: scale(16) },
  inputBoxInner: { flexDirection: 'row', alignItems: 'center', borderRadius: scale(15), flex: 1, margin: 1, paddingHorizontal: scale(15), backgroundColor: '#FFFFFF' },

  inputIcon: { width: scale(16), height: scale(16), resizeMode: 'contain', marginRight: scale(12) },
  textInput: { flex: 1, height: '100%', color: '#0E1726' },

  mobilePrefixContainer: { flexDirection: 'row', alignItems: 'center', marginRight: scale(8) },
  flagPlaceholder: { width: scale(20), height: scale(20), borderRadius: scale(10), backgroundColor: '#006C35', justifyContent: 'center', alignItems: 'center', marginRight: scale(4) },
  prefixText: { fontFamily: quicksandFonts.medium, fontSize: moderateScale(14), color: '#0E1726', marginRight: scale(4) },
  chevronDown: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(12), color: '#0E1726', marginLeft: scale(2) },
  divider: { width: 1, height: '50%', backgroundColor: '#635f5f', marginRight: scale(12) },

  genderRow: { flexDirection: 'row', alignItems: 'center' },
  genderButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: scale(121), height: verticalScale(48), borderRadius: scale(24) },
  genderButtonSelected: { backgroundColor: '#CEEBFF' },
  genderButtonUnselected: { backgroundColor: '#F1F1F1' },
  genderIcon: { width: scale(20), height: scale(20), marginRight: scale(8) },
  genderText: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(14) },
  genderTextSelected: { color: '#0E1726' },

  loginButton: { backgroundColor: colors.primary, borderRadius: scale(16), height: verticalScale(56), justifyContent: 'center', alignItems: 'center', width: '100%', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, marginTop: verticalScale(30) },
  loginButtonText: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(16), color: '#FFFFFF' },

  // Dynamic tab active full underline style
  tabDividerLineActive: { width: '100%', height: 2, backgroundColor: colors.primary, marginTop: -1 },

  // Step 2 Upload / Dropdown styles
  dropdownIcon: { width: scale(10), height: scale(10), resizeMode: 'contain', marginLeft: scale(4) },
  dashedUploadBox: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#A0AEC0', borderRadius: scale(16), height: verticalScale(56), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  uploadIcon: { width: scale(20), height: scale(20), resizeMode: 'contain', marginRight: scale(10), tintColor: '#4A5568' },
  uploadText: { fontSize: moderateScale(14) },
  uploadTextPlaceholder: { fontFamily: quicksandFonts.light, color: '#7a7676' },
  uploadTextSelected: { fontFamily: quicksandFonts.semiBold, color: '#0E1726' },

  dropdownWrapper: { height: verticalScale(56), borderWidth: 1, borderColor: '#E2E8F0', borderRadius: scale(16), flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(15), backgroundColor: '#FFFFFF' },
  dropdownWrapperFocused: { borderColor: colors.primary },
  dropdownLeftIcon: { width: scale(18), height: scale(18), resizeMode: 'contain', marginRight: scale(12) },
  dropdownRightIcon: { width: scale(12), height: scale(12), resizeMode: 'contain', marginLeft: 'auto', tintColor: '#7a7676' },
  dropdownValueText: { flex: 1, fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(14), color: '#0E1726' },
  dropdownPlaceholderText: { fontFamily: quicksandFonts.light, fontSize: moderateScale(12), color: '#7a7676' },

  sectorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: -scale(5) },
  sectorButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: verticalScale(48), borderRadius: scale(24), marginHorizontal: scale(5) },
  sectorButtonSelected: { backgroundColor: '#CEEBFF', borderWidth: 1, borderColor: colors.primary },
  sectorButtonUnselected: { backgroundColor: '#F1F1F1' },
  sectorIcon: { width: scale(18), height: scale(18), marginRight: scale(6), resizeMode: 'contain' },
  sectorIconSelected: { tintColor: '#0E1726' },
  sectorIconUnselected: { tintColor: '#7a7676' },
  sectorText: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(11), color: '#7a7676' },
  sectorTextSelected: { color: '#0E1726' },

  addressInputWrapper: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: scale(16), paddingHorizontal: scale(15), paddingVertical: scale(10), backgroundColor: '#FFFFFF', minHeight: verticalScale(100) },
  addressInput: { flex: 1, fontFamily: quicksandFonts.regular, fontSize: moderateScale(14), color: '#0E1726', textAlignVertical: 'top' },

  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(20), paddingHorizontal: scale(4) },
  checkboxIcon: { width: scale(22), height: scale(22), resizeMode: 'contain', marginRight: scale(10) },
  termsText: { flex: 1, fontFamily: quicksandFonts.medium, fontSize: moderateScale(12), color: '#0E1726', lineHeight: moderateScale(16) },
  termsLink: { color: colors.primary, fontFamily: quicksandFonts.bold },

  signUpButton: { backgroundColor: colors.primary, borderRadius: scale(16), height: verticalScale(56), justifyContent: 'center', alignItems: 'center', width: '100%', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, marginTop: verticalScale(30) },
  signUpButtonText: { fontFamily: quicksandFonts.semiBold, fontSize: moderateScale(16), color: '#FFFFFF' },

  // Dropdown selector modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: scale(24), borderTopRightRadius: scale(24), maxHeight: '75%', paddingBottom: verticalScale(20) },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(20), paddingVertical: scale(16), borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(18), color: '#0E1726' },
  modalCloseButton: { padding: scale(4) },
  modalCloseText: { fontSize: moderateScale(18), color: '#7a7676', fontFamily: quicksandFonts.medium },
  modalScrollView: { paddingHorizontal: scale(20), marginVertical: verticalScale(10) },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: verticalScale(15), borderBottomWidth: 0.5, borderBottomColor: '#F1F5F9' },
  modalItemSelected: { backgroundColor: '#F0F9FF' },
  modalItemText: { fontFamily: quicksandFonts.medium, fontSize: moderateScale(15), color: '#4A5568' },
  modalItemTextSelected: { color: colors.primary, fontFamily: quicksandFonts.bold },
  activeCheckContainer: { width: scale(20), height: scale(20), borderRadius: scale(10), backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  activeCheckText: { color: '#FFFFFF', fontSize: moderateScale(12), fontWeight: 'bold' },
});

export default Register;
