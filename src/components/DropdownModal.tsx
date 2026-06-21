import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import CommonModal from './CommonModal';
import { scale, verticalScale, moderateScale } from '../theme/scaling';
import { quicksandFonts } from '../theme/typography';
import { colors } from '../theme/colors';
import { IMAGES } from '../theme/images';

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
  /** Whether to allow 'Others' option */
  others?: boolean;
  /** Optional validation type for custom input */
  validationType?: 'countryCode' | 'none';
}

const DropdownModal = <T extends unknown>(props: DropdownModalProps<T>) => {
  const { visible, onClose, title, options, onSelect, initialValue, showSearch = true, others = false, validationType = 'none' } = props;
  const [selected, setSelected] = useState<T | null>(initialValue ?? null);
  const [search, setSearch] = useState('');
  const [customOption, setCustomOption] = useState('');

  let filteredOptions = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  if (others) {
    filteredOptions = [...filteredOptions, { label: 'Others', value: '___OTHERS___' as unknown as T }];
  }

  const handleProceed = () => {
    if (selected === '___OTHERS___' as unknown as T) {
      let customVal = customOption.trim();
      if (customVal !== '') {
        if (validationType === 'countryCode') {
          if (!customVal.startsWith('+')) {
            customVal = '+' + customVal;
          }
          const isValidCountryCode = /^\+[1-9]\d{0,3}$/.test(customVal);
          if (!isValidCountryCode) {
            Toast.show({
              type: 'error',
              text1: 'Invalid Input',
              text2: 'Enter valid country code',
            });
            return;
          }
        }
        onSelect({ label: customVal, value: customVal as unknown as T });
        onClose();
      }
      return;
    }
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
      scrollEnabled={false}
      modalHeight="75%"
      content={
        <View style={styles.container}>
          {/* Search Box */}
          {showSearch && (
            <View style={styles.searchBox}>
              <Image source={IMAGES.search} style={styles.searchIcon} />
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
                  <Image source={IMAGES.check} style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selected === ('___OTHERS___' as unknown as T) && (
            <TextInput
              style={styles.customInput}
              placeholder="Enter custom option..."
              placeholderTextColor="#7a7676"
              value={customOption}
              onChangeText={setCustomOption}
            />
          )}
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
    flex: 1,
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
  customInput: {
    fontFamily: quicksandFonts.regular,
    fontSize: moderateScale(14),
    color: '#0E1726',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(12),
  },
});

export default DropdownModal;
