import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import { useTranslation } from '../../../utils/translations/LanguageContext';

interface AppointmentCardProps {
  id: string;
  name: string;
  doctorId: string;
  photo: any;
  day: string;
  time: string;
  location?: string;
  isOnline: boolean;
  status?: 'arrived' | 'left' | 'in_consultation' | 'waiting';
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  onCancel?: () => void;
  onAction?: () => void;
  onPress?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  name,
  doctorId,
  photo,
  day,
  time,
  location,
  isOnline,
  status,
  selectedStatus,
  onStatusChange,
  onCancel,
  onAction,
  onPress,
}) => {
  const { t } = useTranslation();
  const renderStatusButton = (
    title: string,
    isSelected: boolean,
    onPressBtn: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.statusButton,
        { backgroundColor: isSelected ? colors.primary : '#F1F1F1' },
      ]}
      onPress={onPressBtn}
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
    <View style={styles.appointmentCard}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.cardHeader}>
          <Image source={photo} style={styles.doctorPhoto} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{name}</Text>
            <Text style={styles.doctorId}>{doctorId}</Text>
            {isOnline && (
              <View style={styles.videoTag}>
                <Text style={styles.videoTagText}>{t('video')}</Text>
              </View>
            )}
            <Text style={styles.dateTime}>
              {day} | {time}
            </Text>
            {!isOnline && location && (
              <View style={styles.locationContainer}>
                <Image
                  source={require('../../../../assets/icons/location.png')}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.divider} />

      {status && (
        <View style={styles.statusContainer}>
          {renderStatusButton(
            t('arrived'),
            selectedStatus === 'arrived',
            () => onStatusChange?.('arrived')
          )}
          {renderStatusButton(
            t('left'),
            selectedStatus === 'left',
            () => onStatusChange?.('left')
          )}
          {renderStatusButton(
            t('inConsultation'),
            selectedStatus === 'in_consultation',
            () => onStatusChange?.('in_consultation')
          )}
          {renderStatusButton(
            t('waiting'),
            selectedStatus === 'waiting',
            () => onStatusChange?.('waiting')
          )}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>
            {isOnline ? t('join') : t('startConsultation')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  doctorId: {
    fontSize: moderateScale(12),
    color: colors.textMuted,
    fontFamily: quicksandFonts.regular,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
  dateTime: {
    fontSize: moderateScale(12),
    color: colors.textDark,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4),
    fontFamily: quicksandFonts.regular,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});

export default AppointmentCard;
