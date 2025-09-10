import { XIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { cn } from '~/lib/utils';
import useSelect from '~/store/useSelectHelper';
import { Property_Type } from '~/type/property';
import { deviceHeight } from '~/utils/global';
import { numberminify, thoasandseprator } from '~/utils/number';
import PressableView from '../HOC/PressableView';

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
  // const [dropdownFilter, setDropDownFilter] = useState<filterType>(value);
  const { open: openSelect } = useSelect();
  const changeSearch = (filter: Partial<filterType>) => {
    setFilters((i) => ({ ...i, ...filter }));
  };

  useEffect(() => {
    setFilters(value);
  }, [value]);

  console.log(listing_type);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      hardwareAccelerated
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          height: deviceHeight * 0.9,
        }}>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-primary">Filters</Text>
            <TouchableNativeFeedback onPress={onClose}>
              <XIcon />
            </TouchableNativeFeedback>
          </View>
          <ScrollView>
            {/* Price Range */}
            <View className="mt-4">
              <Text className="text-lg font-medium text-primary">Price Range</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <TouchableNativeFeedback
                  onPress={() => {
                    let options = [
                      { label: 'No Min', value: null },
                      // { label: "€ " + "0", value: "0" },
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
                        // { label: "€ " + "0", value: "0" },
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

                      onPress: (e) => {
                        changeSearch({ minPrice: e.value as number | null });
                      },
                    });
                  }}>
                  <View className="flex-1  items-center justify-center  rounded-xl border border-gray-200 py-2">
                    {listing_type === 'Sale' ? (
                      <Text>
                        {filter.minPrice ? '€ ' + numberminify(filter.minPrice) : 'No Min'}
                      </Text>
                    ) : (
                      <Text>
                        {filter.minPrice ? '€ ' + thoasandseprator(filter.minPrice) : 'No Min'}
                      </Text>
                    )}
                  </View>
                </TouchableNativeFeedback>
                <Text className="mx-1 text-4xl"> - </Text>
                <TouchableNativeFeedback
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

                      onPress: (e) => {
                        changeSearch({ maxPrice: e.value as number | null });
                      },
                    });
                  }}>
                  <View className="flex-1  items-center justify-center  rounded-xl border border-gray-200 py-2">
                    {listing_type === 'Sale' ? (
                      <Text>
                        {filter.maxPrice ? '€ ' + numberminify(filter.maxPrice) : 'No Max'}
                      </Text>
                    ) : (
                      <Text>
                        {filter.maxPrice ? '€ ' + thoasandseprator(filter.maxPrice) : 'No Max'}
                      </Text>
                    )}
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            {/* Size */}
            <View className="mt-4">
              <Text className="text-lg font-medium text-primary">Size</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <TouchableNativeFeedback
                  onPress={() => {
                    let options = [
                      { label: 'No Min', value: null },
                      // { label: "€ " + "0", value: "0" },
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
                      onPress: (e) => {
                        changeSearch({ minSize: e.value as number | null });
                      },
                    });
                  }}>
                  <View className="flex-1  items-center justify-center  rounded-xl border border-gray-200 py-2">
                    <Text>{filter.minSize ? numberminify(filter.minPrice) + ' m²' : 'No Min'}</Text>
                  </View>
                </TouchableNativeFeedback>
                <Text className="mx-1 text-4xl"> - </Text>
                <TouchableNativeFeedback
                  onPress={() => {
                    let options = [
                      { label: 'No Min', value: null },
                      // { label: "€ " + "0", value: "0" },
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
                      onPress: (e) => {
                        changeSearch({ maxSize: e.value as number | null });
                      },
                    });
                  }}>
                  <View className="flex-1  items-center justify-center  rounded-xl border border-gray-200 py-2">
                    <Text>{filter.maxSize ? numberminify(filter.maxSize) + ' m²' : 'No Max'}</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            {/* Bedrooms */}
            <View className="mt-4">
              <Text className="text-lg font-medium text-primary">Bedrooms (R) / Rooms (C)</Text>
              <View className="mt-2 flex-row items-center justify-between">
                {[
                  { label: 'Any', value: null },
                  { label: '1+', value: 1 },
                  { label: '2+', value: 2 },
                  { label: '3+', value: 3 },
                  { label: '4+', value: 4 },
                  { label: '5+', value: 5 },
                ].map((item, i, arr) => {
                  if (i === 0) {
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bedroom: item.value })}
                        className={cn(
                          'h-10 flex-1 items-center  justify-center rounded-l-xl  border border-gray-200',
                          {
                            'border-secondary bg-secondary/10 ': filter.bedroom === item.value,
                          }
                        )}>
                        <Text
                          className={cn({
                            ' text-secondary': filter.bedroom === item.value,
                          })}>
                          {item.label}
                        </Text>
                      </PressableView>
                    );
                  }
                  if (i === arr.length - 1) {
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bedroom: item.value })}
                        className={cn(
                          'h-10 flex-1 items-center  justify-center rounded-r-xl  border border-gray-200',
                          {
                            'border-secondary bg-secondary/10 ': filter.bedroom === item.value,
                          }
                        )}>
                        <Text
                          className={cn({
                            ' text-secondary': filter.bedroom === item.value,
                          })}>
                          {item.label}
                        </Text>
                      </PressableView>
                    );
                  }
                  return (
                    <PressableView
                      key={item.label}
                      onPress={() => changeSearch({ bedroom: item.value })}
                      className={cn(
                        'h-10 flex-1 items-center  justify-center   border border-gray-200',
                        {
                          'border-secondary bg-secondary/10 ': filter.bedroom === item.value,
                        }
                      )}>
                      <Text
                        className={cn({
                          ' text-secondary': filter.bedroom === item.value,
                        })}>
                        {item.label}
                      </Text>
                    </PressableView>
                  );
                })}
              </View>
            </View>
            {/* Bathrooms */}
            <View className="mt-4">
              <Text className="text-lg font-medium text-primary">Bathrooms</Text>
              <View className="mt-2 flex-row items-center justify-between">
                {[
                  { label: 'Any', value: null },
                  { label: '1+', value: 1 },
                  { label: '2+', value: 2 },
                  { label: '3+', value: 3 },
                  { label: '4+', value: 4 },
                  { label: '5+', value: 5 },
                ].map((item, i, arr) => {
                  if (i === 0) {
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bathroom: item.value })}
                        className={cn(
                          'h-10 flex-1 items-center  justify-center rounded-l-xl  border border-gray-200',
                          {
                            'border-secondary bg-secondary/10 ': filter.bathroom === item.value,
                          }
                        )}>
                        <Text
                          className={cn({
                            ' text-secondary': filter.bathroom === item.value,
                          })}>
                          {item.label}
                        </Text>
                      </PressableView>
                    );
                  }
                  if (i === arr.length - 1) {
                    return (
                      <PressableView
                        key={item.label}
                        onPress={() => changeSearch({ bathroom: item.value })}
                        className={cn(
                          'h-10 flex-1 items-center  justify-center rounded-r-xl  border border-gray-200',
                          {
                            'border-secondary bg-secondary/10 ': filter.bathroom === item.value,
                          }
                        )}>
                        <Text
                          className={cn({
                            ' text-secondary': filter.bathroom === item.value,
                          })}>
                          {item.label}
                        </Text>
                      </PressableView>
                    );
                  }
                  return (
                    <PressableView
                      key={item.label}
                      onPress={() => changeSearch({ bathroom: item.value })}
                      className={cn(
                        'h-10 flex-1 items-center  justify-center border border-gray-200',
                        {
                          'border-secondary bg-secondary/10 ': filter.bathroom === item.value,
                        }
                      )}>
                      <Text
                        className={cn({
                          ' text-secondary': filter.bathroom === item.value,
                        })}>
                        {item.label}
                      </Text>
                    </PressableView>
                  );
                })}
              </View>
            </View>
            {/* Furnished */}
            <View className="mt-4">
              <Text className="text-lg font-medium text-primary">Furnished</Text>
              <View className="mt-2 flex-row items-center justify-between rounded-lg bg-[#F6F8FA] p-2">
                {[
                  { label: 'Any', value: null },
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ].map((item) => {
                  return (
                    <PressableView
                      key={item.label}
                      onPress={() => changeSearch({ furnished: item.value })}
                      className={cn('h-10 flex-1 items-center   justify-center rounded-lg ', {
                        'border border-gray-200 bg-white': filter.furnished === item.value,
                      })}>
                      <Text
                        className={cn('text-[#868C98]', {
                          'text-primary': filter.furnished === item.value,
                        })}>
                        {item.label}
                      </Text>
                    </PressableView>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View className="flex-row justify-between">
            <PressableView
              className="mr-0.5 h-10 flex-1 overflow-hidden rounded-full border border-gray-200"
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
              <Text className="text-primary">Reset All</Text>
            </PressableView>
            <PressableView
              className="ml0.5 h-10 flex-1 overflow-hidden rounded-full border border-gray-200 bg-secondary"
              onPress={() => {
                onPress(filter);
              }}>
              <Text className="text-white">Apply Filter</Text>
            </PressableView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
