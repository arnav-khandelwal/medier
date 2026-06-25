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
  enableContinuousSelection?: boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  current,
  markedDates,
  onDayPress,
  onMonthChange,
  enableContinuousSelection = false,
}) => {
  const getMarkedDatesWithStyling = () => {
    if (!enableContinuousSelection || !markedDates) return markedDates;
    
    const dateStrings = Object.keys(markedDates).sort();
    const styledDates: { [key: string]: any } = {};
    
    if (dateStrings.length === 0) return markedDates;
    
    if (dateStrings.length === 1) {
      // Single date - rounded on all sides
      styledDates[dateStrings[0]] = {
        ...markedDates[dateStrings[0]],
        startingDay: false,
        endingDay: false,
      };
    } else {
      // Multiple dates - check for continuous ranges
      const ranges: string[][] = [];
      let currentRange: string[] = [dateStrings[0]];
      
      for (let i = 1; i < dateStrings.length; i++) {
        const prevDate = new Date(dateStrings[i - 1]);
        const currDate = new Date(dateStrings[i]);
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          // Continuous
          currentRange.push(dateStrings[i]);
        } else {
          // Break in continuity
          ranges.push(currentRange);
          currentRange = [dateStrings[i]];
        }
      }
      ranges.push(currentRange);
      
      // Apply styling to each range
      ranges.forEach(range => {
        range.forEach((dateStr, index) => {
          if (range.length === 1) {
            // Single date in range - rounded on all sides
            styledDates[dateStr] = {
              ...markedDates[dateStr],
              startingDay: false,
              endingDay: false,
            };
          } else if (index === 0) {
            // Start of range - rounded left only
            styledDates[dateStr] = {
              ...markedDates[dateStr],
              startingDay: true,
              endingDay: false,
            };
          } else if (index === range.length - 1) {
            // End of range - rounded right only
            styledDates[dateStr] = {
              ...markedDates[dateStr],
              startingDay: false,
              endingDay: true,
            };
          } else {
            // Middle of range - no rounding
            styledDates[dateStr] = {
              ...markedDates[dateStr],
              startingDay: false,
              endingDay: false,
            };
          }
        });
      });
    }
    
    return styledDates;
  };

  const styledMarkedDates = getMarkedDatesWithStyling();

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        current={current}
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        markedDates={styledMarkedDates}
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
              marginBottom: verticalScale(12),
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
              marginBottom: 4,
              width: 32,
              textAlign: 'center',
              fontSize: moderateScale(10),
              fontFamily: quicksandFonts.medium,
              color: colors.textMuted,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
            },
          },
          'stylesheet.calendar.day': {
            base: {
              width: scale(32),
              height: scale(32),
              alignItems: 'center',
            },
            text: {
              fontSize: moderateScale(12),
              fontFamily: quicksandFonts.medium,
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
          const isStarting = marking?.startingDay;
          const isEnding = marking?.endingDay;
          
          if (enableContinuousSelection && isSelected) {
            return (
              <TouchableOpacity
                style={[
                  styles.calendarDayContinuous,
                  isStarting && styles.calendarDayStart,
                  isEnding && styles.calendarDayEnd,
                  (!isStarting && !isEnding) && styles.calendarDayMiddle,
                ]}
                onPress={() => {
                  if (state !== 'disabled' && onDayPress) {
                    onDayPress(date);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.calendarDayTextSelected}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }
          
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
  calendarDayContinuous: {
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0099FF',
    width: scale(36),
    marginHorizontal: -2,
  },
  calendarDayStart: {
    borderTopLeftRadius: scale(6),
    borderBottomLeftRadius: scale(6),
    marginLeft: 0,
  },
  calendarDayEnd: {
    borderTopRightRadius: scale(6),
    borderBottomRightRadius: scale(6),
    marginRight: 0,
  },
  calendarDayMiddle: {
    borderRadius: 0,
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
