import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';
import CommonModal from '../CommonModal/CommonModal';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onClose }) => {
  const content = (
    <View>
      <Text style={styles.firstParagraph}>
        A privacy policy is a legal document that informs users about how you collect and handle their personal data and can have many different titles, including:
      </Text>

      <Text style={styles.bodyText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
      </Text>
    </View>
  );

  return (
    <CommonModal
      visible={visible}
      onClose={onClose}
      title="Privacy Policy"
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

export default PrivacyPolicyModal;
