// components/ToastContainer.tsx
import { XIcon } from 'phosphor-react-native';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Animated from 'react-native-reanimated';
import { useToast } from '~/store/useToast';
import { deviceWidth } from '~/utils/global';
import AppText from './Elements/AppText';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ReactNativeModal
      isVisible={true}
      animationIn="fadeInDown"
      animationOut="fadeOutUp"
      backdropOpacity={0}
      coverScreen={false}
      hasBackdrop={false}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      pointerEvents="box-none"
      hardwareAccelerated
      propagateSwipe
      style={styles.modal}>
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast: any) => (
          <Animated.View
            key={toast.id}
            style={[
              styles.toastItem,
              toast.type === 'success' && styles.successBorder,
              toast.type === 'error' && styles.errorBorder,
              toast.type === 'info' && styles.infoBorder,
            ]}>
            <View style={styles.textContent}>
              <AppText style={styles.heading}>{toast.heading}</AppText>
              <AppText style={styles.message}>{toast.message}</AppText>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                removeToast(toast.id);
              }}>
              <XIcon color="#82065e" />
            </TouchableWithoutFeedback>
          </Animated.View>
        ))}
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 99999,
  },
  container: {
    marginTop: 48,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  toastItem: {
    width: deviceWidth - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // elevation-sm
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  successBorder: {
    borderColor: '#4caf50',
  },
  errorBorder: {
    borderColor: '#f44336',
  },
  infoBorder: {
    borderColor: '#333',
  },
  textContent: {
    flex: 1,
  },
  heading: {
    textAlign: 'left',
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  message: {
    textAlign: 'left',
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#192234',
  },
});
