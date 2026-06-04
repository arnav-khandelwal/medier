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
} from 'react-native';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import AppointmentCard from './AppointmentCard';
import ScreenTitle from '../../../components/ScreenTitle';
import { useTranslation } from '../../../utils/translations/LanguageContext';

interface Appointment {
  id: string;
  name: string;
  doctorId: string;
  photo: any;
  day: string;
  time: string;
  location?: string;
  isOnline: boolean;
  status?: 'arrived' | 'left' | 'in_consultation' | 'waiting';
}

interface AppointmentsScreenProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ onTabPress }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [selectedStatus, setSelectedStatus] = useState<string>('arrived');

  const appointments: Appointment[] = [
    {
      id: '1',
      name: 'Dr. Sara Williams',
      doctorId: 'ID001212',
      photo: require('../../../../assets/objects/personInAppointments.png'),
      day: 'Today',
      time: '16:00 PM',
      location: '1233 Central Ave, Lake Stati...',
      isOnline: false,
      status: 'arrived',
    },
    {
      id: '2',
      name: 'Dr. Claire Rousseau',
      doctorId: 'ID001212',
      photo: require('../../../../assets/objects/personInAppointments.png'),
      day: 'Today',
      time: '16:00 PM',
      location: '',
      isOnline: true,
    },
    {
      id: '3',
      name: 'Dr. Arnav Rousseau',
      doctorId: 'ID0011232',
      photo: require('../../../../assets/objects/personInAppointments.png'),
      day: 'Tomorrow',
      time: '16:00 PM',
      location: '',
      isOnline: false,
      status: 'arrived',
    },
  ];

  const renderFilterButton = (
    title: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: isSelected ? colors.primary : '#F1F1F1' },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: isSelected ? colors.textLight : colors.textMuted },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={require('../../../../assets/background/firstscreenbg.png')}
        style={styles.backgroundImage}
      />
      
      <View style={styles.container}>
        {/* Header */}
        <ScreenTitle title={t('appointmentsScreen', 'title')} onBackPress={() => onTabPress?.('Home')} />

        <View style={styles.whiteContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Primary Filters */}
          <View style={styles.filterContainer}>
            {renderFilterButton(t('appointmentsScreen', 'filters.upcoming'), selectedFilter === 'upcoming', () =>
              setSelectedFilter('upcoming')
            )}
            {renderFilterButton(t('appointmentsScreen', 'filters.completed'), selectedFilter === 'completed', () =>
              setSelectedFilter('completed')
            )}
            {renderFilterButton(t('appointmentsScreen', 'filters.expired'), selectedFilter === 'expired', () =>
              setSelectedFilter('expired')
            )}
          </View>

          {/* Secondary Filters */}
          <View style={styles.secondaryFilterContainer}>
            {renderFilterButton(
              t('appointmentsScreen', 'filters.cancelledByMe'),
              selectedFilter === 'cancelled_by_me',
              () => setSelectedFilter('cancelled_by_me')
            )}
            {renderFilterButton(
              t('appointmentsScreen', 'filters.cancelledByPatient'),
              selectedFilter === 'cancelled_by_patient',
              () => setSelectedFilter('cancelled_by_patient')
            )}
          </View>

          {/* Appointment Cards */}
          <View style={styles.appointmentsList}>
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                name={appointment.name}
                doctorId={appointment.doctorId}
                photo={appointment.photo}
                day={appointment.day}
                time={appointment.time}
                location={appointment.location}
                isOnline={appointment.isOnline}
                status={appointment.status}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onCancel={() => console.log('Cancel appointment', appointment.id)}
                onAction={() => console.log('Action for appointment', appointment.id)}
              />
            ))}
          </View>
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  filterContainer: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  secondaryFilterContainer: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(20),
  },
  filterButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: scale(20),
  },
  filterButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    fontFamily: quicksandFonts.semiBold,
  },
  appointmentsList: {
    gap: verticalScale(16),
    paddingBottom: verticalScale(80),
  },
});

export default AppointmentsScreen;
