// components/ToastContainer.tsx
import { Animated, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useToast } from '~/store/useToast';
import { deviceWidth } from '~/utils/global';
import AppText from './Elements/AppText';

export const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ReactNativeModal
      isVisible={true}
      animationIn="fadeInDown"
      animationOut="fadeOutUp"
      backdropOpacity={0}
      coverScreen
      hasBackdrop={false}
      statusBarTranslucent
      presentationStyle="overFullScreen"
      style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View className="mt-12 w-full flex-col items-center gap-2" pointerEvents="box-none">
        {toasts.map((toast, i) => (
          <Animated.View
            key={toast.id}
            className={'rounded-md elevation-sm border-l-8  border-r-8 bg-white px-3 py-2'}
            style={[
              { width: deviceWidth - 32 },

              toast.type === 'success' && { borderColor: '#4caf50' },
              toast.type === 'error' && { borderColor: '#f44336' },
              toast.type === 'info' && { borderColor: '#333' },
            ]}>
            <AppText className="text-left text-lg font-semibold text-secondary">{toast.heading}</AppText>
            <AppText className="text-left  text-primary">{toast.message}</AppText>
          </Animated.View>
        ))}
      </View>
    </ReactNativeModal>
  );
};
