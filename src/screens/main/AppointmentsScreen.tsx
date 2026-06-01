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
import { colors } from '../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../theme/scaling';
import { quicksandFonts } from '../../theme/typography';

interface Appointment {
  id: string;
  doctorName: string;
  doctorId: string;
  photo: any;
  date: string;
  time: string;
  location: string;
  isVideo: boolean;
  status?: 'arrived' | 'left' | 'in_consultation' | 'waiting';
}

interface AppointmentsScreenProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ onTabPress }) => {
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [selectedStatus, setSelectedStatus] = useState<string>('arrived');

  const appointments: Appointment[] = [
    {
      id: '1',
      doctorName: 'Dr. Sara Williams',
      doctorId: 'ID001212',
      photo: require('../../../assets/objects/personInAppointments.png'),
      date: 'Today',
      time: '16:00 PM',
      location: '1233 Central Ave, Lake Stati...',
      isVideo: false,
      status: 'arrived',
    },
    {
      id: '2',
      doctorName: 'Dr. Claire Rousseau',
      doctorId: 'ID001212',
      photo: require('../../../assets/objects/personInAppointments.png'),
      date: 'Today',
      time: '16:00 PM',
      location: '',
      isVideo: true,
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

  const renderStatusButton = (
    title: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        { backgroundColor: isSelected ? colors.primary : '#F1F1F1' },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.statusButtonText,
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
        source={require('../../../assets/background/firstscreenbg.png')}
        style={styles.backgroundImage}
      />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => onTabPress?.('Home')}>
            <Image
              source={require('../../../assets/icons/backArrow.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.whiteContainer}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Primary Filters */}
          <View style={styles.filterContainer}>
            {renderFilterButton('Upcoming', selectedFilter === 'upcoming', () =>
              setSelectedFilter('upcoming')
            )}
            {renderFilterButton('Completed', selectedFilter === 'completed', () =>
              setSelectedFilter('completed')
            )}
            {renderFilterButton('Expired', selectedFilter === 'expired', () =>
              setSelectedFilter('expired')
            )}
          </View>

          {/* Secondary Filters */}
          <View style={styles.secondaryFilterContainer}>
            {renderFilterButton(
              'Cancelled By Me',
              selectedFilter === 'cancelled_by_me',
              () => setSelectedFilter('cancelled_by_me')
            )}
            {renderFilterButton(
              'Cancelled By Patient',
              selectedFilter === 'cancelled_by_patient',
              () => setSelectedFilter('cancelled_by_patient')
            )}
          </View>

          {/* Appointment Cards */}
          <View style={styles.appointmentsList}>
            {appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.cardHeader}>
                  <Image
                    source={appointment.photo}
                    style={styles.doctorPhoto}
                  />
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.doctorId}>{appointment.doctorId}</Text>
                    {appointment.isVideo && (
                      <View style={styles.videoTag}>
                        <Text style={styles.videoTagText}>Video</Text>
                      </View>
                    )}
                    <Text style={styles.dateTime}>
                      {appointment.date} | {appointment.time}
                    </Text>
                    {!appointment.isVideo && appointment.location && (
                      <View style={styles.locationContainer}>
                        <Image
                          source={require('../../../assets/icons/location.png')}
                          style={styles.locationIcon}
                        />
                        <Text style={styles.locationText}>{appointment.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.divider} />

                {appointment.status && (
                  <View style={styles.statusContainer}>
                    {renderStatusButton(
                      'Arrived',
                      selectedStatus === 'arrived',
                      () => setSelectedStatus('arrived')
                    )}
                    {renderStatusButton(
                      'Left',
                      selectedStatus === 'left',
                      () => setSelectedStatus('left')
                    )}
                    {renderStatusButton(
                      'In Consultation',
                      selectedStatus === 'in_consultation',
                      () => setSelectedStatus('in_consultation')
                    )}
                    {renderStatusButton(
                      'Waiting',
                      selectedStatus === 'waiting',
                      () => setSelectedStatus('waiting')
                    )}
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>
                      {appointment.isVideo ? 'Join' : 'Start Consultation'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    fontFamily: quicksandFonts.bold,
  },
  headerSpacer: {
    width: scale(40),
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
    paddingBottom: verticalScale(20),
  },
  appointmentCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: scale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#C8E9FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  doctorPhoto: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(8),
    resizeMode: 'cover',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  doctorName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: verticalScale(4),
    fontFamily: quicksandFonts.bold,
  },
  doctorId: {
    fontSize: moderateScale(12),
    color: colors.textMuted,
    fontFamily: quicksandFonts.regular,
  },
  videoTag: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
    alignSelf: 'flex-start',
    marginTop: verticalScale(4),
    borderWidth: 0.5,
    borderColor: '#0099FF',
  },
  videoTagText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: '#0099FF',
    fontFamily: quicksandFonts.semiBold,
  },
  cardDetails: {
    marginBottom: verticalScale(12),
  },
  dateTime: {
    fontSize: moderateScale(12),
    color: colors.textDark,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
    fontFamily: quicksandFonts.regular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginRight: scale(6),
  },
  locationText: {
    fontSize: moderateScale(12),
    fontFamily: quicksandFonts.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: verticalScale(12),
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  statusButton: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(10),
  },
  statusButtonText: {
    fontSize: moderateScale(11),
    fontFamily: quicksandFonts.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(12),
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 0.45,
    backgroundColor: '#FFE2E2',
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: moderateScale(12),
    color: '#FF4444',
    fontFamily: quicksandFonts.regular,
  },
  actionButton: {
    flex: 0.55,
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(8),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: moderateScale(12),
    color: colors.textLight,
    fontFamily: quicksandFonts.semiBold,
  },
});

export default AppointmentsScreen;
