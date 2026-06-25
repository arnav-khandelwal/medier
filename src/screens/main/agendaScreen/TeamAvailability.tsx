import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  I18nManager,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import CustomCalendar from '../../../components/CustomCalendar';
import DropdownModal from '../../../components/DropdownModal';
import { useTranslation } from '../../../utils/translations/LanguageContext';
import { IMAGES } from '../../../theme/images';

interface ClinicOption {
  label: string;
  value: string;
}

interface Doctor {
  id: string;
  name: string;
  online: boolean;
  timeSlots: {
    id: string;
    startTime: string;
    endTime: string;
    selected: boolean;
  }[];
}

const TeamAvailability: React.FC = () => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicOption>({ label: 'Advantal Clinic', value: 'advantal' });

  const clinicOptions: ClinicOption[] = [
    { label: 'Advantal Clinic', value: 'advantal' },
    { label: 'City Medical Center', value: 'city' },
    { label: 'Health Plus Clinic', value: 'health' },
  ];

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Shyam Patidar',
      online: true,
      timeSlots: [
        { id: '1', startTime: '12:30 AM', endTime: '09:30 AM', selected: true },
        { id: '2', startTime: '01:15 AM', endTime: '05:15 AM', selected: false },
      ],
    },
  ];

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
      dates[dateString] = {};
    }

    const selectedY = selectedDate.getFullYear();
    const selectedM = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const selectedD = String(selectedDate.getDate()).padStart(2, '0');
    const selectedDateString = `${selectedY}-${selectedM}-${selectedD}`;

    dates[selectedDateString] = { selected: true };

    return dates;
  };

  const markedDates = getMarkedDates();

  return (
    <>
      {/* Clinic Dropdown */}
      <TouchableOpacity
        style={styles.clinicDropdown}
        onPress={() => setShowClinicDropdown(true)}
      >
        <Text style={styles.clinicDropdownText}>{selectedClinic.label}</Text>
        <Image source={IMAGES.countrySelectUnselected} style={styles.dropdownIcon} />
      </TouchableOpacity>

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

      {/* Doctors Section */}
      <View style={styles.doctorsSection}>
        {doctors.map((doctor) => (
          <View key={doctor.id} style={styles.doctorCard}>
            <View style={styles.doctorHeader}>
              <Image source={IMAGES.personInAppointments} style={styles.doctorPhoto} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <View style={styles.statusTags}>
                  <View style={styles.statusTag}>
                    <View style={[styles.statusDot, doctor.online ? styles.statusDotOnline : styles.statusDotOffline]} />
                    <Text style={[styles.statusTagText, doctor.online ? styles.statusTagTextOnline : styles.statusTagTextOffline]}>
                      {doctor.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                  <View style={styles.statusTag}>
                    <View style={[styles.statusDot, !doctor.online ? styles.statusDotOnline : styles.statusDotOffline]} />
                    <Text style={[styles.statusTagText, !doctor.online ? styles.statusTagTextOnline : styles.statusTagTextOffline]}>
                      {!doctor.online ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Time Slots */}
            <View style={styles.timeSlotsContainer}>
              {doctor.timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => setSelectedSlotId(slot.id)}
                  style={[
                    styles.timeSlot,
                    slot.selected && styles.timeSlotSelected,
                    selectedSlotId === slot.id && styles.timeSlotSelected,
                  ]}
                >
                  <Text style={styles.timeSlotText}>{slot.startTime} - {slot.endTime}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Clinic Dropdown Modal */}
      <DropdownModal
        visible={showClinicDropdown}
        onClose={() => setShowClinicDropdown(false)}
        title="Select Clinic"
        options={clinicOptions}
        onSelect={(option) => {
          setSelectedClinic(option);
          setShowClinicDropdown(false);
        }}
        initialValue={selectedClinic.value}
        showSearch={true}
      />
    </>
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  clinicDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(20),
  },
  clinicDropdownText: {
    fontSize: moderateScale(14),
    fontFamily: quicksandFonts.medium,
    color: colors.textDark,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  dropdownIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
  },
  doctorsSection: {
    marginBottom: verticalScale(20),
  },
  doctorCard: {
    borderWidth: 1,
    borderColor: '#C8E9FF',
    borderRadius: scale(16),
    marginBottom: verticalScale(20),
    padding: scale(16),
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  doctorPhoto: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    resizeMode: 'cover',
    marginRight: scale(12),
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: moderateScale(16),
    fontFamily: quicksandFonts.semiBold,
    color: colors.textDark,
    marginBottom: verticalScale(8),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  statusTags: {
    flexDirection: 'row',
    gap: scale(16),
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(6),
  },
  statusDotOnline: {
    backgroundColor: '#0099FF',
  },
  statusDotOffline: {
    backgroundColor: '#666666',
  },
  statusTagText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.regular,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  statusTagTextOnline: {
    color: '#0099FF',
  },
  statusTagTextOffline: {
    color: '#666666',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  timeSlot: {
    backgroundColor: '#F0F9FF',
    padding: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#C8E9FF',
    alignSelf: 'flex-start',
  },
  timeSlotSelected: {
    backgroundColor: '#C0E6FF',
    borderColor: '#0099FF',
  },
  timeSlotText: {
    fontSize: moderateScale(10),
    fontFamily: quicksandFonts.semiBold,
    color: '#000000',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});

export default TeamAvailability;
