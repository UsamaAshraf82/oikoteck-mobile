import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
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
        <View style={styles.header}>
          <AppText style={styles.headerText}>{value.label}</AppText>
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
                if (item.display === false) return null;
                return (
                  <TouchableNativeFeedback onPress={() => item.onPress?.()}>
                    <View style={styles.optionRow}>
                      {React.isValidElement(item.icon) ? item.icon : null}
                      {typeof item.label === 'string' ? (
                        <AppText style={styles.optionText}>{item.label}</AppText>
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
            {value.options.map((item: any, i: number) => {
              if (item.display === false) return null;
              return (
                <TouchableNativeFeedback key={i} onPress={() => item.onPress?.()}>
                  <View style={styles.optionRow}>
                    {React.isValidElement(item.icon) ? item.icon : null}
                    {typeof item.label === 'string' ? (
                      <AppText style={styles.optionText}>{item.label}</AppText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 20,
    color: '#192234',
  },
  listWrapper: {
    width: '100%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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

export default Menu;
