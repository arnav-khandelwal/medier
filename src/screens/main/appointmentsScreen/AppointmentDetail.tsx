import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  I18nManager,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import ScreenTitle from '../../../components/ScreenTitle';
import { useTranslation } from '../../../utils/translations/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetail'>;

const AppointmentDetail: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const [questionsExpanded, setQuestionsExpanded] = useState(true);
  const [prescriptionExpanded, setPrescriptionExpanded] = useState(true);

  // Fallback to static mock data if no route params are passed
  const appointment = route.params?.appointment || {
    name: 'Sara Williams',
    doctorId: 'ID001212',
    photo: require('../../../../assets/objects/personInAppointments.png'),
    day: 'Today',
    time: '16:00 PM',
    location: '1233 Central Ave, Lake Stati...',
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={require('../../../../assets/background/firstscreenbg.png')}
        style={styles.backgroundImage}
      />

      <View style={styles.container}>
        {/* Header using ScreenTitle */}
        <ScreenTitle
          title={t('appointmentsDetail')}
          onBackPress={() => navigation.goBack()}
        />

        {/* White Container */}
        <View style={styles.whiteContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            
            {/* User details card */}
            <View style={styles.detailsCard}>
              <Image source={appointment.photo} style={styles.doctorPhoto} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appointment.name}</Text>
                <Text style={styles.doctorId}>{appointment.doctorId}</Text>
                <Text style={styles.dateTime}>
                  {appointment.day} | {appointment.time}
                </Text>
                {appointment.location ? (
                  <View style={styles.locationContainer}>
                    <Image
                      source={require('../../../../assets/icons/location.png')}
                      style={styles.locationIcon}
                    />
                    <Text numberOfLines={1} style={styles.locationText}>
                      {appointment.location}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Questions Section */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.accordionHeader}
              onPress={() => setQuestionsExpanded(!questionsExpanded)}
            >
              <Text style={styles.accordionTitle}>
                {t('questions')}
              </Text>
              <Image
                source={require('../../../../assets/icons/expand.png')}
                style={[styles.arrowIcon, { transform: [{ rotate: questionsExpanded ? '180deg' : '0deg' }] }]}
              />
            </TouchableOpacity>

            {questionsExpanded && (
              <View style={styles.questionsList}>
                {/* Question 1 */}
                <View style={styles.questionCard}>
                  <View style={styles.questionRow}>
                    <View style={styles.numberBox}>
                      <Text style={styles.numberText}>1</Text>
                    </View>
                    <Text style={styles.questionText}>
                      {t('whatsTheNameOfMy')}
                    </Text>
                  </View>
                  <Text style={styles.answerText}>
                    {t('headache')}
                  </Text>
                </View>

                {/* Question 2 */}
                <View style={styles.questionCard}>
                  <View style={styles.questionRow}>
                    <View style={styles.numberBox}>
                      <Text style={styles.numberText}>2</Text>
                    </View>
                    <Text style={styles.questionText}>
                      {t('howManyStepsYouWalk')}
                    </Text>
                  </View>
                  <Text style={styles.answerText}>
                    {t('10000')}
                  </Text>
                </View>

                {/* Question 3 */}
                <View style={styles.questionCard}>
                  <View style={styles.questionRow}>
                    <View style={styles.numberBox}>
                      <Text style={styles.numberText}>3</Text>
                    </View>
                    <Text style={styles.questionText}>
                      {t('whenDidYouDoneYour')}
                    </Text>
                  </View>
                  <Text style={styles.answerText}>
                    {t('6Months')}
                  </Text>
                </View>
              </View>
            )}

            {/* Prescription Section */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.accordionHeader}
              onPress={() => setPrescriptionExpanded(!prescriptionExpanded)}
            >
              <Text style={styles.accordionTitle}>
                {t('prescription')}
              </Text>
              <Image
                source={require('../../../../assets/icons/expand.png')}
                style={[styles.arrowIcon, { transform: [{ rotate: prescriptionExpanded ? '180deg' : '0deg' }] }]}
              />
            </TouchableOpacity>

            {prescriptionExpanded && (
              <View style={styles.prescriptionContainer}>
                <View style={styles.pdfIcon}>
                  <Text style={styles.pdfText}>PDF</Text>
                </View>
                <Text style={styles.prescriptionName} numberOfLines={1}>
                  Prescription.pdf
                </Text>
                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
                  <Image
                    source={require('../../../../assets/icons/download.png')}
                    style={styles.downloadIconImage}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.consultButton}
                activeOpacity={0.8}
                onPress={() => console.log('Start Consultation')}
              >
                <Text style={styles.consultButtonText}>
                  {t('startConsultation')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: verticalScale(40) }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(200),
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(34),
    borderTopRightRadius: scale(34),
    paddingTop: verticalScale(24),
    paddingLeft: Platform.OS === 'ios' ? I18nManager.isRTL ? scale(16) : 0 : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    marginBottom: verticalScale(20),
  },
  doctorPhoto: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(12),
    resizeMode: 'cover',
  },
  doctorInfo: {
    flex: 1,
    marginStart: scale(16),
  },
  doctorName: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.bold,
    color: colors.textDark,
    marginBottom: verticalScale(4),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  doctorId: {
    fontSize: moderateScale(12),
    color: colors.textMuted,
    fontFamily: quicksandFonts.regular,
    marginBottom: verticalScale(4),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  dateTime: {
    fontSize: moderateScale(12),
    color: colors.textDark,
    fontFamily: quicksandFonts.regular,
    marginBottom: verticalScale(6),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    marginEnd: scale(6),
  },
  locationText: {
    fontSize: moderateScale(12),
    color: colors.textMuted,
    fontFamily: quicksandFonts.regular,
    flex: 1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  accordionTitle: {
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.bold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  arrowIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
  },
  questionsList: {
    gap: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: '#EAF1F9',
    padding: scale(12),
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  numberBox: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    backgroundColor: '#E1F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: scale(12),
  },
  numberText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.bold,
    color: '#0099FF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  questionText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  answerText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.bold,
    color: '#0099FF',
    marginStart: scale(44),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  prescriptionContainer: {
    backgroundColor: '#EBF7FF',
    borderRadius: scale(12),
    padding: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    marginBottom: verticalScale(16),
  },
  pdfIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    backgroundColor: '#D92121',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: scale(12),
  },
  pdfText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontFamily: quicksandFonts.bold,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  prescriptionName: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  downloadButton: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(8),
    backgroundColor: '#0099FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIconImage: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
    marginTop: verticalScale(10),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFEBEB',
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#FF4C4C',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  consultButton: {
    flex: 1.2,
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  consultButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.bold,
    color: '#FFFFFF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});

export default AppointmentDetail;
