import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import TimePicker from '../../../components/TimePicker';
import DropdownModal from '../../../components/DropdownModal';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { colors } from '../../../theme/colors';
import { IMAGES } from '../../../theme/images';
import { useTranslation } from '../../../utils/translations/LanguageContext';

interface EditTimeSlotModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: {
    mode: 'online' | 'offline';
    startTime: string;
    endTime: string;
    location?: string;
  };
}

const EditTimeSlotModal: React.FC<EditTimeSlotModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'online' | 'offline'>(initialData?.mode || 'online');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locationOptions = [
    { label: 'Office A', value: 'office_a' },
    { label: 'Office B', value: 'office_b' },
    { label: 'Remote', value: 'remote' },
    { label: 'Client Site', value: 'client_site' },
  ];

  const openTimePicker = (type: 'start' | 'end') => {
    setPickerType(type);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time: string) => {
    if (pickerType === 'start') {
      setStartTime(time);
    } else if (pickerType === 'end') {
      setEndTime(time);
    }
    setShowTimePicker(false);
    setPickerType(null);
  };

  const handleLocationSelect = (option: { label: string; value: string }) => {
    setLocation(option.label);
    setShowLocationDropdown(false);
  };

  const handleSave = () => {
    const data = {
      mode,
      startTime,
      endTime,
      location: mode === 'offline' ? location : undefined,
    };
    onSave(data);
    onClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setMode('online');
    setStartTime('');
    setEndTime('');
    setLocation('');
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
              <Text style={styles.title}>{t('editTimeSlot')}</Text>
            </View>

            {/* Mode Toggle */}
            <View style={styles.compactSection}>
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[styles.modeButton, mode === 'online' && styles.modeButtonActive]}
                  onPress={() => setMode('online')}
                >
                  <Text style={[styles.modeButtonText, mode === 'online' && styles.modeButtonTextActive]}>
                    {t('online')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeButton, mode === 'offline' && styles.modeButtonActive]}
                  onPress={() => setMode('offline')}
                >
                  <Text style={[styles.modeButtonText, mode === 'offline' && styles.modeButtonTextActive]}>
                    {t('offline')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Time Pickers */}
              <View style={styles.timePickersRow}>
                <TouchableOpacity 
                  style={styles.timePickerInput}
                  onPress={() => openTimePicker('start')}
                >
                  <Image source={IMAGES.clockIcon} style={styles.timePickerIcon} />
                  <Text style={styles.timePickerText}>
                    {startTime || t('startTime')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.timePickerInput}
                  onPress={() => openTimePicker('end')}
                >
                  <Image source={IMAGES.clockIcon} style={styles.timePickerIcon} />
                  <Text style={styles.timePickerText}>
                    {endTime || t('endTime')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location Dropdown - Only for offline mode */}
              {mode === 'offline' && (
                <TouchableOpacity 
                  style={styles.locationInput}
                  onPress={() => setShowLocationDropdown(true)}
                >
                  <Text style={styles.locationText}>
                    {location || t('selectLocation')}
                  </Text>
                  <Image source={IMAGES.dropdown} style={styles.dropdownIcon} />
                </TouchableOpacity>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('updateSlot')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Time Picker Modal */}
      <TimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onTimeSelect={handleTimeSelect}
        initialHour={startTime ? parseInt(startTime.split(':')[0]) : 9}
        initialMinute={startTime ? parseInt(startTime.split(':')[1]) : 0}
        initialPeriod={(startTime?.split(' ')[1] as 'AM' | 'PM') || 'AM'}
      />

      {/* Location Dropdown Modal */}
      <DropdownModal
        visible={showLocationDropdown}
        onClose={() => setShowLocationDropdown(false)}
        title="Select Location"
        options={locationOptions}
        onSelect={handleLocationSelect}
        initialValue={location}
        others={true}
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
    height: '50%',
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
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(22),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
  },
  compactSection: {
    marginBottom: verticalScale(16),
  },
  modeToggle: {
    flexDirection: 'row',
  },
  modeButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
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
    fontSize: moderateScale(13),
    fontFamily: quicksandFonts.regular,
    color: colors.primary,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  timePickersRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginTop: verticalScale(12),
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
    fontSize: moderateScale(13),
    fontFamily: quicksandFonts.regular,
    color: colors.textDark,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(8),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(12),
  },
  locationText: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.regular,
    color: colors.textDark,
  },
  dropdownIcon: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    tintColor: colors.primary,
  },
  saveButton: {
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
  saveButtonText: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.semiBold,
    color: '#FFFFFF',
  },
});

export default EditTimeSlotModal;
