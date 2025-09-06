import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
              <KeyboardAvoidingViewP>
                {children}
                {/* c</BottomSheetModalProvider> */}
              </KeyboardAvoidingViewP>
            </SafeAreaView>
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};
const KeyboardAvoidingViewP = ({ children }: PropsWithChildren) => {
  const isKeyboardVisible = useKeyboardVisible();

  if (Platform.OS === 'ios') {
    return children;
  }

  return (
    <KeyboardAvoidingView enabled={isKeyboardVisible} behavior={'height'} style={{ flex: 1 }}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default Provider;

const useKeyboardVisible = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const handleKeyboardShow = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardVisible;
};
