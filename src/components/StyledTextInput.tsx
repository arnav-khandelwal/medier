import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  I18nManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { colors } from '../theme/colors';
import { quicksandFonts } from '../theme/typography';
import { IMAGES } from '../theme/images';

interface StyledTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconUnselected: any;
  iconSelected: any;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  iconUnselected,
  iconSelected,
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = 'default',
  maxLength,
  autoCapitalize = 'sentences',
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.gradientWrapper, isFocused ? styles.shadowFocused : styles.shadowUnfocused]}>
      {!isFocused && (
        <LinearGradient
          colors={['#FFFFFF', '#C6D3E7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBackground}
        />
      )}
      <View style={[styles.inputBoxInner, isFocused && styles.inputBoxInnerFocused]}>
        <Image
          source={isFocused ? iconSelected : iconUnselected}
          style={[styles.inputIcon, I18nManager.isRTL && styles.inputIconRTL]}
        />
        <TextInput
          style={[
            styles.textInput,
            {
              fontFamily: value.length > 0 ? quicksandFonts.semiBold : quicksandFonts.light,
              fontSize: value.length > 0 ? moderateScale(15) : moderateScale(12),
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#7a7676"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? IMAGES.hidePassword : IMAGES.showPassword}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientWrapper: {
    height: verticalScale(56),
    borderRadius: scale(16),
    backgroundColor: '#FFFFFF',
  },
  shadowUnfocused: {
    shadowColor: '#C6D3E7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowFocused: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: scale(16),
  },
  inputBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(15),
    flex: 1,
    margin: 1,
    paddingHorizontal: scale(15),
    backgroundColor: '#FFFFFF',
  },
  inputBoxInnerFocused: {
    margin: 0,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: scale(16),
  },
  inputIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: 'contain',
    marginEnd: scale(12),
  },
  inputIconRTL: {
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  eyeIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0E1726',
  },
});

export default StyledTextInput;
