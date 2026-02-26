import { ExpoConfig } from 'expo/config';
import 'tsx/cjs';
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
      NSCameraUsageDescription:
        'This app uses the camera to allow users to take and upload property photos.',
      NSPhotoLibraryUsageDescription:
        'This app needs photo library access so users can select images from their gallery.',
      NSLocationWhenInUseUsageDescription:
        'This app uses your location to improve map and property accuracy.',
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            'com.googleusercontent.apps.249425615765-c3hb68cqlo6fcjd82bft3uqeq8t857bh',
          ],
        },
      ],
      LSApplicationQueriesSchemes: [
        'whatsapp',
        'whatsapp-business',
        'fbapi',
        'fb-messenger-share-api',
        'fbauth2',
        'fbshareextension',
      ],
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    softwareKeyboardLayoutMode: 'pan',
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
    googleServicesFile: './google-services.json',
    intentFilters: [
      {
        action: 'android.intent.action.VIEW',
        data: [
          {
            scheme: 'https',
          },
          {
            scheme: 'http',
          },
          {
            scheme: 'geo',
          },
        ],

        category: ['BROWSABLE'],
      },
      {
        action: 'android.intent.action.VIEW',
        data: [{ scheme: 'whatsapp' }],
        category: ['BROWSABLE'],
      },
    ],
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
    [
      'react-native-fbsdk-next',
      IS_DEV
        ? {
            appID: '1466312534483142',
            clientToken: '39f3ec1ef0ce51150e6e157317babfad',
            displayName: 'OikoTeck - Test1',
            scheme: 'fb1466312534483142',
          }
        : {
            appID: '511062105081745',
            clientToken: '1692dc2e9451677cc7cfb8097f498f0b',
            displayName: 'Oikoteck',
            scheme: 'fb511062105081745',
          },
    ],
    [
      '@react-native-google-signin/google-signin',
      {
        iosClientId: '249425615765-c3hb68cqlo6fcjd82bft3uqeq8t857bh.apps.googleusercontent.com',
      },
    ],
    ['expo-apple-authentication'],
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'oikoteck-native',
        organization: 'oikoteck',
      },
    ],
    // ['@stripe/stripe-react-native'],
  ],

  experiments: {
    tsconfigPaths: true,
  },
};

export default appConfig;
