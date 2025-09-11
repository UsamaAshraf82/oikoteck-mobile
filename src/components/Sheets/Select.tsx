import { CheckCircleIcon } from 'phosphor-react-native';
import React from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { isDeepEqual } from 'remeda';
import useSelect from '~/store/useSelectHelper';
import { deviceHeight } from '~/utils/global';
import tailwind from '~/utils/tailwind';
const Select = () => {
  const { value } = useSelect();

  if (value === null) return null;

  console.log(value.value);
  return (
    <Modal
      isVisible={value !== null}
      onBackdropPress={value.onClose}
      onSwipeComplete={value.onClose}
      swipeDirection="down"
      hardwareAccelerated
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}
      >
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="flex-row items-center justify-center">
          <Text className="text-xl font-semibold">{value.label}</Text>
        </View>
        <ScrollView>
          {value.options.map((item) => (
            <TouchableNativeFeedback key={item.label} onPress={() => value.onPress?.(item)}>
              <View className="py-2 flex-row justify-between ">
                <Text className="text-lg font-medium text-primary">{item.label}</Text>
                {isDeepEqual(item.value, value.value) &&<CheckCircleIcon size={25} color={tailwind.theme.colors.secondary} weight='fill' />}
              </View>
            </TouchableNativeFeedback>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default Select;
