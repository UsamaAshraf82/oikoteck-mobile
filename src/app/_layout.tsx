import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import Provider from '~/components/Provider';
import Select from '~/components/Sheets/Select';
import { ToastContainer } from '~/components/ToastContainer';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';
import '../../global.css';

GoogleSignin.configure({
  webClientId: '49942846746-4eooga0osnghuh58hic4fkahh128k28g.apps.googleusercontent.com', // from Google Cloud Console
  offlineAccess: true, // so you can also get refresh tokens if needed
  scopes: ['profile', 'email'],
});
SplashScreen.preventAutoHideAsync();

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
        await SystemUI.setBackgroundColorAsync('#fff');
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
    <Provider>

      <Screens fontsLoaded={fontsLoaded} ready={ready} />
      <Select />
     <ToastContainer />
    </Provider>
  );
}

const Screens = ({ ready, fontsLoaded }: { ready: boolean; fontsLoaded: boolean }) => {
  if (!ready) return <Slot />;
  if (!fontsLoaded) return <Slot />;
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName={'(tabs)'}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="property/[id]" />
      <Stack.Screen name="login" />
    </Stack>
  );
};
