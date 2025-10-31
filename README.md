# QR Scanner �

A powerful, privacy-focused QR code scanner built with React Native and Expo. Supports multiple QR code types including WiFi, contacts, events, payments, URLs, and more.

## ✨ Features

- 📷 **Fast QR Code Scanning** - Real-time camera-based scanning
- 🔐 **Privacy-First** - All processing happens locally on device
- 🎯 **Smart Intent Detection** - Automatically detects QR code type and provides appropriate actions
- 🌓 **Dark Mode Support** - Beautiful UI that adapts to system theme
- 📱 **Native Actions** - Direct integration with calendar, contacts, maps, and more
- 🚀 **New Architecture** - Built with React Native's new architecture for better performance

### Supported QR Code Types

- 📡 **WiFi** - Connect to networks instantly
- 💳 **Payments** - UPI, PayPal, Bitcoin, Ethereum
- 📅 **Events** - Add to calendar with one tap
- 👤 **Contacts** - Save vCard information
- 📍 **Locations** - View on maps and get directions
- 📧 **Email** - Compose emails
- 📞 **Phone** - Make calls or send SMS
- 🔗 **URLs** - Open websites and app links
- 📝 **Text** - Copy any text content

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- iOS: Xcode 15+ and CocoaPods
- Android: Android Studio and JDK 17
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iceinvein/qr-scanner.git
   cd qr-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🏗️ Project Structure

```
qr-scanner/
├── app/                          # Expo Router pages
│   └── index.tsx                 # Main scanner screen
├── components/                   # React components
│   ├── CameraView.tsx           # Camera component
│   ├── PreviewModal.tsx         # Result preview
│   ├── PreviewOrchestrator.tsx  # Preview coordinator
│   └── previews/                # Type-specific previews
├── detectors/                    # Intent detection logic
│   ├── intent-detector-orchestrator.ts
│   └── [type]-detector.ts       # Type-specific detectors
├── handlers/                     # Action handlers
│   └── [type]-handler.ts        # Type-specific handlers
├── parsers/                      # Data parsers
│   └── [type]-parser.ts         # Type-specific parsers
├── services/                     # Utility services
│   ├── permission-service.ts    # Permission handling
│   ├── haptic-service.ts        # Haptic feedback
│   └── error-handler-service.ts # Error handling
├── store/                        # State management (Nanostores)
│   ├── scan-store.ts            # Scan state
│   └── scan-actions.ts          # Actions
├── types/                        # TypeScript types
├── fastlane/                     # Deployment automation
│   ├── Fastfile                 # Fastlane workflows
│   └── metadata/                # App store metadata
└── android/                      # Android native code
    └── ios/                      # iOS native code (if ejected)

```

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the root directory:

```bash
# EAS Build
EAS_PROJECT_ID=your-project-id
EAS_OWNER=your-expo-username

# iOS
IOS_BUNDLE_IDENTIFIER=com.yourcompany.qrscanner
GOOGLE_MAPS_API_KEY_IOS=your-ios-maps-key

# Android
ANDROID_PACKAGE=com.yourcompany.qrscanner
GOOGLE_MAPS_API_KEY_ANDROID=your-android-maps-key
```

See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for complete setup instructions.

### Google Maps API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps SDK for iOS and Android
3. Create API keys and add to `.env.local`

## 📦 Building

### Development Build

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### Production Build

```bash
# iOS
eas build --platform ios --profile production-ios

# Android
eas build --platform android --profile production-android
```

## 🚢 Deployment

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Create app in [App Store Connect](https://appstoreconnect.apple.com)
   - Get Team ID and App ID

2. **Google Play Developer Account** ($25 one-time)
   - Create app in [Play Console](https://play.google.com/console)
   - Set up service account for API access

3. **Configure Fastlane**
   ```bash
   cp fastlane/.env.fastlane.example fastlane/.env.fastlane
   # Edit with your credentials
   ```

### Deploy to App Store

```bash
# Build and submit
eas build --platform ios --profile production-ios
eas submit --platform ios --latest

# Or use Fastlane
fastlane ios deploy
```

### Deploy to Google Play

```bash
# Build
eas build --platform android --profile production-android

# Deploy to internal track
AAB_PATH=./qr-scanner.aab fastlane android deploy_internal

# Promote to beta
fastlane android promote_to_beta

# Promote to production
fastlane android promote_to_production
```

## 🧪 Testing

### Validate Configuration

```bash
# iOS
fastlane ios validate

# Android
fastlane android validate
```

### Run Tests

```bash
npm test
```

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started with EAS and Fastlane
- [Setup Checklist](./SETUP_CHECKLIST.md) - Complete setup checklist
- [Environment Setup](./ENV_SETUP_GUIDE.md) - Detailed environment variable guide
- [Deployment Guide](./DEPLOYMENT.md) - Deployment workflows
- [EAS Build Setup](./EAS_BUILD_SETUP.md) - EAS build configuration
- [Screenshots Guide](./SCREENSHOTS_GUIDE.md) - App store screenshots
- [Fastlane Structure](./FASTLANE_STRUCTURE.md) - Fastlane directory structure
- [Privacy Policy](./PRIVACY_POLICY.md) - Privacy policy

## 🏗️ Architecture

### State Management

Uses [Nanostores](https://github.com/nanostores/nanostores) for lightweight, reactive state management:

```typescript
// Subscribe to scan results
import { useScanStore } from './store/hooks';

const { currentScan, isScanning } = useScanStore();
```

### Intent Detection

Multi-stage detection pipeline with priority ordering:

1. **WiFi** - Structured WiFi credentials
2. **Payment** - UPI, crypto, payment URLs
3. **Event** - Calendar events (vCalendar)
4. **Contact** - vCard contact information
5. **Location** - Geo coordinates
6. **Email/Phone/SMS** - Communication intents
7. **URLs** - Web and app links
8. **Text** - Plain text fallback

### Performance

- ⚡ Detection completes in <100ms
- 🎯 Short-circuit logic for confident matches
- 📊 Confidence scoring for accuracy
- 🔄 Efficient re-renders with Nanostores

## 🔐 Privacy & Security

- ✅ **No data collection** - Everything stays on device
- ✅ **No tracking or analytics** - Complete privacy
- ✅ **No ads or third parties** - No data sharing
- ✅ **Transparent permissions** - Clear explanations
- ✅ **GDPR & CCPA compliant** - Privacy by design

See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) for details.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) / [React Native](https://reactnative.dev)
- **Language**: TypeScript
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Camera**: [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- **State**: [Nanostores](https://github.com/nanostores/nanostores)
- **UI**: React Native core components
- **Maps**: [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- **Build**: [EAS Build](https://docs.expo.dev/build/introduction/)
- **Deploy**: [Fastlane](https://fastlane.tools)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- QR code detection powered by device cameras
- Icons from [@expo/vector-icons](https://icons.expo.fyi)
- Maps by [Google Maps Platform](https://developers.google.com/maps)

## 📧 Contact

- **GitHub**: [@iceinvein](https://github.com/iceinvein)
- **Project**: [qr-scanner](https://github.com/iceinvein/qr-scanner)

## 🗺️ Roadmap

- [ ] Batch scanning mode
- [ ] QR code generation
- [ ] Scan history with search
- [ ] Export/import scan history
- [ ] Custom QR code templates
- [ ] Widget support (iOS/Android)
- [ ] Apple Watch companion app
- [ ] Shortcuts integration

---

**Made with ❤️ using Expo and React Native**
