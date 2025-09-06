import { ExpoConfig } from 'expo/config';

const appConfig: ExpoConfig = {
  name: 'OikoTeck',
  slug: 'oikoteck',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'oikoteck',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.matrimonial.pk',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
  },
  extra: {
    appId: process.env.EXPO_PUBLIC_APP_ID,
    jsKey: process.env.EXPO_PUBLIC_JS_KEY,
    stripeKey: process.env.EXPO_PUBLIC_STRIPE_KEY,
  },

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/adaptive-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F63B3B',
      },
    ],
  ],

  experiments: {
    tsconfigPaths: true,
  },
};

export default appConfig;
