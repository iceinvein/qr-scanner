import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'QR Scanner',
  slug: 'qr-scanner',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'qrscanner',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || 'com.yourcompany.qrscanner',
    buildNumber: process.env.IOS_BUILD_NUMBER || '1',
    infoPlist: {
      NSCameraUsageDescription: 'This app needs camera access to scan QR codes.',
      NSPhotoLibraryUsageDescription: 'This app needs photo library access to save QR codes.',
      NSCalendarsUsageDescription: 'This app needs calendar access to add events from QR codes.',
      NSContactsUsageDescription: 'This app needs contacts access to save contact information from QR codes.',
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    package: process.env.ANDROID_PACKAGE || 'com.yourcompany.qrscanner',
    versionCode: parseInt(process.env.ANDROID_VERSION_CODE || '1', 10),
    adaptiveIcon: {
      backgroundColor: '#007AFF',
      foregroundImage: './assets/images/icon.png',
    },
    permissions: [
      'CAMERA',
      'READ_CALENDAR',
      'WRITE_CALENDAR',
      'READ_CONTACTS',
      'WRITE_CONTACTS',
    ],
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'aad55bc6-8b2b-4dd3-a305-40054e28d1f0',
    },
  },
  owner: process.env.EAS_OWNER || 'iceinvein',
});
