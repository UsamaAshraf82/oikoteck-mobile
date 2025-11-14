// components/ToastContainer.tsx
import { XIcon } from 'phosphor-react-native';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
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
      style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View className="mt-12 w-full flex-col items-center gap-2 " pointerEvents="box-none">
        {toasts.map((toast, i) => (
          <>
            <Animated.View
              key={toast.id}
              // pointerEvents="none"
              className={
                'elevation-sm flex-row items-center justify-between rounded-md border-l-8  border-r-8 bg-white px-3 py-2'
              }
              style={[
                { width: deviceWidth - 32 },
                toast.type === 'success' && { borderColor: '#4caf50' },
                toast.type === 'error' && { borderColor: '#f44336' },
                toast.type === 'info' && { borderColor: '#333' },
              ]}>
              <View>
                <AppText className="text-left font-semibold text-lg text-secondary">
                  {toast.heading}
                </AppText>
                <AppText className="text-left  text-primary">{toast.message}</AppText>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  removeToast(toast.id);
                }}>
                <XIcon
                  // style={[
                  //   toast.type === 'success' && { backgroundColor: '#4caf50' },
                  //   toast.type === 'error' && { backgroundColor: '#f44336' },
                  //   toast.type === 'info' && { backgroundColor: '#333' },
                  // ]}
                  color={
                    '#82065e'
                    // toast.type === 'success'
                    //   ? '#4caf50'
                    //   : toast.type === 'error'
                    //     ? '#f44336'
                    //     : '#333'
                  }
                />
              </TouchableWithoutFeedback>
            </Animated.View>
          </>
        ))}
      </View>
    </ReactNativeModal>
  );
};
