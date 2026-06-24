import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { colors } from '../theme/colors';

interface TimePickerProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: 'AM' | 'PM';
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  onClose,
  onTimeSelect,
  initialHour = 12,
  initialMinute = 0,
  initialPeriod = 'AM',
}) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);
  
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setHour(initialHour);
      setMinute(initialMinute);
      setPeriod(initialPeriod);
      
      // Scroll to initial positions
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({ y: (initialHour - 1) * verticalScale(50), animated: false });
        minuteScrollRef.current?.scrollTo({ y: initialMinute * verticalScale(50), animated: false });
        periodScrollRef.current?.scrollTo({ y: (initialPeriod === 'AM' ? 0 : 1) * verticalScale(50), animated: false });
      }, 100);
    }
  }, [visible, initialHour, initialMinute, initialPeriod]);

  const handleTimeSelect = () => {
    const displayMinutes = String(minute).padStart(2, '0');
    const formattedTime = `${String(hour).padStart(2, '0')}:${displayMinutes} ${period}`;
    onTimeSelect(formattedTime);
    onClose();
  };

  const handleHourScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / verticalScale(50));
    const newHour = Math.max(1, Math.min(12, index + 1));
    setHour(newHour);
  };

  const handleMinuteScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / verticalScale(50));
    const newMinute = Math.max(0, Math.min(59, index));
    setMinute(newMinute);
  };

  const handlePeriodScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / verticalScale(50));
    const newPeriod = index === 0 ? 'AM' : 'PM';
    setPeriod(newPeriod);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Select Time</Text>
            <TouchableOpacity onPress={handleTimeSelect}>
              <Text style={styles.confirmText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={hourScrollRef}
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={verticalScale(50)}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={handleHourScroll}
                onScrollEndDrag={handleHourScroll}
              >
                {[...Array(12)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.pickerItem,
                      hour === i + 1 && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setHour(i + 1);
                      hourScrollRef.current?.scrollTo({ y: i * verticalScale(50), animated: true });
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      hour === i + 1 && styles.pickerItemTextSelected
                    ]}>
                      {String(i + 1).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={minuteScrollRef}
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={verticalScale(50)}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={handleMinuteScroll}
                onScrollEndDrag={handleMinuteScroll}
              >
                {[...Array(60)].map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.pickerItem,
                      minute === i && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setMinute(i);
                      minuteScrollRef.current?.scrollTo({ y: i * verticalScale(50), animated: true });
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      minute === i && styles.pickerItemTextSelected
                    ]}>
                      {String(i).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={periodScrollRef}
                style={styles.pickerScroll}
                showsVerticalScrollIndicator={false}
                snapToInterval={verticalScale(50)}
                decelerationRate="fast"
                contentContainerStyle={styles.pickerContent}
                onMomentumScrollEnd={handlePeriodScroll}
                onScrollEndDrag={handlePeriodScroll}
              >
                {['AM', 'PM'].map((periodItem, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.pickerItem,
                      period === periodItem && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setPeriod(periodItem as 'AM' | 'PM');
                      periodScrollRef.current?.scrollTo({ y: i * verticalScale(50), animated: true });
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      period === periodItem && styles.pickerItemTextSelected
                    ]}>
                      {periodItem}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 153, 255, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
  },
  confirmText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.medium,
    color: colors.primary,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    height: verticalScale(250),
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: scale(8),
  },
  pickerScroll: {
    height: verticalScale(200),
  },
  pickerContent: {
    paddingVertical: verticalScale(75),
  },
  pickerItem: {
    height: verticalScale(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  pickerItemSelected: {
    backgroundColor: '#C8E9FF',
  },
  pickerItemText: {
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.regular,
    color: colors.textDark,
  },
  pickerItemTextSelected: {
    fontFamily: quicksandFonts.semiBold,
    color: colors.primary,
  },
});

export default TimePicker;
