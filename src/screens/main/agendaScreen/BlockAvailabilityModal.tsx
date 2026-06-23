import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, I18nManager, Image, Modal, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../theme/images';

interface BlockAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onBlockAvailability: (data: any) => void;
}

const BlockAvailabilityModal: React.FC<BlockAvailabilityModalProps> = ({
  visible,
  onClose,
  onBlockAvailability,
}) => {
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerType, setPickerType] = useState<'fromDate' | 'toDate' | 'date' | 'fromTime' | 'toTime' | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState('12');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');

  const handleBlockAvailability = () => {
    const data = activeTab === 'date' 
      ? { type: 'date', fromDate, toDate, reason }
      : { type: 'time', date, fromTime, toTime, reason };
    onBlockAvailability(data);
    onClose();
    // Reset form
    setFromDate('');
    setToDate('');
    setFromTime('');
    setToTime('');
    setReason('');
    setDate('');
  };

  const handleDateSelect = (day: any) => {
    const formattedDate = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
    
    if (pickerType === 'fromDate') {
      setFromDate(formattedDate);
    } else if (pickerType === 'toDate') {
      setToDate(formattedDate);
    } else if (pickerType === 'date') {
      setDate(formattedDate);
    }
    
    setShowDatePicker(false);
    setPickerType(null);
  };

  const openDatePicker = (type: 'fromDate' | 'toDate' | 'date') => {
    setPickerType(type);
    setShowDatePicker(true);
  };

  const openTimePicker = (type: 'fromTime' | 'toTime') => {
    setPickerType(type);
    setShowTimePicker(true);
  };

  const handleTimeSelect = () => {
    const formattedTime = `${tempHour}:${tempMinute} ${tempPeriod}`;
    
    if (pickerType === 'fromTime') {
      setFromTime(formattedTime);
    } else if (pickerType === 'toTime') {
      setToTime(formattedTime);
    }
    
    setShowTimePicker(false);
    setPickerType(null);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFromDate('');
    setToDate('');
    setFromTime('');
    setToTime('');
    setReason('');
    setDate('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Overlay area that dismisses on tap */}
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Close Button - Above the container */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Modal Container */}
        <View style={styles.modalContainer}>
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Block Availability</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'date' && styles.tabActive]}
                onPress={() => setActiveTab('date')}
              >
                <Text style={[styles.tabText, activeTab === 'date' && styles.tabTextActive]}>
                  Block By Date
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'time' && styles.tabActive]}
                onPress={() => setActiveTab('time')}
              >
                <Text style={[styles.tabText, activeTab === 'time' && styles.tabTextActive]}>
                  Block By Time
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {activeTab === 'date' ? (
                <>
                  {/* Date Inputs Side by Side */}
                  <View style={styles.rowContainer}>
                    {/* From Date */}
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <TouchableOpacity onPress={() => openDatePicker('fromDate')}>
                        <View style={styles.inputWrapper}>
                          <Image source={IMAGES.calendarIcon} style={styles.inputIconLeft} />
                          <TextInput
                            style={styles.input}
                            placeholder="From Date"
                            placeholderTextColor="#8E8E93"
                            value={fromDate}
                            onChangeText={setFromDate}
                            editable={false}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* To Date */}
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <TouchableOpacity onPress={() => openDatePicker('toDate')}>
                        <View style={styles.inputWrapper}>
                          <Image source={IMAGES.calendarIcon} style={styles.inputIconLeft} />
                          <TextInput
                            style={styles.input}
                            placeholder="To Date"
                            placeholderTextColor="#8E8E93"
                            value={toDate}
                            onChangeText={setToDate}
                            editable={false}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* Date */}
                  <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => openDatePicker('date')}>
                      <View style={styles.inputWrapper}>
                        <Image source={IMAGES.calendarIcon} style={styles.inputIconLeft} />
                        <TextInput
                          style={styles.input}
                          placeholder="Date"
                          placeholderTextColor="#8E8E93"
                          value={date}
                          onChangeText={setDate}
                          editable={false}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Time Inputs Side by Side */}
                  <View style={styles.rowContainer}>
                    {/* From Time */}
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <TouchableOpacity onPress={() => openTimePicker('fromTime')}>
                        <View style={styles.inputWrapper}>
                          <Image source={IMAGES.clockIcon} style={styles.inputIconLeft} />
                          <TextInput
                            style={styles.input}
                            placeholder="From Time"
                            placeholderTextColor="#8E8E93"
                            value={fromTime}
                            onChangeText={setFromTime}
                            editable={false}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* To Time */}
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <TouchableOpacity onPress={() => openTimePicker('toTime')}>
                        <View style={styles.inputWrapper}>
                          <Image source={IMAGES.clockIcon} style={styles.inputIconLeft} />
                          <TextInput
                            style={styles.input}
                            placeholder="To Time"
                            placeholderTextColor="#8E8E93"
                            value={toTime}
                            onChangeText={setToTime}
                            editable={false}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {/* Reason */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter Reason"
                  placeholderTextColor="#8E8E93"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Block Availability Button */}
              <TouchableOpacity style={styles.blockButton} onPress={handleBlockAvailability}>
                <Text style={styles.blockButtonText}>Block Availability</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.datePickerOverlay}>
          <TouchableOpacity 
            style={styles.datePickerOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          />
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={handleDateSelect}
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: colors.primary,
                dayTextColor: '#000000',
                textDisabledColor: '#D9D9D9',
                arrowColor: colors.primary,
                monthTextColor: '#000000',
                textDayFontFamily: quicksandFonts.regular,
                textMonthFontFamily: quicksandFonts.semiBold,
                textDayHeaderFontFamily: quicksandFonts.medium,
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.datePickerOverlay}>
          <TouchableOpacity 
            style={styles.datePickerOverlayTouchable}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          />
          <View style={styles.timePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.datePickerCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>Select Time</Text>
              <TouchableOpacity onPress={handleTimeSelect}>
                <Text style={styles.datePickerConfirmText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timePickerContent}>
              <View style={styles.timePickerRow}>
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Hour</Text>
                  <Picker
                    selectedValue={tempHour}
                    onValueChange={(itemValue) => setTempHour(itemValue)}
                    style={styles.timePicker}
                  >
                    {[...Array(12)].map((_, i) => (
                      <Picker.Item key={i} label={String(i + 1).padStart(2, '0')} value={String(i + 1).padStart(2, '0')} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Minute</Text>
                  <Picker
                    selectedValue={tempMinute}
                    onValueChange={(itemValue) => setTempMinute(itemValue)}
                    style={styles.timePicker}
                  >
                    {[0, 15, 30, 45].map((i) => (
                      <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.timePickerColumn}>
                  <Text style={styles.timePickerLabel}>Period</Text>
                  <Picker
                    selectedValue={tempPeriod}
                    onValueChange={(itemValue) => setTempPeriod(itemValue as 'AM' | 'PM')}
                    style={styles.timePicker}
                  >
                    <Picker.Item label="AM" value="AM" />
                    <Picker.Item label="PM" value="PM" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  closeButton: {
    alignSelf: 'center',
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: verticalScale(5),
  },
  closeButtonText: {
    fontSize: moderateScale(24),
    fontFamily: quicksandFonts.semiBold,
    color: '#FF0000',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(34),
    borderTopRightRadius: scale(34),
    height: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: scale(12),
    marginBottom: verticalScale(24),
    gap: scale(16),
  },
  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(8),
    alignItems: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#9ADFFC',
    backgroundColor: '#FFFFFF',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.medium,
    color: '#9ADFFC',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: quicksandFonts.medium,
  },
  formContainer: {
    gap: verticalScale(20),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
  },
  inputContainer: {
    gap: verticalScale(8),
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.regular,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    padding: 0,
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: 'top',
    paddingTop: verticalScale(12),
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
  },
  inputIconLeft: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
    tintColor: '#AAAAAA',
    marginRight: scale(8),
  },
  blockButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginTop: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  blockButtonText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.semiBold,
    color: '#FFFFFF',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerOverlayTouchable: {
    flex: 1,
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: verticalScale(20),
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerCloseText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.medium,
    color: colors.primary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  datePickerTitle: {
    fontSize: moderateScale(18),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  datePickerConfirmText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.medium,
    color: colors.primary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  timePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: verticalScale(20),
  },
  timePickerContent: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(16),
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
    marginBottom: verticalScale(8),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  timePicker: {
    width: '100%',
    height: verticalScale(150),
  },
});

export default BlockAvailabilityModal;
