import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import { Property_Type } from '~/type/property';

const { height } = Dimensions.get('window');

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
  visible: boolean;
  onClose: () => void;
  onPress: (data: filterType) => void;
  value: filterType;
};

const FilterModal = ({ visible, onClose, value, onPress }: Props) => {
  const [filter, setFilters] = useState<filterType>(value);

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
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        style={{
          height: height * 0.9,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: 10,
        }}>
          <ScrollView>

          </ScrollView>

      </View>
    </Modal>
  );
};

export default FilterModal;
