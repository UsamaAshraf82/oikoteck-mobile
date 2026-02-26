import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PortalHost } from '@rn-primitives/portal';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator as ActivityIndicatorInternal,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import AppText from '~/components/Elements/AppText';
import Provider from '~/components/Provider';
import Menu from '~/components/Sheets/Menu';
import ModalContainer from '~/components/Sheets/Modal';
import Popup from '~/components/Sheets/Popup';
import Select from '~/components/Sheets/Select';
import { ToastContainer } from '~/components/ToastContainer';
import useActivityIndicator from '~/store/useActivityIndicator';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://f38cbcdf56bafebea8623bea0bf541c9@o4510437482233856.ingest.us.sentry.io/4510945850687488',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  // enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// SystemUI.setBackgroundColorAsync('#fff');
SplashScreen.preventAutoHideAsync();
GoogleSignin.configure({
  webClientId: '249425615765-q3s8kt4ldpuf0u4dr7flmc9pm4n06ugi.apps.googleusercontent.com', // from Google Cloud Console
  iosClientId: '249425615765-c3hb68cqlo6fcjd82bft3uqeq8t857bh.apps.googleusercontent.com', // from GoogleService-Info.plist or google-services.json
  offlineAccess: false, // so you can also get refresh tokens if needed
  scopes: ['profile', 'email'],
});
Settings.initializeSDK();

function RootLayout() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    LufgaThin: require('@/lufga/LufgaThin.ttf'),
    LufgaExtraLight: require('@/lufga/LufgaExtraLight.ttf'),
    LufgaLight: require('@/lufga/LufgaLight.ttf'),
    LufgaRegular: require('@/lufga/LufgaRegular.ttf'),
    LufgaMedium: require('@/lufga/LufgaMedium.ttf'),
    LufgaSemiBold: require('@/lufga/LufgaSemiBold.ttf'),
    LufgaBold: require('@/lufga/LufgaBold.ttf'),
    LufgaExtraBold: require('@/lufga/LufgaExtraBold.ttf'),
    LufgaBlack: require('@/lufga/LufgaBlack.ttf'),
  });

  const { refresh } = useUser();

  // const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        await ParseInit();
        await refresh();
        await SplashScreen.hideAsync();
        setReady(true);
      } catch (e) {
        console.error(e);
      }
    };
    initialize();
    // if(user){
    //   SplashScreen.hideAsync();
    // }
  }, []);

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }: { error: any; resetError: () => void }) => (
        <View style={styles.errorContainer}>
          <AppText style={styles.errorTitle}>Oops! Something went wrong.</AppText>
          <AppText style={styles.errorMessage}>{error.message}</AppText>
          <Pressable style={styles.resetButton} onPress={resetError}>
            <AppText style={styles.resetButtonText}>Try Again</AppText>
          </Pressable>
        </View>
      )}>
      <StripeProvider publishableKey="pk_test_51PSK7VP5GmAB6WhMTNNCySQpZwOVzUV3T7DJA6W25VrCnxom0KAJ3osQyZR6qXb2GZtO6oP8m33SI4pIoeV913Pf00RBNgWjCl">
        <Provider>
          <Screens fontsLoaded={fontsLoaded} ready={ready} />
          <ModalContainer />
          <Select />
          <Menu />
          <Popup />
          <ActivityIndicator />
          <ToastContainer />
        </Provider>
      </StripeProvider>
      <PortalHost name="toast-host" />
    </Sentry.ErrorBoundary>
  );
}

const Screens = ({ ready, fontsLoaded }: { ready: boolean; fontsLoaded: boolean }) => {
  const { user } = useUser();
  if (!ready) return <Slot />;
  if (!fontsLoaded) return <Slot />;
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="property/[id]" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(no-auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

const ActivityIndicator = () => {
  const { isInActivity } = useActivityIndicator();
  // if (!isInActivity) return null;
  return (
    <Modal transparent visible={isInActivity} animationType="fade">
      <View style={styles.activityOverlay}>
        <ActivityIndicatorInternal
          size="large"
          style={{ transform: [{ scale: 2 }] }}
          color="#82065e"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  activityOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'LufgaBold',
    color: '#192234',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#9191A1',
    textAlign: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#82065e',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontFamily: 'LufgaBold',
    fontSize: 16,
  },
});

export default Sentry.wrap(RootLayout);
