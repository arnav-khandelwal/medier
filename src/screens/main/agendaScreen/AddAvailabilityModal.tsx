import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import CustomCalendar from '../../../components/CustomCalendar';
import TimePicker from '../../../components/TimePicker';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../theme/images';

interface TimeSlot {
  id: string;
  mode: 'online' | 'offline';
  startTime: string;
  endTime: string;
}

interface AddAvailabilityModalProps {
  visible: boolean;
  onClose: () => void;
  onAddAvailability: (data: any) => void;
}

const AddAvailabilityModal: React.FC<AddAvailabilityModalProps> = ({
  visible,
  onClose,
  onAddAvailability,
}) => {
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: any }>({});
  const [repeatType, setRepeatType] = useState<'none' | 'date' | 'week'>('none');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', mode: 'online', startTime: '', endTime: '' }
  ]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerSlotId, setPickerSlotId] = useState<string | null>(null);
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);

  // Reset selected dates when repeat type changes
  useEffect(() => {
    setSelectedDates({});
  }, [repeatType]);

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    setSelectedDates(prev => {
      const newDates = { ...prev };
      
      if (repeatType === 'none') {
        // Only one date at a time
        if (newDates[dateString]) {
          delete newDates[dateString];
        } else {
          // Clear all other dates and select only this one
          Object.keys(newDates).forEach(key => delete newDates[key]);
          newDates[dateString] = { selected: true, selectedColor: colors.primary };
        }
      } else if (repeatType === 'date') {
        // Multiple dates allowed
        if (newDates[dateString]) {
          delete newDates[dateString];
        } else {
          newDates[dateString] = { selected: true, selectedColor: colors.primary };
        }
      } else if (repeatType === 'week') {
        // Select date + 7 days
        const selectedDate = new Date(dateString);
        for (let i = 0; i < 7; i++) {
          const nextDate = new Date(selectedDate);
          nextDate.setDate(selectedDate.getDate() + i);
          const nextDateString = nextDate.toISOString().split('T')[0];
          newDates[nextDateString] = { selected: true, selectedColor: colors.primary };
        }
      }
      
      return newDates;
    });
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      mode: 'online',
      startTime: '',
      endTime: ''
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    }
  };

  const updateSlotMode = (id: string, mode: 'online' | 'offline') => {
    setTimeSlots(timeSlots.map(slot => 
      slot.id === id ? { ...slot, mode } : slot
    ));
  };

  const openTimePicker = (slotId: string, type: 'start' | 'end') => {
    setPickerSlotId(slotId);
    setPickerType(type);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time: string) => {
    if (pickerSlotId && pickerType) {
      setTimeSlots(timeSlots.map(slot => 
        slot.id === pickerSlotId 
          ? { ...slot, [pickerType === 'start' ? 'startTime' : 'endTime']: time }
          : slot
      ));
    }
    setShowTimePicker(false);
    setPickerSlotId(null);
    setPickerType(null);
  };

  const handleAddAvailability = () => {
    const data = {
      dates: Object.keys(selectedDates),
      repeatType,
      timeSlots
    };
    onAddAvailability(data);
    onClose();
    // Reset form
    setSelectedDates({});
    setRepeatType('none');
    setTimeSlots([{ id: '1', mode: 'online', startTime: '', endTime: '' }]);
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedDates({});
    setRepeatType('none');
    setTimeSlots([{ id: '1', mode: 'online', startTime: '', endTime: '' }]);
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

        {/* Close Button */}
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
              <Text style={styles.title}>Add Availability</Text>
            </View>

            {/* Date Selection Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Date</Text>
              <CustomCalendar
                onDayPress={handleDayPress}
                markedDates={selectedDates}
                enableContinuousSelection={true}
              />
            </View>

            {/* Repeat Selection Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Select Repeat</Text>
              <View style={styles.repeatButtons}>
                <TouchableOpacity
                  style={[styles.repeatButton, repeatType === 'none' && styles.repeatButtonActive]}
                  onPress={() => setRepeatType('none')}
                >
                  <Text style={[styles.repeatButtonText, repeatType === 'none' && styles.repeatButtonTextActive]}>
                    No Repeat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.repeatButton, repeatType === 'date' && styles.repeatButtonActive]}
                  onPress={() => setRepeatType('date')}
                >
                  <Text style={[styles.repeatButtonText, repeatType === 'date' && styles.repeatButtonTextActive]}>
                    Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.repeatButton, repeatType === 'week' && styles.repeatButtonActive]}
                  onPress={() => setRepeatType('week')}
                >
                  <Text style={[styles.repeatButtonText, repeatType === 'week' && styles.repeatButtonTextActive]}>
                    Week
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Time Slot Section */}
            <View style={styles.section}>
              <View style={styles.timeSlotHeader}>
                <Text style={styles.sectionLabel}>Time Slot</Text>
                <TouchableOpacity style={styles.addSlotButton} onPress={addTimeSlot}>
                  <Text style={styles.addSlotButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {timeSlots.map((slot, index) => (
                <View key={slot.id} style={styles.timeSlotCard}>
                  {/* Slot Header */}
                  <View style={styles.slotCardHeader}>
                    <Text style={styles.slotCardTitle}>Time Slot {index + 1}</Text>
                    {timeSlots.length > 1 && (
                      <TouchableOpacity onPress={() => removeTimeSlot(slot.id)}>
                        <Image source={IMAGES.delete} style={styles.deleteIcon} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Mode Toggle */}
                  <View style={styles.modeToggle}>
                    <TouchableOpacity
                      style={[styles.modeButton, slot.mode === 'online' && styles.modeButtonActive]}
                      onPress={() => updateSlotMode(slot.id, 'online')}
                    >
                      <Text style={[styles.modeButtonText, slot.mode === 'online' && styles.modeButtonTextActive]}>
                        Online
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modeButton, slot.mode === 'offline' && styles.modeButtonActive]}
                      onPress={() => updateSlotMode(slot.id, 'offline')}
                    >
                      <Text style={[styles.modeButtonText, slot.mode === 'offline' && styles.modeButtonTextActive]}>
                        Offline
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Time Pickers */}
                  <View style={styles.timePickersRow}>
                    <TouchableOpacity 
                      style={styles.timePickerInput}
                      onPress={() => openTimePicker(slot.id, 'start')}
                    >
                      <Image source={IMAGES.clockIcon} style={styles.timePickerIcon} />
                      <Text style={styles.timePickerText}>
                        {slot.startTime || 'Start Time'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.timePickerInput}
                      onPress={() => openTimePicker(slot.id, 'end')}
                    >
                      <Image source={IMAGES.clockIcon} style={styles.timePickerIcon} />
                      <Text style={styles.timePickerText}>
                        {slot.endTime || 'End Time'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Availability Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddAvailability}>
              <Text style={styles.addButtonText}>Add Availability</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Time Picker Modal */}
      <TimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onTimeSelect={handleTimeSelect}
      />
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
    height: '85%',
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
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
  },
  section: {
    marginBottom: verticalScale(16),
  },
  sectionLabel: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
    marginBottom: verticalScale(8),
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  repeatButtons: {
    flexDirection: 'row',
    gap: scale(12),
  },
  repeatButton: {
    flex: 1,
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#C8E9FF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  repeatButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  repeatButtonText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.medium,
    color: colors.primary,
  },
  repeatButtonTextActive: {
    color: '#FFFFFF',
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  addSlotButton: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(6),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSlotButtonText: {
    fontSize: moderateScale(20),
    fontFamily: quicksandFonts.bold,
    color: '#FFFFFF',
    lineHeight: moderateScale(20),
  },
  timeSlotCard: {
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: verticalScale(12),
    backgroundColor: '#FFFFFF',
  },
  slotCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  slotCardTitle: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
  },
  deleteIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    tintColor: '#FF4C4C',
  },
  modeToggle: {
    flexDirection: 'row',
    marginBottom: verticalScale(8),
    alignSelf: 'flex-start',
  },
  modeButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: scale(8),
    alignItems: 'center',
    marginRight: scale(8),
    borderWidth: 0.3,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.regular,
    color: colors.primary,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  timePickersRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  timePickerInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(8),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
  },
  timePickerIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: 'contain',
    tintColor: '#000000',
    marginRight: scale(6),
  },
  timePickerText: {
    flex: 1,
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.regular,
    color: colors.textDark,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginTop: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.semiBold,
    color: '#FFFFFF',
  },
});

export default AddAvailabilityModal;
