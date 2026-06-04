import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import { useTranslation, languageNameToCode } from '../../../utils/translations/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSelection'>;

interface LanguageOption {
  id: string;
  name: string;
  flag: any;
}

function LanguageSelection({ navigation }: Props): React.JSX.Element {
  const { language, setLanguage, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  useEffect(() => {
    // Map language code back to display name
    const languageMap: Record<string, string> = {
      'en': 'English',
      'fr': 'French',
      'hi': 'Hindi',
      'ur': 'Urdu',
    };
    setSelectedLanguage(languageMap[language] || 'English');
  }, [language]);

  const languages: LanguageOption[] = [
    {
      id: 'English',
      name: t('languageSelection', 'languages.english'),
      flag: require('../../../../assets/icons/English.png'),
    },
    {
      id: 'French',
      name: t('languageSelection', 'languages.french'),
      flag: require('../../../../assets/icons/French.png'),
    },
    {
      id: 'Urdu',
      name: t('languageSelection', 'languages.urdu'),
      flag: require('../../../../assets/icons/Urdu.png'),
    },
    {
      id: 'Hindi',
      name: t('languageSelection', 'languages.hindi'),
      flag: require('../../../../assets/icons/Hindi.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Swirl top-right, partially cut off */}
      <Image
        source={require('../../../../assets/objects/swirlTop.png')}
        style={styles.swirlTop}
      />

      {/* Blur glow bottom-right */}
      <Image
        source={require('../../../../assets/objects/bottomRightBlur.png')}
        style={styles.bottomBlur}
      />

      {/* Swirl bottom-right, partially cut off */}
      <Image
        source={require('../../../../assets/objects/swirlBottom.png')}
        style={styles.swirlBottom}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentScale}>
        {/* Medicine pill — right aligned, pushed to the edge */}
        <View style={styles.pillRow}>
          <Image
            source={require('../../../../assets/objects/medicine.png')}
            style={styles.medicinePill}
          />
        </View>

        {/* Language icon — top left, large, below the pill */}
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../../../assets/icons/languageBlack.png')}
              style={styles.languageIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Screen Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('languageSelection', 'title')}</Text>
        </View>

        {/* Language Cards */}
        <View style={styles.listContainer}>
          {languages.map((item) => {
            const isSelected = selectedLanguage === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedLanguage(item.id);
                  setLanguage(languageNameToCode(item.id));
                }}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}>
                <View style={styles.cardLeft}>
                  <Image source={item.flag} style={styles.flagIcon} />
                  <Text style={styles.languageText}>{item.name}</Text>
                </View>
                <Image
                  source={
                    isSelected
                      ? require('../../../../assets/icons/rightArrowSelected.png')
                      : require('../../../../assets/icons/rightArrowUnselected.png')
                  }
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        </View>

      </SafeAreaView>
    </View>
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
  contentScale: {
    flex: 1,
    transform: [{ scale: 0.9 }],
  },
  swirlTop: {
    position: 'absolute',
    top: verticalScale(0),
    right: -scale(30),
    width: scale(220),
    height: scale(220),
    resizeMode: 'contain',
    zIndex: 0,
  },
  swirlBottom: {
    position: 'absolute',
    bottom: -verticalScale(50),
    right: -scale(10),
    width: scale(260),
    height: scale(260),
    resizeMode: 'contain',
    zIndex: 0,
  },
  bottomBlur: {
    position: 'absolute',
    bottom: -verticalScale(60),
    right: -scale(60),
    width: scale(340),
    height: scale(340),
    resizeMode: 'contain',
    zIndex: 0,
    opacity: 0.85,
  },
  // Medicine pill row — right aligned, pushed to the edge
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: scale(0),
    marginTop: -verticalScale(40),
    zIndex: 5,
  },
  medicinePill: {
    width: scale(120),
    height: scale(196),
    resizeMode: 'contain',
    transform: [{ rotate: '5deg' }],
    marginRight: scale(12),
  },
  // Language icon row — left aligned, below the pill
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(0),
    marginTop: -scale(90),
    marginBottom: verticalScale(4),
    zIndex: 5,
  },
  languageIcon: {
    width: scale(68),
    height: scale(68),
    resizeMode: 'contain',
  },
  titleContainer: {
    paddingHorizontal: scale(2),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(25),
  },
  title: {
    fontFamily: quicksandFonts.bold,
    fontSize: moderateScale(34),
    color: '#0E1726',
    lineHeight: moderateScale(44),
    letterSpacing: -0.3,
  },
  listContainer: {
    paddingHorizontal: scale(4),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: verticalScale(70),
    borderRadius: scale(16),
    paddingHorizontal: scale(8),
    marginBottom: verticalScale(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EDF8FF',
  },
  cardUnselected: {
    borderColor: '#00000033',
    backgroundColor: '#FFFFFF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    resizeMode: 'cover',
    marginRight: scale(16),
  },
  languageText: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(17),
    color: '#1E293B',
  },
  arrowIcon: {
    width: scale(42),
    height: scale(28),
    resizeMode: 'contain',
  },
});

export default LanguageSelection;
