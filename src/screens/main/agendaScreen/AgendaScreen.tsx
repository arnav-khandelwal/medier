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
import { useTranslation } from '../../../utils/translations/LanguageContext';
import { agendaData, getAgendaDay, isDayBlocked, TimeSlot } from './data/mockData';

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const renderCalendarDay = (day: number, isCurrentMonth: boolean, isSelected: boolean, isDayBlockedParam: boolean) => {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayIsBlocked = isDayBlockedParam || isDayBlocked(dayDate);
    
    return (
      <TouchableOpacity
        style={[
          styles.calendarDay,
          isSelected && !dayIsBlocked && styles.calendarDaySelectedAvailable,
          isSelected && dayIsBlocked && styles.calendarDaySelectedBlocked,
          !isCurrentMonth && styles.calendarDayOtherMonth,
        ]}
        onPress={() => setSelectedDate(dayDate)}
      >
        <Text style={[
          styles.calendarDayText,
          isSelected && styles.calendarDayTextSelected,
          !isSelected && dayIsBlocked && styles.calendarDayTextBlocked,
          !isCurrentMonth && styles.calendarDayTextOtherMonth,
        ]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderWeek = (startDay: number, isCurrentMonth: boolean) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startDay + i;
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() &&
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      const isBlocked = isDayBlocked(dayDate);
      const isValidDay = day > 0 && day <= 31;
      days.push(
        <View key={i} style={styles.calendarDayContainer}>
          {isValidDay ? renderCalendarDay(day, isCurrentMonth, isSelected, isBlocked) : <View style={styles.calendarDay} />}
        </View>
      );
    }
    return days;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const weeks = [];
    let currentDay = 1;
    
    // First week (may include days from previous month)
    const firstWeekDays = [];
    for (let i = 0; i < 7; i++) {
      if (i < firstDay) {
        firstWeekDays.push(<View key={`empty-${i}`} style={styles.calendarDayContainer}><View style={styles.calendarDay} /></View>);
      } else {
        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentDay);
        const isSelected = selectedDate.getDate() === currentDay && 
                          selectedDate.getMonth() === currentMonth.getMonth() &&
                          selectedDate.getFullYear() === currentMonth.getFullYear();
        const isBlocked = isDayBlocked(dayDate);
        firstWeekDays.push(
          <View key={currentDay} style={styles.calendarDayContainer}>
            {renderCalendarDay(currentDay, true, isSelected, isBlocked)}
          </View>
        );
        currentDay++;
      }
    }
    weeks.push(<View key="week-0" style={styles.calendarWeek}>{firstWeekDays}</View>);
    
    // Remaining weeks
    while (currentDay <= daysInMonth) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        if (currentDay <= daysInMonth) {
          const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentDay);
          const isSelected = selectedDate.getDate() === currentDay && 
                            selectedDate.getMonth() === currentMonth.getMonth() &&
                            selectedDate.getFullYear() === currentMonth.getFullYear();
          const isBlocked = isDayBlocked(dayDate);
          weekDays.push(
            <View key={currentDay} style={styles.calendarDayContainer}>
              {renderCalendarDay(currentDay, true, isSelected, isBlocked)}
            </View>
          );
          currentDay++;
        } else {
          weekDays.push(<View key={`empty-${currentDay}-${i}`} style={styles.calendarDayContainer}><View style={styles.calendarDay} /></View>);
        }
      }
      weeks.push(<View key={`week-${weeks.length}`} style={styles.calendarWeek}>{weekDays}</View>);
    }
    
    return weeks;
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={require('../../../../assets/background/firstscreenbg.png')}
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
                  {t('agendaScreen', 'myAvailability')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'teamAvailability' && styles.tabSelected]}
                onPress={() => setSelectedTab('teamAvailability')}
              >
                <Text style={[styles.tabText, selectedTab === 'teamAvailability' && styles.tabTextSelected]}>
                  {t('agendaScreen', 'teamAvailability')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>{getMonthName(currentMonth)}</Text>
                <View style={styles.calendarNavigation}>
                  <TouchableOpacity style={styles.navArrowButton} onPress={() => navigateMonth('prev')}>
                    <Image
                      source={require('../../../../assets/icons/arrowLeft.png')}
                      style={styles.navArrow}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navArrowButton} onPress={() => navigateMonth('next')}>
                    <Image
                      source={require('../../../../assets/icons/arrowRight.png')}
                      style={styles.navArrow}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.calendarWeekdays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekdayText}>{day}</Text>
                ))}
              </View>
              <View style={styles.calendarDays}>
                {renderCalendarDays()}
              </View>
            </View>

            {/* Selected Date Section */}
            <View style={styles.selectedDateSection}>
              {timeSlots.length > 0 ? (
                <>
                  <View style={styles.dateContainer}>
                    <View style={styles.dateHeader}>
                      <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{t('agendaScreen', 'online')}</Text>
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
                          source={require('../../../../assets/icons/delete.png')}
                          style={styles.deleteDayIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editDayButton}>
                        <Text style={styles.editDayButtonText}>{t('agendaScreen', 'edit')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Block/Add Availability */}
                  <View style={styles.blockAddButtons}>
                    <TouchableOpacity style={styles.blockButton}>
                      <Text style={styles.blockButtonText}>{t('agendaScreen', 'blockAvailability')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>{t('agendaScreen', 'addAvailability')}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* No Availability State */
                <View style={styles.noAvailabilityContainer}>
                  <Image
                    source={require('../../../../assets/icons/noAvailability.png')}
                    style={styles.noAvailabilityIcon}
                  />
                  <Text style={styles.noAvailabilityText}>{t('agendaScreen', 'noAvailabilityMessage')}</Text>
                  <TouchableOpacity style={styles.addNewAvailabilityButton}>
                    <Text style={styles.addNewAvailabilityButtonText}>{t('agendaScreen', 'addNewAvailability')}</Text>
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
