import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { scale, verticalScale, moderateScale } from '../../theme/scaling';
import { quicksandFonts } from '../../theme/typography';

export interface DrawerItemProps {
  icon: any;
  label: string;
  onPress?: () => void;
}

export const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
    <View style={styles.iconBackground}>
      <Image source={icon} style={styles.drawerIcon} />
    </View>
    <Text style={styles.drawerLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  iconBackground: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(8),
    backgroundColor: '#518CFF0D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(10),
  },
  drawerIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  drawerLabel: {
    fontSize: moderateScale(14),
    color: colors.textDark,
    fontFamily: quicksandFonts.semiBold,
  },
});
