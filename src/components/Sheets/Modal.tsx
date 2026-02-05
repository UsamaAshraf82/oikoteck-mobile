import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import useModal from '~/store/useModalHelper';
import { deviceHeight } from '~/utils/global';

const ModalSheet = () => {
  const { opened: value } = useModal();

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
        {value.modal}
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
});

export default ModalSheet;
