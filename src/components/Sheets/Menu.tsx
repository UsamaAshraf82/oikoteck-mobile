import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ScrollView, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import useMenu from '~/store/useMenuHelper';
import { deviceHeight } from '~/utils/global';
import AppText from '../Elements/AppText';
const Menu = () => {
  const { opened: value } = useMenu();

  if (value === null) return null;

  return (
    <Modal
      isVisible={value !== null}
      onBackdropPress={value.onClose}
      onSwipeComplete={value.onClose}
      swipeDirection="down"
      hardwareAccelerated
        coverScreen={false}
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="flex-row items-center justify-center">
          <AppText className="font-semibold text-xl">{value.label}</AppText>
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
                if (!item.display) return null;
                return (
                  <TouchableNativeFeedback onPress={() => item.onPress?.()}>
                    <View className="flex-row gap-2 py-2 ">
                      {React.isValidElement(item.icon) ? item.icon : null}
                      {typeof item.label === 'string' ? (
                        <AppText className="font-medium text-lg text-primary">{item.label}</AppText>
                      ) : React.isValidElement(item.label) ? (
                        item.label
                      ) : null}
                    </View>
                  </TouchableNativeFeedback>
                );
              }}
            />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            {value.options.map((item, i) => {
              if (!item.display) return null;
              return (
                <TouchableNativeFeedback key={i} onPress={() => item.onPress?.()}>
                  <View className="flex-row gap-2 py-2 ">
                    {React.isValidElement(item.icon) ? item.icon : null}
                    {typeof item.label === 'string' ? (
                      <AppText className="font-medium text-lg text-primary">{item.label}</AppText>
                    ) : React.isValidElement(item.label) ? (
                      item.label
                    ) : null}
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

export default Menu;
