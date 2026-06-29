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
  I18nManager,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { pick } from '@react-native-documents/picker';
import LinearGradient from 'react-native-linear-gradient';

import { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { IMAGES } from '../../../theme/images';
import { useTranslation } from '../../../utils/translations/LanguageContext';
import ScreenTitle from '../../../components/ScreenTitle';
import StyledTextInput from '../../../components/StyledTextInput';
import DropdownModal from '../../../components/DropdownModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Data options for dropdowns
const DAYS = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) }));
const YEARS = Array.from({ length: 80 }, (_, i) => {
  const yr = String(2026 - i);
  return { label: yr, value: yr };
});

const profilesList = ['Doctor', 'Nurse', 'Pharmacist', 'Dentist', 'Physiotherapist', 'Lab Technician'];
const specializationsList = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Surgery', 'Internal Medicine', 'Orthopedics', 'Gynecology', 'Radiology'];
const countryCodes = ['+966 (Saudi Arabia)', '+1 (USA)', '+44 (UK)', '+971 (UAE)', '+20 (Egypt)', '+91 (India)'];
const mapToOptions = (arr: string[]) => arr.map(item => ({ label: item, value: item }));

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  // Tabs: 'personal' | 'professional'
  const [activeTab, setActiveTab] = useState<'personal' | 'professional'>('personal');

  // Profile picture
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Personnel Info States (No pre-filled text)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [mobile, setMobile] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Date of Birth Dropdown States
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Gender Selection State
  const [gender, setGender] = useState<'female' | 'male' | 'other' | null>(null);

  // Professional Info States (No pre-filled text)
  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [fees, setFees] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState('');
  const [description, setDescription] = useState('');

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);

  // Open Image Picker
  const handleSelectImage = async () => {
    try {
      const result = await pick({
        type: Platform.OS === 'ios'
          ? ['public.image', 'public.jpeg', 'public.png']
          : ['image/*'],
        allowMultiSelection: false,
      });
      if (result.length > 0 && result[0].uri) {
        setProfileImage(result[0].uri);
      }
    } catch (err: any) {
      if (err?.code === 'OPERATION_CANCELED') {
        return;
      }
      console.error('Image picking error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick profile picture',
      });
    }
  };

  const validateEmail = (emailStr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleUpdateProfile = () => {
    if (activeTab === 'personal') {
      if (!firstName.trim()) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please enter your first name' });
        return;
      }
      if (!lastName.trim()) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please enter your last name' });
        return;
      }
      if (!email.trim()) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please enter your email' });
        return;
      }
      if (!validateEmail(email)) {
        Toast.show({ type: 'error', text1: t('invalidEmail') || 'Invalid Email', text2: 'Please enter a valid email' });
        return;
      }
      if (!mobile.trim()) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please enter your mobile number' });
        return;
      }
      if (!day || !month || !year) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please select your Date of Birth' });
        return;
      }
      if (!gender) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please select your gender' });
        return;
      }
    } else {
      if (!selectedProfile) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please select a profile' });
        return;
      }
      if (!selectedSpecialization) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please select a specialization' });
        return;
      }
      if (!fees.trim()) {
        Toast.show({ type: 'error', text1: t('requiredField') || 'Required Field', text2: 'Please enter fees' });
        return;
      }
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile updated successfully!',
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header Wavy Background */}
      <ImageBackground
        source={IMAGES.firstscreenbg}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <ScreenTitle
            title={t('myProfile') || 'My Profile'}
            onBackPress={() => navigation.goBack()}
          />
        </SafeAreaView>
      </ImageBackground>

      {/* Main Content Area: The white container overlaps behind the image to half of its height */}
      <View style={styles.contentContainer}>
        {/* Profile Picture Overlay */}
        <View style={styles.avatarContainer}>
          <View style={styles.imageOutline}>
            <Image
              source={profileImage ? { uri: profileImage } : IMAGES.profilePlaceHolder}
              style={styles.avatarImage}
            />
            <TouchableOpacity
              style={styles.avatarEditButton}
              activeOpacity={0.8}
              onPress={handleSelectImage}
            >
              <Image
                source={IMAGES.edit}
                style={styles.avatarEditIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.doctorName}>
            {firstName || lastName ? `Dr. ${firstName} ${lastName}` : 'Dr. William Jhonon'}
          </Text>
        </View>

        {/* Toggle Tabs */}
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'personal' ? styles.tabButtonActive : styles.tabButtonInactive]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.tabText, activeTab === 'personal' ? styles.tabTextActive : styles.tabTextInactive]}>
              Personnel Info.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'professional' ? styles.tabButtonActive : styles.tabButtonInactive]}
            activeOpacity={0.8}
            onPress={() => setActiveTab('professional')}
          >
            <Text style={[styles.tabText, activeTab === 'professional' ? styles.tabTextActive : styles.tabTextInactive]}>
              Professional Info.
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {activeTab === 'personal' ? (
            <View>
              {/* First Name */}
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>First Name</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <StyledTextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter First Name"
                iconUnselected={IMAGES.usernameUnselected}
                iconSelected={IMAGES.usernameSelected}
              />

              {/* Last Name */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <StyledTextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter Last Name"
                iconUnselected={IMAGES.usernameUnselected}
                iconSelected={IMAGES.usernameSelected}
              />

              {/* Email */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Email</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <StyledTextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter Email"
                iconUnselected={IMAGES.emailUnselected}
                iconSelected={IMAGES.emailSelected}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Mobile No */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Moblie No.</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
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
                    <Image source={IMAGES.dropdown} style={styles.dropdownIcon} />
                  </TouchableOpacity>

                  <View style={styles.divider} />
                  <Image source={IMAGES.mobileUnselected} style={styles.inputIcon} />
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
                      const numericText = text.replace(/[^0-9]/g, '');
                      setMobile(numericText);
                    }}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Date of Birth */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <View style={styles.dobContainer}>
                <TouchableOpacity
                  style={styles.dobDropdown}
                  activeOpacity={0.8}
                  onPress={() => setShowDayDropdown(true)}
                >
                  <Text style={[styles.dobText, !day && styles.placeholderText]}>{day || 'Day'}</Text>
                  <Image source={IMAGES.dropdown} style={styles.dobArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dobDropdown}
                  activeOpacity={0.8}
                  onPress={() => setShowMonthDropdown(true)}
                >
                  <Text style={[styles.dobText, !month && styles.placeholderText]}>{month || 'Month'}</Text>
                  <Image source={IMAGES.dropdown} style={styles.dobArrow} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dobDropdown}
                  activeOpacity={0.8}
                  onPress={() => setShowYearDropdown(true)}
                >
                  <Text style={[styles.dobText, !year && styles.placeholderText]}>{year || 'Year'}</Text>
                  <Image source={IMAGES.dropdown} style={styles.dobArrow} />
                </TouchableOpacity>
              </View>

              {/* Select Gender */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Select Gender</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.genderButton, gender === 'female' ? styles.genderButtonSelected : styles.genderButtonUnselected]}
                  onPress={() => setGender('female')}
                >
                  <Image source={IMAGES.female} style={styles.genderIcon} resizeMode="contain" />
                  <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.genderButton, gender === 'male' ? styles.genderButtonSelected : styles.genderButtonUnselected]}
                  onPress={() => setGender('male')}
                >
                  <Image source={IMAGES.male} style={styles.genderIcon} resizeMode="contain" />
                  <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.genderButton, gender === 'other' ? styles.genderButtonSelected : styles.genderButtonUnselected]}
                  onPress={() => setGender('other')}
                >
                  <Text style={styles.genderEmoji}>✨</Text>
                  <Text style={[styles.genderText, gender === 'other' && styles.genderTextSelected]}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* Select Profile */}
              <Text style={styles.inputLabel}>Select Profile</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.dropdownWrapper, { marginTop: verticalScale(8) }]}
                onPress={() => setShowProfileDropdown(true)}
              >
                <Image
                  source={selectedProfile ? IMAGES.usernameSelected : IMAGES.usernameUnselected}
                  style={styles.dropdownLeftIcon}
                />
                <Text style={[styles.dropdownValueText, !selectedProfile && styles.dropdownPlaceholderText]}>
                  {selectedProfile || 'Select'}
                </Text>
                <Image source={IMAGES.dropdown} style={styles.dropdownRightIcon} />
              </TouchableOpacity>

              {/* Specialization */}
              <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Specialization</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.dropdownWrapper, { marginTop: verticalScale(8) }]}
                onPress={() => setShowSpecializationDropdown(true)}
              >
                <Image
                  source={selectedSpecialization ? IMAGES.doctorSpecialisationSelected : IMAGES.doctorSpecialisationUnselected}
                  style={styles.dropdownLeftIcon}
                />
                <Text style={[styles.dropdownValueText, !selectedSpecialization && styles.dropdownPlaceholderText]}>
                  {selectedSpecialization || 'Dermatology'}
                </Text>
                <Image source={IMAGES.dropdown} style={styles.dropdownRightIcon} />
              </TouchableOpacity>

              {/* Fees */}
              <View style={[styles.labelContainer, { marginTop: verticalScale(20) }]}>
                <Text style={styles.inputLabel}>Fees</Text>
                <Image source={IMAGES.editIcon} style={styles.labelEditIcon} />
              </View>
              <StyledTextInput
                value={fees}
                onChangeText={setFees}
                placeholder="$50"
                iconUnselected={IMAGES.usernameUnselected}
                iconSelected={IMAGES.usernameSelected}
                keyboardType="numeric"
              />

              {/* Years of Experience */}
              <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Years of Experience</Text>
              <View style={[styles.plainInputWrapper, { marginTop: verticalScale(8) }]}>
                <TextInput
                  style={[
                    styles.plainTextInput,
                    {
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                    }
                  ]}
                  placeholder="4 Years"
                  placeholderTextColor="#7a7676"
                  value={experience}
                  onChangeText={setExperience}
                />
              </View>

              {/* Languages Known */}
              <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Languages Known</Text>
              <View style={[styles.plainInputWrapper, { marginTop: verticalScale(8) }]}>
                <TextInput
                  style={[
                    styles.plainTextInput,
                    {
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                    }
                  ]}
                  placeholder="English"
                  placeholderTextColor="#7a7676"
                  value={languages}
                  onChangeText={setLanguages}
                />
              </View>

              {/* Profile Description */}
              <Text style={[styles.inputLabel, { marginTop: verticalScale(20) }]}>Profile Description</Text>
              <View style={[styles.descriptionInputWrapper, { marginTop: verticalScale(8) }]}>
                <TextInput
                  style={[
                    styles.descriptionTextInput,
                    {
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                    }
                  ]}
                  multiline
                  numberOfLines={4}
                  placeholder="I am Doctor"
                  placeholderTextColor="#7a7676"
                  value={description}
                  onChangeText={setDescription}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}

          {/* Update Profile Button */}
          <TouchableOpacity style={styles.updateButton} activeOpacity={0.8} onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>

          {/* Extra padding to prevent bottom clipping */}
          <View style={{ height: verticalScale(40) }} />
        </ScrollView>
      </View>

      {/* Dropdowns */}
      <DropdownModal
        visible={showCountryDropdown}
        onClose={() => setShowCountryDropdown(false)}
        title={t('selectCountryCode') || 'Select Country Code'}
        options={mapToOptions(countryCodes)}
        others={false}
        validationType="countryCode"
        onSelect={(opt) => setCountryCode(opt.value.split(' ')[0])}
      />

      <DropdownModal
        visible={showDayDropdown}
        onClose={() => setShowDayDropdown(false)}
        title="Select Day"
        options={DAYS}
        showSearch={false}
        onSelect={(opt) => setDay(opt.value)}
      />

      <DropdownModal
        visible={showMonthDropdown}
        onClose={() => setShowMonthDropdown(false)}
        title="Select Month"
        options={MONTHS}
        showSearch={false}
        onSelect={(opt) => setMonth(opt.value)}
      />

      <DropdownModal
        visible={showYearDropdown}
        onClose={() => setShowYearDropdown(false)}
        title="Select Year"
        options={YEARS}
        showSearch={true}
        onSelect={(opt) => setYear(opt.value)}
      />

      <DropdownModal
        visible={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        title="Select Profile"
        options={mapToOptions(profilesList)}
        showSearch={false}
        onSelect={(opt) => setSelectedProfile(opt.value)}
      />

      <DropdownModal
        visible={showSpecializationDropdown}
        onClose={() => setShowSpecializationDropdown(false)}
        title="Select Specialization"
        options={mapToOptions(specializationsList)}
        showSearch={true}
        onSelect={(opt) => setSelectedSpecialization(opt.value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    height: verticalScale(140),
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -scale(55), // White container overlaps behind the image to half of its height
    marginBottom: verticalScale(15),
    zIndex: 10,
  },
  imageOutline: {
    position: 'relative',
  },
  avatarImage: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(55),
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: scale(2),
    right: scale(2),
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarEditIcon: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  doctorName: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.bold,
    color: '#0E1726',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: scale(36),
    borderTopRightRadius: scale(36),
    backgroundColor: '#FFFFFF',
    marginTop: verticalScale(-20),
    paddingHorizontal: scale(20),
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FC',
    borderRadius: scale(24),
    padding: scale(6),
    marginBottom: verticalScale(15),
  },
  tabButton: {
    flex: 1,
    paddingVertical: verticalScale(10),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#4A5568',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.bold,
    color: '#0E1726',
  },
  labelEditIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    tintColor: '#0E1726',
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
  mobilePrefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagPlaceholder: {
    marginRight: scale(4),
  },
  prefixText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#0E1726',
    marginRight: scale(4),
  },
  dropdownIcon: {
    width: scale(10),
    height: scale(10),
    resizeMode: 'contain',
    tintColor: '#4A5568',
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: scale(10),
  },
  inputIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginRight: scale(10),
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0E1726',
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  dobDropdown: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(14),
  },
  dobText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.regular,
    color: '#0E1726',
  },
  placeholderText: {
    color: '#7a7676',
  },
  dobArrow: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    tintColor: '#4A5568',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: scale(16),
    borderWidth: 1,
  },
  genderButtonSelected: {
    backgroundColor: '#E1F3FF',
    borderColor: colors.primary,
  },
  genderButtonUnselected: {
    backgroundColor: '#F7FAFC',
    borderColor: '#E2E8F0',
  },
  genderIcon: {
    width: scale(18),
    height: scale(18),
    marginRight: scale(6),
  },
  genderEmoji: {
    fontSize: moderateScale(14),
    marginRight: scale(6),
  },
  genderText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#4A5568',
  },
  genderTextSelected: {
    color: colors.primary,
  },
  dropdownWrapper: {
    height: verticalScale(56),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
  },
  dropdownLeftIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginRight: scale(12),
  },
  dropdownValueText: {
    flex: 1,
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
    color: '#0E1726',
  },
  dropdownPlaceholderText: {
    color: '#7a7676',
  },
  dropdownRightIcon: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    tintColor: '#4A5568',
  },
  plainInputWrapper: {
    height: verticalScale(56),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(15),
  },
  plainTextInput: {
    flex: 1,
    height: '100%',
    color: '#0E1726',
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
  },
  descriptionInputWrapper: {
    minHeight: verticalScale(100),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
  },
  descriptionTextInput: {
    flex: 1,
    color: '#0E1726',
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(16),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(30),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.bold,
  },
});

export default ProfileScreen;
