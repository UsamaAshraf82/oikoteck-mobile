import { View } from 'react-native';
import Modal from 'react-native-modal';
import useModal from '~/store/useModalHelper';
import { deviceHeight } from '~/utils/global';
const Select = () => {
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
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        {value.modal }
      </View>
    </Modal>
  );
};

export default Select;
