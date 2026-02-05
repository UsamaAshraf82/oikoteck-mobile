import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.flex1}>
        <KeyboardProvider>
          <View style={styles.container}>
            <StatusBar style="dark" animated networkActivityIndicatorVisible />
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.flex1}>
                <View style={styles.content}>{children}</View>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});
