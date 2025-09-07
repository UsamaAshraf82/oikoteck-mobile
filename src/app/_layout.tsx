import { useFonts } from "expo-font";
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
    LufgaRegular: require("@/lufga/Lufga-Regular.ttf"),
    LufgaMedium: require("./assets/fonts/Lufga-Medium.ttf"),
    LufgaBold: require("./assets/fonts/Lufga-Bold.ttf"),
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

  // if (!ready) return <Slot />;
  // if (user === undefined) return <Slot />;

  return (
    <Provider>
      {ready ?
      <Stack screenOptions={{ headerShown: false }} initialRouteName={'(tabs)'}>
        <Stack.Screen name="(tabs)" />
      </Stack >:<Slot/>}
    </Provider>
  );
}
