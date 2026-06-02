import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { DrawerItemProps, styles } from './ProfileScreen';

export const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
    <View style={styles.iconBackground}>
      <Image source={icon} style={styles.drawerIcon} />
    </View>
    <Text style={styles.drawerLabel}>{label}</Text>
  </TouchableOpacity>
);
