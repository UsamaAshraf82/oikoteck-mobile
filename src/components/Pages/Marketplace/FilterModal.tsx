import { CaretDownIcon, XIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import AppText from '~/components/Elements/AppText';
import useSelect from '~/store/useSelectHelper';
import { Property_Type } from '~/type/property';
import { deviceHeight } from '~/utils/global';
import { numberminify, thoasandseprator } from '~/utils/number';
import { property_category } from '~/utils/property';
import Checkbox from '../../Elements/Checkbox';
import DatePicker from '../../Elements/DatePicker';
import PressableView from '../../HOC/PressableView';

export type filterType = {
  district: string | null;
  area_1: string | null;
  area_2: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSize: number | null;
  maxSize: number | null;
  minDate: Date | null;
  maxDate: Date | null;
  bedroom: number | null;
  furnished: boolean | null;
  bathroom: number | null;
  keywords: string | null;
  property_type: Property_Type['property_type'] | null;
  property_category: Property_Type['property_category'] | null;
};

type Props = {
  listing_type: 'Rental' | 'Sale';
  visible: boolean;
  onClose: () => void;
  onPress: (data: filterType) => void;
  value: filterType;
};

const FilterModal = ({ visible, onClose, value, onPress, listing_type }: Props) => {
  const [filter, setFilters] = useState<filterType>(value);
  const { openSelect } = useSelect();
  const changeSearch = (f: Partial<filterType>) => {
    setFilters((i) => ({ ...i, ...f }));
  };

  useEffect(() => {
    setFilters(value);
  }, [value]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      hardwareAccelerated
      coverScreen={false}
      avoidKeyboard={false}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            height: deviceHeight * 0.8,
          },
        ]}>
        <View style={styles.handle} />
        <View style={styles.content}>
          <View style={styles.header}>
            <AppText style={styles.headerTitle}>Filters</AppText>
            <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
              <View>
                <XIcon color="#192234" size={24} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ maxHeight: deviceHeight * 0.775 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Price Range</AppText>
                <View style={styles.row}>
                  <PressableView
                    onPress={() => {
                      let options = [
                        { label: 'No Min', value: null },
                        ...Array(14)
                          .fill(0)
                          .map((_, i) => ({
                            label: '€ ' + thoasandseprator(500 * (i + 1)),
                            value: 500 * (i + 1),
                          })),
                      ];

                      if (listing_type === 'Sale') {
                        options = [
                          { label: 'No Min', value: null },
                          ...Array(40)
                            .fill(0)
                            .map((_, i) => ({
                              label: '€ ' + numberminify(25000 * (i + 1)),
                              value: 25000 * (i + 1),
                            })),
                        ];
                      }
                      openSelect({
                        label: 'Min Price',
                        options: options,
                        onPress: (e: any) => {
                          changeSearch({ minPrice: e.value as number | null });
                        },
                      });
                    }}
                    style={styles.inputBox}>
                    <View style={styles.inputInner}>
                      <AppText
                        style={[
                          styles.inputText,
                          { color: filter.minPrice === null ? '#8D95A5' : '#192234' },
                        ]}>
                        {filter.minPrice
                          ? listing_type === 'Sale'
                            ? '€ ' + numberminify(filter.minPrice)
                            : '€ ' + thoasandseprator(filter.minPrice)
                          : 'No Min'}
                      </AppText>
                      <CaretDownIcon color="#8D95A5" size={16} />
                    </View>
                  </PressableView>
                  <AppText style={styles.separator}> - </AppText>
                  <PressableView
                    style={styles.inputBox}
                    onPress={() => {
                      let options = [
                        { label: 'No Max', value: null },
                        ...Array(14)
                          .fill(0)
                          .map((_, i) => ({
                            label: '€ ' + thoasandseprator(500 * (i + 1)),
                            value: 500 * (i + 1),
                          })),
                      ];

                      if (listing_type === 'Sale') {
                        options = [
                          { label: 'No Max', value: null },
                          ...Array(40)
                            .fill(0)
                            .map((_, i) => ({
                              label: '€ ' + numberminify(25000 * (i + 1)),
                              value: 25000 * (i + 1),
                            })),
                        ];
                      }
                      openSelect({
                        label: 'Max Price',
                        options: options,
                        onPress: (e: any) => {
                          changeSearch({ maxPrice: e.value as number | null });
                        },
                      });
                    }}>
                    <View style={styles.inputInner}>
                      <AppText
                        style={[
                          styles.inputText,
                          { color: filter.maxPrice === null ? '#8D95A5' : '#192234' },
                        ]}>
                        {filter.maxPrice
                          ? listing_type === 'Sale'
                            ? '€ ' + numberminify(filter.maxPrice)
                            : '€ ' + thoasandseprator(filter.maxPrice)
                          : 'No Max'}
                      </AppText>
                      <CaretDownIcon color="#8D95A5" size={16} />
                    </View>
                  </PressableView>
                </View>
              </View>
              {/* Size */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Size</AppText>
                <View style={styles.row}>
                  <PressableView
                    onPress={() => {
                      let options = [
                        { label: 'No Min', value: null },
                        ...[
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                        ].map((i) => ({
                          label: thoasandseprator(i * 50) + ' m²',
                          value: i * 50,
                        })),
                      ];

                      openSelect({
                        label: 'Min Size',
                        options: options,
                        onPress: (e: any) => {
                          changeSearch({ minSize: e.value as number | null });
                        },
                      });
                    }}
                    style={styles.inputBox}>
                    <View style={styles.inputInner}>
                      <AppText
                        style={[
                          styles.inputText,
                          { color: filter.minSize === null ? '#8D95A5' : '#192234' },
                        ]}>
                        {filter.minSize ? numberminify(filter.minSize) + ' m²' : 'No Min'}
                      </AppText>
                      <CaretDownIcon color="#8D95A5" size={16} />
                    </View>
                  </PressableView>
                  <AppText style={styles.separator}> - </AppText>
                  <PressableView
                    style={styles.inputBox}
                    onPress={() => {
                      let options = [
                        { label: 'No Min', value: null },
                        ...[
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                        ].map((i) => ({
                          label: thoasandseprator(i * 50) + ' m²',
                          value: i * 50,
                        })),
                      ];

                      openSelect({
                        label: 'Max Size',
                        options: options,
                        onPress: (e: any) => {
                          changeSearch({ maxSize: e.value as number | null });
                        },
                      });
                    }}>
                    <View style={styles.inputInner}>
                      <AppText
                        style={[
                          styles.inputText,
                          { color: filter.maxSize === null ? '#8D95A5' : '#192234' },
                        ]}>
                        {filter.maxSize ? numberminify(filter.maxSize) + ' m²' : 'No Max'}
                      </AppText>
                      <CaretDownIcon color="#8D95A5" size={16} />
                    </View>
                  </PressableView>
                </View>
              </View>
              {/* Bedrooms */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Bedrooms (R) / Rooms (C)</AppText>
                <View style={styles.segmentedRow}>
                  {[
                    { label: 'Any', value: null },
                    { label: '1+', value: 1 },
                    { label: '2+', value: 2 },
                    { label: '3+', value: 3 },
                    { label: '4+', value: 4 },
                    { label: '5+', value: 5 },
                  ].map((item, i, arr) => {
                    const isActive = filter.bedroom === item.value;
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bedroom: item.value })}
                        style={
                          [
                            styles.segmentedButton,
                            i === 0 ? styles.segmentedLeft : {},
                            i === arr.length - 1 ? styles.segmentedRight : {},
                            isActive ? styles.segmentedActive : {},
                          ] as any
                        }>
                        <AppText
                          style={
                            [styles.segmentedText, isActive ? styles.textSecondary : {}] as any
                          }>
                          {item.label}
                        </AppText>
                      </PressableView>
                    );
                  })}
                </View>
              </View>
              {/* Bathrooms */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Bathrooms</AppText>
                <View style={styles.segmentedRow}>
                  {[
                    { label: 'Any', value: null },
                    { label: '1+', value: 1 },
                    { label: '2+', value: 2 },
                    { label: '3+', value: 3 },
                    { label: '4+', value: 4 },
                    { label: '5+', value: 5 },
                  ].map((item, i, arr) => {
                    const isActive = filter.bathroom === item.value;
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bathroom: item.value })}
                        style={
                          [
                            styles.segmentedButton,
                            i === 0 ? styles.segmentedLeft : {},
                            i === arr.length - 1 ? styles.segmentedRight : {},
                            isActive ? styles.segmentedActive : {},
                          ] as any
                        }>
                        <AppText
                          style={
                            [styles.segmentedText, isActive ? styles.textSecondary : {}] as any
                          }>
                          {item.label}
                        </AppText>
                      </PressableView>
                    );
                  })}
                </View>
              </View>
              {/* Furnished */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Furnished</AppText>
                <View style={styles.tabRow}>
                  {[
                    { label: 'Any', value: null },
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ].map((item) => {
                    const isActive = filter.furnished === item.value;
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ furnished: item.value })}
                        style={[styles.tabButton, isActive ? styles.tabActive : {}] as any}>
                        <AppText
                          style={[styles.tabText, isActive ? styles.textPrimary : {}] as any}>
                          {item.label}
                        </AppText>
                      </PressableView>
                    );
                  })}
                </View>
              </View>

              {/* Date Range */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Min. Move-in Date</AppText>
                <View style={styles.dateWrapper}>
                  <DatePicker
                    style={styles.datePicker}
                    value={filter.minDate}
                    onChange={(date: Date | null) => changeSearch({ minDate: date })}
                  />
                </View>
              </View>
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Max. Move-in Date</AppText>
                <View style={styles.dateWrapper}>
                  <DatePicker
                    style={styles.datePicker}
                    value={filter.maxDate}
                    onChange={(date: Date | null) => changeSearch({ maxDate: date })}
                  />
                </View>
              </View>

              {/* Keywords */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Keywords</AppText>
                <TextInput
                  style={styles.keywordInput}
                  placeholder="Pool, Gym, Solar Panel etc."
                  placeholderTextColor="#8D95A5"
                  value={filter.keywords || undefined}
                  onChangeText={(text) => changeSearch({ keywords: text })}
                />
              </View>

              {/* Property Type */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Property Type</AppText>
                <View style={styles.checkGroup}>
                  {[
                    { label: 'Residential (R)', value: 'Residential' },
                    { label: 'Commercial (C)', value: 'Commercial' },
                    { label: 'Land', value: 'Land' },
                    { label: 'Any', value: null },
                  ].map((item) => (
                    <Checkbox
                      label={item.label}
                      key={item.label}
                      labelStyle={{ marginLeft: 8 }}
                      value={filter.property_type === item.value}
                      onChange={() =>
                        changeSearch({
                          property_type: item.value as Property_Type['property_type'] | null,
                        })
                      }
                    />
                  ))}
                </View>
              </View>

              {/* Property Category */}
              <View style={styles.section}>
                <AppText style={styles.sectionLabel}>Property Category</AppText>
                <View style={styles.checkGroup}>
                  {property_category(filter.property_type, true).map((item) => (
                    <Checkbox
                      label={item === null ? 'Any' : item}
                      key={item || 'any'}
                      labelStyle={{ marginLeft: 8 }}
                      value={filter.property_category === item}
                      onChange={() =>
                        changeSearch({
                          property_category: item as Property_Type['property_category'] | null,
                        })
                      }
                    />
                  ))}
                </View>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
        <View style={styles.footer}>
          <PressableView
            style={styles.resetButton}
            onPress={() => {
              onPress({
                district: value.district,
                area_1: value.area_1,
                area_2: value.area_2,
                minPrice: null,
                maxPrice: null,
                minSize: null,
                maxSize: null,
                minDate: null,
                maxDate: null,
                bedroom: null,
                furnished: null,
                bathroom: null,
                keywords: null,
                property_type: null,
                property_category: null,
              });
            }}>
            <AppText style={styles.resetText}>Reset All</AppText>
          </PressableView>
          <PressableView
            style={styles.applyButton}
            onPress={() => {
              onPress(filter);
            }}>
            <AppText style={styles.applyText}>Apply Filter</AppText>
          </PressableView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  handle: {
    marginBottom: 12,
    height: 4,
    width: 40,
    alignSelf: 'center',
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
    flex: 1,
  },
  section: {
    marginTop: 28,
  },
  sectionLabel: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    height: 56,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  inputInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 4,
    fontSize: 24,
    color: '#8D95A5',
  },
  segmentedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentedButton: {
    height: 56,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  segmentedLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  segmentedRight: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  segmentedActive: {
    borderColor: '#82065e',
    backgroundColor: 'rgba(130, 6, 94, 0.1)',
  },
  segmentedText: {
    fontSize: 14,
  },
  textSecondary: {
    color: '#82065e',
  },
  textPrimary: {
    color: '#192234',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: '#F6F8FA',
    padding: 4,
  },
  tabButton: {
    height: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: '#868C98',
  },
  dateWrapper: {
    marginTop: 4,
    flexDirection: 'row',
  },
  datePicker: {
    height: 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  keywordInput: {
    height: 48,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#192234',
  },
  checkGroup: {
    marginTop: 4,
    gap: 12,
  },
  footer: {
    marginTop: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    marginRight: 8,
    height: 48,
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: '#192234',
    fontFamily: 'LufgaBold',
    fontSize: 15,
  },
  applyButton: {
    marginLeft: 8,
    height: 48,
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#82065e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: 'white',
    fontFamily: 'LufgaBold',
    fontSize: 15,
  },
});

export default FilterModal;
