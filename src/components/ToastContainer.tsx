// components/ToastContainer.tsx
import { XIcon } from 'phosphor-react-native';
import { TouchableWithoutFeedback, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Animated from 'react-native-reanimated';
import { useToast } from '~/store/useToast';
import { deviceWidth } from '~/utils/global';
import AppText from './Elements/AppText';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;
  // return (
  //   <Modal
  //     // transparent={true}
  //     animationType="none"
  //     presentationStyle="overFullScreen"
  //     statusBarTranslucent

  //     hardwareAccelerated>
  //     {/* Modal root ALWAYS blocks touches — MUST wrap it in a View with pointerEvents=none */}
  //     <View
  //       pointerEvents="none"
  //       style={{
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //       }}>
  //       {/* Toast container receives touches only on the toast itself */}
  //       <View
  //         pointerEvents="box-none"
  //         style={{
  //           marginTop: 60,
  //           width: '100%',
  //           alignItems: 'center',
  //         }}>
  //         {toasts.map((toast) => (
  //           <View
  //             key={toast.id}
  //             pointerEvents="auto"
  //             style={{
  //               width: deviceWidth - 32,
  //               padding: 12,
  //               borderRadius: 8,
  //               backgroundColor: 'white',
  //               elevation: 5,
  //             }}>
  //             <AppText>{toast.heading}</AppText>
  //             <AppText>{toast.message}</AppText>

  //             <TouchableOpacity onPress={() => removeToast(toast.id)}>
  //               <XIcon color="#82065e" />
  //             </TouchableOpacity>
  //           </View>
  //         ))}
  //       </View>
  //     </View>
  //   </Modal>
  // );

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
      style={{ margin: 0, justifyContent: 'flex-start', alignItems: 'center', zIndex: 99999 }}>
      <View className="mt-12 w-full flex-col items-center gap-2 " pointerEvents="box-none">
        {toasts.map((toast, i) => (
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
        ))}
      </View>
    </ReactNativeModal>
  );
};
