import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { ActivityIndicator as ActivityIndicatorInternal, Modal, View } from 'react-native';
import Provider from '~/components/Provider';
import ModalContainer from '~/components/Sheets/Modal';
import Select from '~/components/Sheets/Select';
import { ToastContainer } from '~/components/ToastContainer';
import useActivityIndicator from '~/store/useActivityIndicator';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';
import tailwind from '~/utils/tailwind';
import '../../global.css';

GoogleSignin.configure({
  webClientId: '49942846746-4eooga0osnghuh58hic4fkahh128k28g.apps.googleusercontent.com', // from Google Cloud Console
  offlineAccess: true, // so you can also get refresh tokens if needed
  scopes: ['profile', 'email'],
});
SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync('#fff');

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
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
      <Provider>
        <Screens fontsLoaded={fontsLoaded} ready={ready} />
        <ModalContainer />
        <Select />
        <ActivityIndicator />
        <ToastContainer />
      </Provider>
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
      <View className="flex-1 items-center justify-center bg-white/30">
        <ActivityIndicatorInternal
          size="large"
          style={{ transform: [{ scale: 2 }] }}
          color={tailwind.theme.colors.secondary}
        />
      </View>
    </Modal>
  );
};
