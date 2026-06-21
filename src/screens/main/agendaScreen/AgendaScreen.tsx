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
  Platform,
  I18nManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import ScreenTitle from '../../../components/ScreenTitle';
import CustomCalendar from '../../../components/CustomCalendar';
import { useTranslation } from '../../../utils/translations/LanguageContext';
import { agendaData, getAgendaDay, isDayBlocked, TimeSlot } from './data/mockData';
import { IMAGES } from '../../../theme/images';

interface AgendaScreenProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

const AgendaScreen: React.FC<AgendaScreenProps> = ({ onTabPress }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<'myAvailability' | 'teamAvailability'>('myAvailability');
  const currentDate = new Date(2026, 5, 12); // June 12, 2026
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // June 2026

  const agendaDay = getAgendaDay(selectedDate);
  const timeSlots = agendaDay?.timeSlots || [];

  const getMarkedDates = () => {
    const dates: any = {};
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      
      if (isDayBlocked(d)) {
        dates[dateString] = { blocked: true };
      }
    }
    
    const selectedY = selectedDate.getFullYear();
    const selectedM = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const selectedD = String(selectedDate.getDate()).padStart(2, '0');
    const selectedDateString = `${selectedY}-${selectedM}-${selectedD}`;
    
    if (dates[selectedDateString]) {
      dates[selectedDateString].selected = true;
    } else {
      dates[selectedDateString] = { selected: true };
    }
    
    return dates;
  };

  const markedDates = getMarkedDates();


  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={IMAGES.firstscreenbg}
        style={styles.backgroundImage}
      />
      
      <View style={styles.container}>
        {/* Header */}
        <ScreenTitle title="My Agenda" onBackPress={() => onTabPress?.('Home')} />

        <View style={styles.whiteContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Tab Bar */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'myAvailability' && styles.tabSelected]}
                onPress={() => setSelectedTab('myAvailability')}
              >
                <Text style={[styles.tabText, selectedTab === 'myAvailability' && styles.tabTextSelected]}>
                  {t('myAvailability')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'teamAvailability' && styles.tabSelected]}
                onPress={() => setSelectedTab('teamAvailability')}
              >
                <Text style={[styles.tabText, selectedTab === 'teamAvailability' && styles.tabTextSelected]}>
                  {t('teamAvailability')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <CustomCalendar
              current={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`}
              markedDates={markedDates}
              onDayPress={(dateData) => {
                const newDate = new Date(dateData.year, dateData.month - 1, dateData.day);
                setSelectedDate(newDate);
              }}
              onMonthChange={(dateData) => {
                const newMonth = new Date(dateData.year, dateData.month - 1, 1);
                setCurrentMonth(newMonth);
              }}
            />

            {/* Selected Date Section */}
            <View style={styles.selectedDateSection}>
              {timeSlots.length > 0 ? (
                <>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateHeader}>
                      <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{t('online')}</Text>
                      </View>
                    </View>

                    {/* Time Slots */}
                    <View style={styles.timeSlotsContainer}>
                      {timeSlots.map((slot) => (
                        <View key={slot.id} style={styles.timeSlot}>
                          <Text style={styles.timeSlotText}>{slot.startTime} - {slot.endTime}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.deleteDayButton}>
                        <Image
                          source={IMAGES.delete}
                          style={styles.deleteDayIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editDayButton}>
                        <Text style={styles.editDayButtonText}>{t('edit')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Block/Add Availability */}
                  <View style={styles.blockAddButtons}>
                    <TouchableOpacity style={styles.blockButton}>
                      <Text style={styles.blockButtonText}>{t('blockAvailability')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>{t('addAvailability')}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* No Availability State */
                <View style={styles.noAvailabilityContainer}>
                  <Image
                    source={IMAGES.noAvailability}
                    style={styles.noAvailabilityIcon}
                  />
                  <Text style={styles.noAvailabilityText}>{t('youHaventAddedAvailabilityYet')}</Text>
                  <TouchableOpacity style={styles.addNewAvailabilityButton}>
                    <Text style={styles.addNewAvailabilityButtonText}>{t('addNewAvailability')}</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    marginTop: verticalScale(0),
    paddingTop: verticalScale(24),
    paddingLeft: Platform.OS === 'ios' ? I18nManager.isRTL ? scale(12) : 0 : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: '#0099FF',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textMuted,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  tabTextSelected: {
    fontFamily: quicksandFonts.semiBold,
    color: '#FFFFFF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(8),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  calendarMonth: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    marginVertical: verticalScale(4),
  },
  calendarNavigation: {
    flexDirection: 'row',
    gap: scale(6),
  },
  navArrowButton: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    width: scale(10),
    height: scale(10),
    resizeMode: 'contain',
    tintColor: colors.textDark,
  },
  calendarWeekdays: {
    flexDirection: 'row',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(10),
    fontFamily: quicksandFonts.medium,
    color: colors.textMuted,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendarDays: {
  },
  calendarWeek: {
    flexDirection: 'row',
  },
  calendarDayContainer: {
    flex: 1,
  },
  calendarDay: {
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(6),
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDaySelectedAvailable: {
    backgroundColor: '#0099FF',
  },
  calendarDaySelectedBlocked: {
    backgroundColor: '#F36A6A',
  },
  calendarDayBlocked: {
    backgroundColor: 'transparent',
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.medium,
    color: '#858585',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontFamily: quicksandFonts.bold,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendarDayTextBlocked: {
    color: '#F36A6A',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  calendarDayTextOtherMonth: {
    color: colors.textMuted,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  selectedDateSection: {
    marginBottom: verticalScale(20),
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: verticalScale(20),
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  selectedDateText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#0099FF',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
    marginLeft: scale(8),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontFamily: quicksandFonts.regular,
    color: '#0099FF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  timeSlot: {
    backgroundColor: '#F0F9FF',
    padding: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    alignSelf: 'flex-start',
  },
  timeSlotText: {
    fontSize: moderateScale(10),
    fontFamily: quicksandFonts.semiBold,
    color: '#000000',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  noAvailabilityContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    gap: verticalScale(12),
  },
  noAvailabilityIcon: {
    width: scale(90),
    height: scale(90),
    resizeMode: 'contain',
  },
  noAvailabilityText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.medium,
    color: colors.textMuted,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  addNewAvailabilityButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(90),
    paddingVertical: verticalScale(15),
    borderRadius: scale(8),
  },
  addNewAvailabilityButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#FFFFFF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  deleteDayButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteDayIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    tintColor: '#FF4C4C',
  },
  editDayButton: {
    flex: 1,
    backgroundColor: '#C8E9FF',
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  editDayButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#0099FF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  blockAddButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  blockButton: {
    flex: 1,
    backgroundColor: '#C8E9FF',
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  blockButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#0099FF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.bold,
    color: '#FFFFFF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});

export default AgendaScreen;
