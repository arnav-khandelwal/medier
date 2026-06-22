import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ImageSourcePropType } from 'react-native';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { colors } from '../theme/colors';

export interface AlertButton {
  text: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
}

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  icon?: ImageSourcePropType;
  title: string;
  buttons?: AlertButton[];
  isNested?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  icon,
  title,
  buttons = [],
  isNested = false,
}) => {
  if (!visible) return null;

  const content = (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {icon && (
          <Image source={icon} style={styles.icon} />
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        {buttons.length > 0 && (
          <View style={styles.buttonsRow}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.backgroundColor ? { backgroundColor: btn.backgroundColor } : {},
                  buttons.length > 1 ? styles.halfWidth : styles.fullWidth,
                  buttons.length > 1 && index === 0 ? { marginRight: scale(12) } : {}
                ]}
                onPress={btn.onPress}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.textColor ? { color: btn.textColor } : { color: '#000' }
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (isNested) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
        {content}
      </View>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {content}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 153, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(24),
    paddingVertical: verticalScale(30),
    paddingHorizontal: scale(20),
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    width: scale(70),
    height: scale(70),
    resizeMode: 'contain',
    marginBottom: verticalScale(20),
  },
  title: {
    fontFamily: quicksandFonts.bold,
    fontSize: moderateScale(18),
    color: '#000000',
    textAlign: 'center',
    marginBottom: verticalScale(24),
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
  },
  halfWidth: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(14),
  },
});

export default AlertModal;
