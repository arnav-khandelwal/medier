import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import CommonModal from '../../../components/CommonModal';
import { useTranslation } from '../../../utils/translations/LanguageContext';

interface TermsAndConditionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  const content = (
    <View>
      <Text style={styles.firstParagraph}>
        {t('termsAndConditions', 'firstParagraph')}
      </Text>

      <Text style={styles.bodyText}>
        {t('termsAndConditions', 'bodyText')}
      </Text>
    </View>
  );

  return (
    <CommonModal
      visible={visible}
      onClose={onClose}
      title={t('termsAndConditions', 'title')}
      content={content}
    />
  );
};

const styles = StyleSheet.create({
  firstParagraph: {
    fontSize: moderateScale(12.5),
    fontWeight: '500',
    color: '#333333',
    width: '90%',
    fontFamily: quicksandFonts.medium,
    marginBottom: verticalScale(16),
  },
  bodyText: {
    fontSize: moderateScale(12),
    color: '#666666',
    fontFamily: quicksandFonts.regular,
  },
});

export default TermsAndConditionsModal;
