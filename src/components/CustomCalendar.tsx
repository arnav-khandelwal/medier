import React from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, I18nManager } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { IMAGES } from '../theme/images';

interface CustomCalendarProps {
  current?: string;
  markedDates?: any;
  onDayPress?: (date: DateData) => void;
  onMonthChange?: (date: DateData) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  current,
  markedDates,
  onDayPress,
  onMonthChange,
}) => {
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        current={current}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: colors.textMuted,
          monthTextColor: colors.textDark,
          textMonthFontFamily: quicksandFonts.semiBold,
          textDayHeaderFontFamily: quicksandFonts.medium,
          textMonthFontSize: moderateScale(12),
          textDayHeaderFontSize: moderateScale(10),
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'flex-end', // pushes arrows to the right
              alignItems: 'center',
              marginBottom: verticalScale(16),
              minHeight: verticalScale(30),
            },
            headerContainer: {
              position: 'absolute',
              left: scale(8), // Match padding
              flexDirection: 'row',
              alignItems: 'center',
            },
            monthText: {
              fontSize: moderateScale(14),
              fontFamily: quicksandFonts.bold,
              color: colors.textDark,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              margin: 0,
            },
            arrow: {
              padding: 0,
            },
            dayHeader: {
              marginTop: 2,
              marginBottom: 7,
              width: 32,
              textAlign: 'center',
              fontSize: moderateScale(10),
              fontFamily: quicksandFonts.medium,
              color: colors.textMuted,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
            },
          },
        } as any}
        renderArrow={(direction: string) => (
          <View style={[styles.navArrowButton, direction === 'left' && { marginRight: scale(16) }]}>
            <Image
              source={direction === 'left' ? IMAGES.arrowLeft : IMAGES.arrowRight}
              style={styles.navArrow}
            />
          </View>
        )}
        dayComponent={({ date, state, marking }: any) => {
          if (!date) return <View style={styles.calendarDay} />;
          
          const isSelected = marking?.selected;
          const isBlocked = marking?.blocked;
          
          return (
            <TouchableOpacity
              style={[
                styles.calendarDay,
                isSelected && !isBlocked && styles.calendarDaySelectedAvailable,
                isSelected && isBlocked && styles.calendarDaySelectedBlocked,
                state === 'disabled' && styles.calendarDayOtherMonth,
              ]}
              onPress={() => {
                if (state !== 'disabled' && onDayPress) {
                  onDayPress(date);
                }
              }}
              activeOpacity={state === 'disabled' ? 1 : 0.7}
            >
              <Text style={[
                styles.calendarDayText,
                isSelected && styles.calendarDayTextSelected,
                !isSelected && isBlocked && styles.calendarDayTextBlocked,
                state === 'disabled' && styles.calendarDayTextOtherMonth,
              ]}>
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(8),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  calendarDay: {
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(6),
    width: scale(32),
  },
  calendarDaySelectedAvailable: {
    backgroundColor: '#0099FF',
  },
  calendarDaySelectedBlocked: {
    backgroundColor: '#F36A6A',
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
});

export default CustomCalendar;
