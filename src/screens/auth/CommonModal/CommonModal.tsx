import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from '../../../theme/scaling';
import { quicksandFonts } from '../../../theme/typography';

interface CommonModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const CommonModal: React.FC<CommonModalProps> = ({ visible, onClose, title, content }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Overlay area that dismisses on tap */}
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Close Button - Above the container */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image 
            source={require('../../../../assets/icons/closeButton.png')} 
            style={styles.closeIcon} 
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.bottomSheetContainer}>
          {/* Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
          >
            <Text style={styles.heading}>{title}</Text>
            {content}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 153, 255, 0.75)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: scale(34),
    borderTopRightRadius: scale(34),
    height: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginTop: verticalScale(10),
  },
  closeButton: {
    alignSelf: 'center',
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
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
  closeIcon: {
    width: scale(18),
    height: scale(18),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  heading: {
    fontSize: moderateScale(22),
    color: '#2E2E2E',
    fontFamily: quicksandFonts.bold,
    marginBottom: verticalScale(20),
  },
});

export default CommonModal;
