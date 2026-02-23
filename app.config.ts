import type { ConfigContext, ExpoConfig } from "expo/config";

export default (_: ConfigContext): ExpoConfig => ({
  name: "QR Scanner",
  slug: "qr-scanner",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "qrscanner",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.iceinveins.qrscanner",
    infoPlist: {
      NSCameraUsageDescription:
        "This app needs camera access to scan QR codes.",
      NSPhotoLibraryUsageDescription:
        "This app needs photo library access to save QR codes.",
      NSCalendarsUsageDescription:
        "This app needs calendar access to add events from QR codes.",
      NSContactsUsageDescription:
        "This app needs contacts access to save contact information from QR codes.",
      NSLocationWhenInUseUsageDescription:
        "This app needs location access to open location-based QR codes in maps.",
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    package: "com.iceinveins.qrscanner",
    adaptiveIcon: {
      backgroundColor: "#ffffff",
      foregroundImage: "./assets/images/icon.png",
    },
    permissions: [
      "CAMERA",
      "READ_CALENDAR",
      "WRITE_CALENDAR",
      "READ_CONTACTS",
      "WRITE_CONTACTS",
    ],
    edgeToEdgeEnabled: true,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-web-browser",
    "expo-camera",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "aad55bc6-8b2b-4dd3-a305-40054e28d1f0",
    },
  },
  owner: "iceinvein",
});
