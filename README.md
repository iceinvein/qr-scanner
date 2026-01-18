# QR Scanner 📱

A powerful, privacy-focused QR code scanner built with React Native and Expo. Supports **21 different QR code types** including authentication, payments, messaging, social media, and more.

## ✨ Features

### Core Features

- 📷 **21 QR Code Types** - Most comprehensive scanner available
- 🔐 **Privacy-First** - 100% local processing, zero tracking
- 🎯 **Smart Detection** - Automatically identifies format and extracts data
- ⚡ **Lightning Fast** - Detection completes in <100ms
- 🌓 **Dark Mode** - Beautiful UI that adapts to system theme
- 📱 **Native Integration** - Direct actions with device apps

### Developer Features

- 💻 **TypeScript** - Fully typed for safety and IDE support
- 🏗️ **Modular Architecture** - Easy to extend with new types
- 📚 **Well Documented** - Comprehensive guides and inline comments
- 🧪 **Best Practices** - Clean code, error handling, haptic feedback
- 🚀 **Modern Stack** - Expo, React Native, Nanostores, Bun

### Supported QR Code Types (21 Total!)

#### 🔐 Authentication & Security

- **TOTP/OTP** - 2FA setup for Google Authenticator, Authy, and other authenticator apps
- **FIDO** - Fast Identity Online authentication for passwordless login
- **WiFi** - Connect to networks instantly with credentials

#### 💬 Messaging & Communication

- **WhatsApp** - Open chats with pre-filled messages
- **Telegram** - Access users, channels, groups, and bots
- **Email** - Compose emails with recipients, subject, and body
- **Phone** - Make calls or send SMS
- **SMS** - Send text messages

#### 👥 Contacts & Events

- **Contacts (vCard)** - Save contact information with full vCard support
- **MeCard** - Alternative contact format (popular in Japan)
- **Events (iCal)** - Add calendar events with date, time, and location

#### 💳 Payments

- **Crypto Payments** - Bitcoin, Ethereum, and other cryptocurrencies
- **UPI/Payment Links** - PayPal, Venmo, and payment processors
- **EPC/SEPA** - European banking QR codes (IBAN, BIC, amounts)

#### 🌐 Web & Apps

- **URLs** - Open websites and web apps
- **App Links** - Deep links to specific app screens
- **App Store** - Apple App Store and Google Play Store links

#### 🎬 Social & Media

- **Social Media** - Instagram, Twitter/X, LinkedIn, Facebook, TikTok, YouTube, Snapchat profiles
- **Music/Media** - Spotify, YouTube, Apple Music, SoundCloud tracks and playlists
- **Video Conference** - Zoom, Google Meet, Microsoft Teams, Webex meeting links

#### 📍 Location & Other

- **Locations** - Geo coordinates for maps and directions
- **Text** - Copy any plain text content

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.1+ (recommended) or Node.js 18+
- iOS: Xcode 15+ and CocoaPods
- Android: Android Studio and JDK 17
- EAS CLI: `bun install -g eas-cli`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/iceinvein/qr-scanner.git
   cd qr-scanner
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**

   ```bash
   bun start
   ```

5. **Run on device/simulator**

   ```bash
   # iOS
   bun ios
   
   # Android
   bun android
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
bun test
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

Multi-stage detection pipeline with intelligent priority ordering:

#### Priority Tier 1: Highly Specific Formats

1. **WiFi** - Structured WiFi credentials
2. **TOTP/OTP** - Authenticator setup URIs
3. **FIDO** - Authentication credentials
4. **EPC Payment** - European banking codes
5. **MeCard** - Contact format

#### Priority Tier 2: Structured Data

1. **Payment** - Crypto wallets, UPI, payment URIs
2. **Event** - Calendar events (iCal/vCalendar)
3. **Contact** - vCard information
4. **Location** - Geo coordinates

#### Priority Tier 3: Messaging Platforms

1. **WhatsApp** - Chat links
2. **Telegram** - User/channel/group links
3. **Email** - Mailto links
4. **Phone** - Tel links
5. **SMS** - SMS links

#### Priority Tier 4: Media & Social

1. **Video Conference** - Meeting links (Zoom, Meet, Teams, Webex)
2. **Social Media** - Profile links (Instagram, Twitter, LinkedIn, etc.)
3. **Music/Media** - Streaming platform links (Spotify, YouTube, etc.)
4. **App Store** - iOS and Android app links

#### Priority Tier 5: Generic & Fallback

1. **App Links** - Deep links
2. **URLs** - Generic web links
3. **Text** - Plain text fallback

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
- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Camera**: [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- **State**: [Nanostores](https://github.com/nanostores/nanostores)
- **UI**: React Native core components
- **Maps**: [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- **Build**: [EAS Build](https://docs.expo.dev/build/introduction/)
- **Deploy**: [Fastlane](https://fastlane.tools)

## 🤝 Contributing

Contributions are welcome! Whether it's adding new QR code types, improving detection accuracy, or enhancing the UI.

### How to Add a New QR Code Type

1. **Create Detector** (`detectors/your-type-detector.ts`)
   - Implement pattern matching logic
   - Return confidence score (0-1)

2. **Create Parser** (`parsers/your-type-parser.ts`)
   - Extract structured data from raw QR content
   - Handle edge cases and errors

3. **Create Handler** (`handlers/your-type-handler.ts`)
   - Implement primary action (e.g., open app, save data)
   - Add secondary actions (copy, share, etc.)

4. **Create Preview** (`components/previews/YourTypePreview.tsx`)
   - Design UI to display parsed data
   - Follow existing preview patterns

5. **Integrate**
   - Add to `IntentDetectorOrchestrator`
   - Update `parse-orchestrator.ts`
   - Update `scan-actions.ts`
   - Update `PreviewOrchestrator.tsx`
   - Export from index files

### Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new functionality
4. Ensure no linting errors (`bun run lint`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
- QR code detection powered by native device cameras
- Icons and emojis for beautiful UI
- Maps by [Google Maps Platform](https://developers.google.com/maps)
- Inspired by the need for a comprehensive, privacy-focused scanner

## 📊 Statistics

- **21** QR code types supported
- **100+** files of clean, documented code
- **0** data collection or tracking
- **<100ms** average detection time
- **TypeScript** for type safety
- **Open source** and free forever

## 📧 Contact

- **GitHub**: [@iceinvein](https://github.com/iceinvein)
- **Project**: [qr-scanner](https://github.com/iceinvein/qr-scanner)

## ✨ What Makes This Scanner Special?

### Comprehensive Type Support

- **21 different QR code types** - Most comprehensive scanner available
- **Smart detection** - Automatically identifies format and extracts data
- **Native actions** - Direct integration with device apps and services

### Privacy-First Design

- **100% local processing** - No data ever leaves your device
- **No tracking** - Zero analytics, no user profiling
- **No ads** - Clean, distraction-free experience
- **Open source** - Fully transparent codebase

### Developer-Friendly

- **TypeScript** - Fully typed for safety and IDE support
- **Modular architecture** - Easy to extend with new types
- **Well-documented** - Comprehensive guides and comments
- **Best practices** - Clean code, proper error handling, haptic feedback

## 🎯 Use Cases

### Personal

- Set up 2FA authenticators
- Connect to WiFi networks
- Save contacts and calendar events
- Join video meetings
- Share social media profiles

### Business

- Process customer payments (crypto, SEPA)
- Share business cards with MeCard
- Distribute meeting links
- Market through social QR codes
- Accept European bank transfers

### Technical

- FIDO authentication setup
- App deep linking
- OAuth/TOTP flows
- Developer tool QR codes
