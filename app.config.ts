import { ExpoConfig } from 'expo/config';

const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT?.trim() == 'development';

const appConfig: ExpoConfig = {
  name: IS_DEV ? 'OikoTeck Dev' : 'OikoTeck',
  slug: 'oikoteck',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'oikoteck',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'com.oikotext.dev' : 'com.oikotext',
  },
  android: {
    package: IS_DEV ? 'com.oikotext.dev' : 'com.oikotext',
    adaptiveIcon: {
      foregroundImage: IS_DEV ? './assets/adaptive-icon-dev.png' : './assets/adaptive-icon.png',
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
        image: './assets/adaptive-text-icon.png',
        imageWidth: 200,
        // resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    ['expo-font'],
    [
      'expo-build-properties',
      {
        android: {
          ndkVersion: '26.3.11579264',
        },
      },
    ],
  ],

  experiments: {
    tsconfigPaths: true,
  },
};

export default appConfig;
