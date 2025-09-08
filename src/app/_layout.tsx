import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Provider from '~/components/Provider';
import useUser from '~/store/useUser';
import { ParseInit } from '~/utils/Parse';
import '../../global.css';

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

  const { user, refresh } = useUser();

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
    <Provider>
      <Screens fontsLoaded={fontsLoaded} ready={ready} />
    </Provider>
  );
}

const Screens = ({ ready, fontsLoaded }: { ready: boolean; fontsLoaded: boolean }) => {
  if (!ready) return <Slot />;
  if (!fontsLoaded) return <Slot />;
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={'(tabs)'}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};
