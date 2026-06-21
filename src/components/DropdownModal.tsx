import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import CommonModal from './CommonModal';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { colors } from '../theme/colors';

interface Option<T = string> {
  label: string;
  value: T;
}

interface DropdownModalProps<T = string> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: Option<T>[];
  /** Called when the user confirms their selection */
  onSelect: (option: Option<T>) => void;
  /** Optional initial selected value */
  initialValue?: T | null;
  /** Whether to show the search bar (default: true) */
  showSearch?: boolean;
}

const DropdownModal = <T extends unknown>(props: DropdownModalProps<T>) => {
  const { visible, onClose, title, options, onSelect, initialValue, showSearch = true } = props;
  const [selected, setSelected] = useState<T | null>(initialValue ?? null);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleProceed = () => {
    if (selected !== null) {
      const selectedOption = options.find(o => o.value === selected);
      if (selectedOption) {
        onSelect(selectedOption);
      }
      onClose();
    }
  };

  return (
    <CommonModal
      visible={visible}
      onClose={onClose}
      title={title}
      content={
        <View style={styles.container}>
          {/* Search Box */}
          {showSearch && (
            <View style={styles.searchBox}>
              <Image source={require('../../assets/icons/search.png')} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#7a7676"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          )}
          <ScrollView style={styles.listContainer}>
            {filteredOptions.map(opt => (
              <TouchableOpacity
                key={String(opt.value)}
                style={[styles.item, selected === opt.value && styles.itemSelected]}
                onPress={() => setSelected(opt.value)}
              >
                <Text style={[styles.itemText, selected === opt.value && styles.itemTextSelected]}>{opt.label}</Text>
                {selected === opt.value && (
                  <Image source={require('../../assets/icons/check.png')} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selected !== null && (
            <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
              <Text style={styles.proceedText}>Proceed</Text>
            </TouchableOpacity>
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: verticalScale(8),
  },
  searchIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(8),
    tintColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
    color: '#0E1726',
    padding: 0,
  },
  listContainer: {
    maxHeight: '60%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemSelected: {
    backgroundColor: '#E1F3FF',
  },
  itemText: {
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(15),
    color: '#333',
  },
  itemTextSelected: {
    color: colors.primary,
    fontFamily: quicksandFonts.semiBold,
  },
  checkIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: colors.primary,
  },
  proceedButton: {
    backgroundColor: colors.primary,
    borderRadius: scale(12),
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  proceedText: {
    color: '#FFF',
    fontFamily: quicksandFonts.semiBold,
    fontSize: moderateScale(14),
  },
});

export default DropdownModal;
