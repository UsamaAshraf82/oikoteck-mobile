import { FlashList } from '@shopify/flash-list';
import { CheckCircleIcon, XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { isDeepEqual } from 'remeda';
import useSelect from '~/store/useSelectHelper';
import { deviceHeight } from '~/utils/global';
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
      coverScreen={false}
      avoidKeyboard={false}
      style={styles.modal}
      propagateSwipe>
      <View
        style={[
          styles.container,
          {
            maxHeight: deviceHeight * 0.9,
          },
        ]}>
        <View style={styles.handle} />
        {value.hasXIcon && (
          <TouchableNativeFeedback onPress={value.onClose}>
            <View style={styles.closeIcon}>
              <XIcon color="#1A2436" size={24} />
            </View>
          </TouchableNativeFeedback>
        )}
        <View style={styles.labelWrapper}>
          <AppText style={styles.labelText}>
            {value.label}
          </AppText>
        </View>
        {value.useFlatList ? (
          <View style={[styles.listWrapper, { height: deviceHeight * 0.9 - 80 }]}>
            <FlashList
              data={value.options}
              estimatedItemSize={38}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any, i: number) => i.toString()}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }: { item: any }) => {
                return (
                  <TouchableNativeFeedback onPress={() => value.onPress?.(item)}>
                    <View style={styles.optionWrapper}>
                      {typeof item.label === 'string' ? (
                        <AppText style={styles.optionText}>
                          {item.label}
                        </AppText>
                      ) : React.isValidElement(item.label) ? (
                        item.label
                      ) : null}
                      {isDeepEqual(item.value, value.value) && (
                        <CheckCircleIcon
                          size={25}
                          color="#82065e"
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
            {value.options.map((item: any, i: number) => {
              return (
                <TouchableNativeFeedback key={i} onPress={() => value.onPress?.(item)}>
                  <View style={styles.optionWrapper}>
                    {typeof item.label === 'string' ? (
                      <AppText style={styles.optionText}>
                        {item.label}
                      </AppText>
                    ) : React.isValidElement(item.label) ? (
                      item.label
                    ) : null}
                    {isDeepEqual(item.value, value.value) && (
                      <CheckCircleIcon
                        size={23}
                        color="#82065e"
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
  closeIcon: {
    position: 'absolute',
    right: 20,
    top: 24,
    zIndex: 10,
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  labelText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 20,
    color: '#192234',
  },
  listWrapper: {
    width: '100%',
  },
  optionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontFamily: 'LufgaMedium',
    fontSize: 18,
    color: '#192234',
  },
});

export default Select;
