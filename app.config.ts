import { ExpoConfig } from 'expo/config';

const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT?.trim() == 'development';

const appConfig: ExpoConfig = {
  name: IS_DEV ? 'OikoTeck Dev' : 'OikoTeck',
  slug: 'oikoteck',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/adaptive-icon.png',
  scheme: IS_DEV ? 'oikoteck-dev' : 'oikoteck',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    usesAppleSignIn: true,
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? 'com.oikoteck.dev' : 'com.oikoteck.app',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    package: IS_DEV ? 'com.oikoteck.dev' : 'com.oikoteck.app',
    adaptiveIcon: {
      foregroundImage: IS_DEV ? './assets/adaptive-icon-dev.png' : './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  extra: {
    appId: process.env.EXPO_PUBLIC_APP_ID,
    jsKey: process.env.EXPO_PUBLIC_JS_KEY,
    stripeKey: process.env.EXPO_PUBLIC_STRIPE_KEY,
    eas: {
      projectId: '1c02d2e9-7768-43d5-8269-5fd1753bd6eb',
    },
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
      'react-native-fbsdk-next',
      {
        appID: '511062105081745',
        clientToken: '1692dc2e9451677cc7cfb8097f498f0b',
        displayName: 'Oikoteck',
        scheme: 'fb511062105081745',
      },
    ],
    ["@react-native-google-signin/google-signin"],
    ["expo-apple-authentication"]
  ],

  experiments: {
    tsconfigPaths: true,
  },
};

export default appConfig;
