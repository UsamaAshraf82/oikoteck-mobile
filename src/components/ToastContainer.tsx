// components/ToastContainer.tsx
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReactNativeModal from 'react-native-modal';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useToast } from '~/store/useToast';
import { deviceWidth } from '~/utils/global';
import AppText from './Elements/AppText';

const DISMISS_THRESHOLD = 100;

const ToastItem = ({ toast, removeToast }: { toast: any; removeToast: (id: string) => void }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > DISMISS_THRESHOLD) {
        translateX.value = withTiming(event.translationX > 0 ? deviceWidth : -deviceWidth, {}, () => {
          runOnJS(removeToast)(toast.id);
        });
        opacity.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={toast.id}
        style={[
          styles.toastItem,
          toast.type === 'success' && styles.successBorder,
          toast.type === 'error' && styles.errorBorder,
          toast.type === 'info' && styles.infoBorder,
          animatedStyle,
        ]}>
        <View style={styles.textContent}>
          <AppText style={styles.heading}>{toast.heading}</AppText>
          <AppText style={styles.message}>{toast.message}</AppText>
        </View>

      </Animated.View>
    </GestureDetector>
  );
};

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
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
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
