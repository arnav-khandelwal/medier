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
  Alert,
  Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import { colors } from '../../../theme/colors';
import { quicksandFonts } from '../../../theme/typography';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { RootStackParamList } from '../../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const { width } = Dimensions.get('window');

const profiles = ['Doctor', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist', 'Lab Technician'];
const specializations = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Surgery', 'Internal Medicine', 'Orthopedics', 'Gynecology', 'Radiology'];
const countries = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Egypt', 'Jordan', 'United States', 'United Kingdom'];
const countryCodes = ['+966 (Saudi Arabia)', '+1 (USA)', '+44 (UK)', '+971 (UAE)', '+20 (Egypt)', '+91 (India)'];

function Register({ navigation }: Props): React.JSX.Element {
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
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Focus states
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

  const handlePickCV = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [types.pdf, types.images],
        allowMultiSelection: false,
      });
      if (result.length > 0) {
        setCvFile({
          uri: result[0].uri || '',
          name: result[0].name || 'CV File',
          type: result[0].type || 'application/pdf',
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to pick CV file');
        console.error(err);
      }
    }
  };

  const handlePickLicense = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [types.pdf, types.images],
        allowMultiSelection: false,
      });
      if (result.length > 0) {
        setLicenseFile({
          uri: result[0].uri || '',
          name: result[0].name || 'License File',
          type: result[0].type || 'application/pdf',
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to pick license file');
        console.error(err);
      }
    }
  };

  const handleTabPress = (targetStep: number) => {
    if (targetStep === 2 && !validatePersonnelFields()) {
      Alert.alert('Incomplete Fields', 'Please complete all Personnel fields before proceeding to Professional.');
      return;
    }
    
    setStep(targetStep);
    Animated.timing(slideAnim, {
      toValue: targetStep === 1 ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = () => {
    // Validate Step 1 fields
    if (!firstName.trim()) {
      Alert.alert('Required Field', 'Please enter your First Name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required Field', 'Please enter your Last Name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your Email.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!mobile.trim()) {
      Alert.alert('Required Field', 'Please enter your Mobile Number.');
      return;
    }
    if (!validatePhone(mobile)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required Field', 'Please enter your Password.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (!gender) {
      Alert.alert('Required Field', 'Please select your Gender.');
      return;
    }
    
    // All validations passed, move to step 2
    handleTabPress(2);
  };

  const renderDropdownModal = (
    visible: boolean,
    onClose: () => void,
    options: string[],
    selectedValue: string | null,
    onSelect: (value: string) => void,
    title: string
  ) => {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                  {options.map((option, idx) => {
                    const isSelected = selectedValue === option;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                        onPress={() => {
                          onSelect(option);
                          onClose();
                        }}
                      >
                        <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                          {option}
                        </Text>
                        {isSelected && (
                          <View style={styles.activeCheckContainer}>
                            <Text style={styles.activeCheckText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                  <Text style={styles.titleBlue}>Sign </Text>
                  <Text style={styles.titleBlack}>Up</Text>
                </Text>

                <View style={styles.subtitleRow}>
                  <Text style={styles.subtitleBlack}>Already Have An Account ?  </Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace('Login')}>
                    <Text style={styles.subtitleBlue}>Login</Text>
                  </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => handleTabPress(1)}
                    style={styles.tabActive}
                  >
                    <Text style={styles.tabTextActive}>1. Personnel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={() => handleTabPress(2)}
                    style={step === 2 ? styles.tabActive : styles.tabInactive}
                  >
                    <Text style={step === 2 ? styles.tabTextActive : styles.tabTextInactive}>2. professional</Text>
                  </TouchableOpacity>
                </View>
                <Animated.View style={[styles.tabDividerLine, { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }) }]} />
              </View>

              <Animated.View style={[styles.sliderContainer, { transform: [{ translateX: slideAnim }] }]}>
                {/* Step 1: Personnel */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  style={styles.pageScreen}
                >
                  <View style={styles.formContainer}>
                    {/* First Name */}
                    <Text style={styles.inputLabel}>First Name *</Text>
                    <View style={[styles.gradientWrapper, isFirstNameFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                      {!isFirstNameFocused && (
                        <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      )}
                      <View style={[styles.inputBoxInner, isFirstNameFocused && styles.inputBoxInnerFocused]}>
                        <Image source={isFirstNameFocused ? require('../../../../assets/icons/usernameSelected.png') : require('../../../../assets/icons/usernameUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.textInput, { fontFamily: firstName.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, fontSize: firstName.length > 0 ? moderateScale(15) : moderateScale(12) }]}
                          placeholder="Enter First Name"
                          placeholderTextColor="#7a7676"
                          value={firstName}
                          onChangeText={setFirstName}
                          onFocus={() => setIsFirstNameFocused(true)}
                          onBlur={() => setIsFirstNameFocused(false)}
                        />
                      </View>
                    </View>

                    {/* Last Name */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Last Name *</Text>
                    <View style={[styles.gradientWrapper, isLastNameFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                      {!isLastNameFocused && (
                        <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      )}
                      <View style={[styles.inputBoxInner, isLastNameFocused && styles.inputBoxInnerFocused]}>
                        <Image source={isLastNameFocused ? require('../../../../assets/icons/usernameSelected.png') : require('../../../../assets/icons/usernameUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.textInput, { fontFamily: lastName.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, fontSize: lastName.length > 0 ? moderateScale(15) : moderateScale(12) }]}
                          placeholder="Enter Last Name"
                          placeholderTextColor="#7a7676"
                          value={lastName}
                          onChangeText={setLastName}
                          onFocus={() => setIsLastNameFocused(true)}
                          onBlur={() => setIsLastNameFocused(false)}
                        />
                      </View>
                    </View>

                    {/* Email */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Email *</Text>
                    <View style={[styles.gradientWrapper, isEmailFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                      {!isEmailFocused && (
                        <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      )}
                      <View style={[styles.inputBoxInner, isEmailFocused && styles.inputBoxInnerFocused]}>
                        <Image source={isEmailFocused ? require('../../../../assets/icons/emailSelected.png') : require('../../../../assets/icons/emailUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.textInput, { fontFamily: email.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, fontSize: email.length > 0 ? moderateScale(15) : moderateScale(12) }]}
                          placeholder="Enter Email"
                          placeholderTextColor="#7a7676"
                          value={email}
                          onChangeText={setEmail}
                          onFocus={() => setIsEmailFocused(true)}
                          onBlur={() => setIsEmailFocused(false)}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Mobile No */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Mobile No.</Text>
                    <View style={[styles.gradientWrapper, isMobileFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                      {!isMobileFocused && (
                        <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      )}
                      <View style={[styles.inputBoxInner, isMobileFocused && styles.inputBoxInnerFocused]}>
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
                        <Image source={isMobileFocused ? require('../../../../assets/icons/mobileSelected.png') : require('../../../../assets/icons/mobileUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.textInput, { fontFamily: mobile.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, fontSize: mobile.length > 0 ? moderateScale(15) : moderateScale(12) }]}
                          placeholder="Enter Number"
                          placeholderTextColor="#7a7676"
                          value={mobile}
                          onChangeText={(text) => {
                            // Only allow numbers and limit to 10 digits
                            const numericText = text.replace(/[^0-9]/g, '');
                            if (numericText.length <= 10) {
                              setMobile(numericText);
                            }
                          }}
                          onFocus={() => setIsMobileFocused(true)}
                          onBlur={() => setIsMobileFocused(false)}
                          keyboardType="phone-pad"
                          maxLength={10}
                        />
                      </View>
                    </View>

                    {/* Password */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Password *</Text>
                    <View style={[styles.gradientWrapper, isPasswordFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
                      {!isPasswordFocused && (
                        <LinearGradient colors={['#FFFFFF', '#C6D3E7']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBackground} />
                      )}
                      <View style={[styles.inputBoxInner, isPasswordFocused && styles.inputBoxInnerFocused]}>
                        <Image source={isPasswordFocused ? require('../../../../assets/icons/passwordSelected.png') : require('../../../../assets/icons/passwordUnselected.png')} style={styles.inputIcon} />
                        <TextInput
                          style={[styles.textInput, { fontFamily: password.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light, fontSize: password.length > 0 ? moderateScale(15) : moderateScale(12) }]}
                          placeholder="Enter Password"
                          placeholderTextColor="#7a7676"
                          value={password}
                          onChangeText={setPassword}
                          onFocus={() => setIsPasswordFocused(true)}
                          onBlur={() => setIsPasswordFocused(false)}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Image source={showPassword ? require('../../../../assets/icons/hidePassword.png') : require('../../../../assets/icons/showPassword.png')} style={styles.eyeIcon} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Select Gender */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Select Gender</Text>
                    <View style={styles.genderRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.genderButton, gender === 'female' ? styles.genderButtonSelected : styles.genderButtonUnselected]}
                        onPress={() => setGender('female')}
                      >
                        <Image source={require('../../../../assets/icons/female.png')} style={styles.genderIcon} resizeMode="contain" />
                        <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.genderButton, gender === 'male' ? styles.genderButtonSelected : styles.genderButtonUnselected, { marginLeft: scale(15) }]}
                        onPress={() => setGender('male')}
                      >
                        <Image source={require('../../../../assets/icons/male.png')} style={styles.genderIcon} resizeMode="contain" />
                        <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
                      </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleNext}>
                      <Text style={styles.loginButtonText}>Next</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Render Country Code Modal */}
                  {renderDropdownModal(
                    showCountryDropdown,
                    () => setShowCountryDropdown(false),
                    countryCodes,
                    countryCodes.find(c => c.startsWith(countryCode)) || '+966 (Saudi Arabia)',
                    (val) => setCountryCode(val.split(' ')[0]),
                    'Select Country Code'
                  )}
                </ScrollView>

                {/* Step 2: Professional Fields */}
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  style={styles.pageScreen}
                >
                  <View style={styles.formContainer}>
                    {/* CV Upload */}
                    <Text style={styles.inputLabel}>CV *</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.dashedUploadBox}
                      onPress={handlePickCV}
                    >
                      <Image source={require('../../../../assets/icons/upload.png')} style={styles.uploadIcon} />
                      <Text style={[styles.uploadText, cvFile ? styles.uploadTextSelected : styles.uploadTextPlaceholder]}>
                        {cvFile ? cvFile.name : 'Upload CV'}
                      </Text>
                    </TouchableOpacity>

                    {/* Medical License */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Medical License Document *</Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.dashedUploadBox}
                      onPress={handlePickLicense}
                    >
                      <Image source={require('../../../../assets/icons/upload.png')} style={styles.uploadIcon} />
                      <Text style={[styles.uploadText, licenseFile ? styles.uploadTextSelected : styles.uploadTextPlaceholder]}>
                        {licenseFile ? licenseFile.name : 'Upload'}
                      </Text>
                    </TouchableOpacity>

                    {/* Select Profile */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Select Profile</Text>
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
                        {selectedProfile ? selectedProfile : 'Select'}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Specialization */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Specialization</Text>
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
                        {specialization ? specialization : 'Enter Specialization'}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Select Sector */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Select Sector</Text>
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
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Select Country */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Select Country</Text>
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
                        {selectedCountry ? selectedCountry : 'Select'}
                      </Text>
                      <Image source={require('../../../../assets/icons/dropdown.png')} style={styles.dropdownRightIcon} />
                    </TouchableOpacity>

                    {/* Address */}
                    <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Address</Text>
                    <View style={[styles.addressInputWrapper, isAddressFocused && styles.addressInputWrapperFocused]}>
                      <TextInput
                        style={styles.addressInput}
                        multiline
                        numberOfLines={3}
                        placeholder="Enter Address"
                        placeholderTextColor="#7a7676"
                        value={address}
                        onChangeText={setAddress}
                        onFocus={() => setIsAddressFocused(true)}
                        onBlur={() => setIsAddressFocused(false)}
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
                        I accept{' '}
                        <Text
                          style={styles.termsLink}
                          onPress={(e) => {
                            e.stopPropagation();
                            Alert.alert('Terms & Conditions', 'By registering, you agree to our Terms & Conditions, Privacy Policy, and Cookie Guidelines.');
                          }}
                        >
                          terms & conditions and privacy policy
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
                          Alert.alert('Required Field', 'Please enter your First Name.');
                          return;
                        }
                        if (!lastName.trim()) {
                          Alert.alert('Required Field', 'Please enter your Last Name.');
                          return;
                        }
                        if (!email.trim()) {
                          Alert.alert('Required Field', 'Please enter your Email.');
                          return;
                        }
                        if (!validateEmail(email)) {
                          Alert.alert('Invalid Email', 'Please enter a valid email address.');
                          return;
                        }
                        if (!mobile.trim()) {
                          Alert.alert('Required Field', 'Please enter your Mobile Number.');
                          return;
                        }
                        if (!validatePhone(mobile)) {
                          Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
                          return;
                        }
                        if (!password.trim()) {
                          Alert.alert('Required Field', 'Please enter your Password.');
                          return;
                        }
                        if (!validatePassword(password)) {
                          Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
                          return;
                        }
                        if (!gender) {
                          Alert.alert('Required Field', 'Please select your Gender.');
                          return;
                        }
                        
                        // Validate Step 2 fields
                        if (!cvFile) {
                          Alert.alert('Required Field', 'Please upload your CV.');
                          return;
                        }
                        if (!licenseFile) {
                          Alert.alert('Required Field', 'Please upload your Medical License Document.');
                          return;
                        }
                        if (!selectedProfile) {
                          Alert.alert('Required Field', 'Please select a Profile.');
                          return;
                        }
                        if (!specialization) {
                          Alert.alert('Required Field', 'Please select your Specialization.');
                          return;
                        }
                        if (!selectedCountry) {
                          Alert.alert('Required Field', 'Please select a Country.');
                          return;
                        }
                        if (!address.trim()) {
                          Alert.alert('Required Field', 'Please enter your Address.');
                          return;
                        }
                        if (!acceptedTerms) {
                          Alert.alert('Required Field', 'Please accept the terms & conditions and privacy policy.');
                          return;
                        }
                        
                        // All validations passed
                        Alert.alert('Registration Successful', 'Welcome to Medier!');
                      }}
                    >
                      <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Render Modals */}
                  {renderDropdownModal(
                    showProfileDropdown,
                    () => setShowProfileDropdown(false),
                    profiles,
                    selectedProfile,
                    setSelectedProfile,
                    'Select Profile'
                  )}
                  {renderDropdownModal(
                    showSpecializationDropdown,
                    () => setShowSpecializationDropdown(false),
                    specializations,
                    specialization,
                    setSpecialization,
                    'Select Specialization'
                  )}
                  {renderDropdownModal(
                    showCountrySelectDropdown,
                    () => setShowCountrySelectDropdown(false),
                    countries,
                    selectedCountry,
                    setSelectedCountry,
                    'Select Country'
                  )}
                </ScrollView>
              </Animated.View>

            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
// STYLES TO BE CONTINUED

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingTop: verticalScale(60) },
  // Background images
  swirlTopRight: { position: 'absolute', top: verticalScale(40), right: -scale(0), width: scale(200), height: scale(200), resizeMode: 'contain', zIndex: 0 },
  swirlLeft: { position: 'absolute', top: verticalScale(110), left: scale(5), resizeMode: 'contain', zIndex: 0 },
  swirlMid: { position: 'absolute', top: verticalScale(500), right: -scale(30), width: scale(300), height: scale(300), resizeMode: 'contain', zIndex: 0 },
  blurLeft: { position: 'absolute', bottom: -verticalScale(40), left: -scale(70), width: scale(300), height: scale(300), resizeMode: 'contain', zIndex: 0, opacity: 0.85 },

  headerArea: { paddingHorizontal: scale(16) },
  titleContainer: { marginTop: verticalScale(20), marginBottom: verticalScale(20) },
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
  pageScreen: { width: width, paddingHorizontal: scale(16), paddingTop: verticalScale(20) },
  step2Screen: { justifyContent: 'center', alignItems: 'center' },
  professionalHeading: { fontFamily: quicksandFonts.bold, fontSize: moderateScale(24), color: colors.primary },
  scrollContent: { paddingBottom: verticalScale(40) },

  formContainer: {},
  inputLabel: { fontFamily: quicksandFonts.medium, fontSize: moderateScale(14), color: '#000000', marginBottom: verticalScale(8), lineHeight: moderateScale(14) },
  gradientWrapper: { height: verticalScale(56), borderRadius: scale(16), backgroundColor: '#FFFFFF' },
  shadowUnfocused: { shadowColor: '#C6D3E7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.6, shadowRadius: 8, elevation: 3 },
  shadowFocused: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  gradientBackground: { ...StyleSheet.absoluteFill, borderRadius: scale(16) },
  inputBoxInner: { flexDirection: 'row', alignItems: 'center', borderRadius: scale(15), flex: 1, margin: 1, paddingHorizontal: scale(15), backgroundColor: '#FFFFFF' },
  inputBoxInnerFocused: { margin: 0, borderWidth: 1, borderColor: colors.primary, borderRadius: scale(16) },

  inputIcon: { width: scale(16), height: scale(16), resizeMode: 'contain', marginRight: scale(12) },
  eyeIcon: { width: scale(18), height: scale(18), resizeMode: 'contain', tintColor: '#000000' },
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
  addressInputWrapperFocused: { borderColor: colors.primary },
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
