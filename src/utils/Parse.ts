import AsyncStorage from '@react-native-async-storage/async-storage';
import Parseini from 'parse/react-native';
import { Platform } from 'react-native';

let _Parse: typeof Parseini | null = null;

export const ParseInit = async () => {
  if (_Parse) return _Parse;
  Parseini.initialize(process.env.EXPO_PUBLIC_APP_ID!, process.env.EXPO_PUBLIC_JS_KEY!);
  Parseini.serverURL = process.env.EXPO_PUBLIC_PARSE_API_ADDRESS;
  Parseini.setAsyncStorage(AsyncStorage);

  const Installation = new Parseini.Installation();
  Installation.set('deviceType',Platform.OS);

  console.log(Installation)

  try {
    await Installation.save();
  } catch {}

  _Parse = Parseini;

  return Parseini;
};
