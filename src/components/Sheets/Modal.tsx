import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import useModal from '~/store/useModalHelper';
import { deviceHeight } from '~/utils/global';

const ModalSheet = () => {
  const { opened: value } = useModal();
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    if (value !== null) {
      setLocalValue(value);
    }
  }, [value]);

  return (
    <Modal
      isVisible={value !== null}
      onBackdropPress={value?.onClose || localValue?.onClose}
      onSwipeComplete={value?.onClose || localValue?.onClose}
      swipeDirection='down'
      useNativeDriver
      useNativeDriverForBackdrop
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      hardwareAccelerated
      coverScreen={false}
      avoidKeyboard={false}
      style={styles.modal}
      propagateSwipe
      onModalHide={() => setLocalValue(null)}
    >
      {localValue && (
        <View
          style={[
            styles.container,
            {
              maxHeight: deviceHeight * 0.9,
            },
          ]}
        >
          <View style={styles.handle} />
          {localValue.modal}
        </View>
      )}
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
