import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PortalHost } from '@rn-primitives/portal';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator as ActivityIndicatorInternal, Modal, StyleSheet, View } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import Provider from '~/components/Provider';
import Menu from '~/components/Sheets/Menu';
import ModalContainer from '~/components/Sheets/Modal';
import Popup from '~/components/Sheets/Popup';
import Select from '~/components/Sheets/Select';
import { ToastContainer } from '~/components/ToastContainer';
import useActivityIndicator from '~/store/useActivityIndicator';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';

// SystemUI.setBackgroundColorAsync('#fff');
SplashScreen.preventAutoHideAsync();
GoogleSignin.configure({
  webClientId: '249425615765-q3s8kt4ldpuf0u4dr7flmc9pm4n06ugi.apps.googleusercontent.com', // from Google Cloud Console
  offlineAccess: false, // so you can also get refresh tokens if needed
  scopes: ['profile', 'email'],
});
Settings.initializeSDK();

export default function RootLayout() {
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
    <>
      <StripeProvider publishableKey="pk_test_51PSK7VP5GmAB6WhMTNNCySQpZwOVzUV3T7DJA6W25VrCnxom0KAJ3osQyZR6qXb2GZtO6oP8m33SI4pIoeV913Pf00RBNgWjCl">
        <Provider>
          <Screens fontsLoaded={fontsLoaded} ready={ready} />
          <ModalContainer />
          <Select />
          <Menu />
          <Popup />
          <ActivityIndicator />
        </Provider>
      </StripeProvider>
      <ToastContainer />
      <PortalHost  name='toast-host'/>
    </>
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
});
