import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
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
        <View className="flex-1 bg-white text-black">
          <StatusBar style="dark" animated networkActivityIndicatorVisible />
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1">
              <KeyboardAvoidingView className="flex-1">{children}</KeyboardAvoidingView>
            </SafeAreaView>
          </SafeAreaProvider>
        </View>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};
// const KeyboardAvoidingViewP = ({ children }: PropsWithChildren) => {
//   return <KeyboardAvoidingView style={{ flex: 1 }}>{children}</KeyboardAvoidingView>;
// };

export default Provider;
