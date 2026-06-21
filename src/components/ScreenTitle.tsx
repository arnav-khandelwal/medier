import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  I18nManager,
} from 'react-native';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { IMAGES } from '../theme/images';

interface ScreenTitleProps {
  title: string;
  onBackPress: () => void;
}

const ScreenTitle: React.FC<ScreenTitleProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Image
          source={IMAGES.backArrow}
          style={[
            styles.backIcon,
            I18nManager.isRTL && { transform: [{ rotate: '180deg' }] }
          ]}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ScreenTitle;
