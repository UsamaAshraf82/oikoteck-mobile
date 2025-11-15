import { FlashList } from '@shopify/flash-list';
import { CheckCircleIcon, XIcon } from 'phosphor-react-native';
import React from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { isDeepEqual } from 'remeda';
import { cn } from '~/lib/utils';
import useSelect from '~/store/useSelectHelper';
import { deviceHeight } from '~/utils/global';
import tailwind from '~/utils/tailwind';
import AppText from '../Elements/AppText';
const Select = () => {
  const { opened: value } = useSelect();

  if (value === null) return null;

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
        }}>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        {value.hasXIcon && (
          <TouchableNativeFeedback onPress={value.onClose}>
            <View className="absolute right-5 top-6">
              <XIcon color="#1A2436 " />
            </View>
          </TouchableNativeFeedback>
        )}
        <View
          className={cn('flex-row items-center justify-center', value.className?.label?.wrapper)}>
          <AppText className={cn('font-semibold text-xl', value.className?.label?.text)}>
            {value.label}
          </AppText>
        </View>
        {value.useFlatList ? (
          <View style={{ height: deviceHeight * 0.9 - 80 }} className=" w-full">
            <FlashList
              data={value.options}
              estimatedItemSize={38}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, i) => i.toString()}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => {
                return (
                  <TouchableNativeFeedback onPress={() => value.onPress?.(item)}>
                    <View
                      className={cn(
                        'flex-row justify-between py-2 ',
                        value.className?.option_label?.wrapper
                      )}>
                      {typeof item.label === 'string' ? (
                        <AppText
                          className={cn(
                            'font-medium text-lg text-primary',
                            value.className?.option_label?.text
                          )}>
                          {item.label}
                        </AppText>
                      ) : React.isValidElement(item.label) ? (
                        item.label
                      ) : null}
                      {isDeepEqual(item.value, value.value) && (
                        <CheckCircleIcon
                          size={25}
                          color={tailwind.theme.colors.secondary}
                          weight="fill"
                        />
                      )}
                    </View>
                  </TouchableNativeFeedback>
                );
              }}
            />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            {value.options.map((item, i) => {
              return (
                <TouchableNativeFeedback key={i} onPress={() => value.onPress?.(item)}>
                  <View
                    className={cn(
                      'flex-row justify-between items-center py-2 items ',
                      value.className?.option_label?.wrapper
                    )}>
                    {typeof item.label === 'string' ? (
                      <AppText
                        className={cn(
                          'font-medium text-lg leading-none text-primary',
                          value.className?.option_label?.text
                        )}>
                        {item.label}
                      </AppText>
                    ) : React.isValidElement(item.label) ? (
                      item.label
                    ) : null}
                    {isDeepEqual(item.value, value.value) && (
                      <CheckCircleIcon
                        size={23}
                        color={tailwind.theme.colors.secondary}
                        weight="fill"
                      />
                    )}
                  </View>
                </TouchableNativeFeedback>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default Select;
