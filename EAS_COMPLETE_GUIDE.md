# Complete EAS Build & Submit Guide

Comprehensive guide for building and submitting your QR Scanner app to the App Store and Google Play using EAS (Expo Application Services).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Initial Setup](#initial-setup)
4. [iOS Setup](#ios-setup)
5. [Android Setup](#android-setup)
6. [Building](#building)
7. [Submitting](#submitting)
8. [Troubleshooting](#troubleshooting)
9. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

### Required Accounts

- ✅ **Expo Account** (free) - [Sign up](https://expo.dev/signup)
- ✅ **Apple Developer Account** ($99/year) - [Enroll](https://developer.apple.com/programs/)
- ✅ **Google Play Developer Account** ($25 one-time) - [Sign up](https://play.google.com/console/signup)

### Required Tools

```bash
# Install Node.js 18+ (if not installed)
# Download from https://nodejs.org

# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

### Project Requirements

- ✅ Expo SDK 50+ project
- ✅ Valid `app.config.ts` or `app.json`
- ✅ Valid `eas.json` configuration
- ✅ Git repository initialized

---

## Environment Variables

### Required Environment Variables

Create `.env.local` in your project root with these variables:

```bash
# ============================================
# EAS Build Configuration
# ============================================

# EAS Project (automatically set after eas init)
EAS_PROJECT_ID=aad55bc6-8b2b-4dd3-a305-40054e28d1f0
EAS_OWNER=iceinvein

# ============================================
# iOS Configuration
# ============================================

# Bundle Identifier (must be unique, reverse domain notation)
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner

# Build Number (optional, auto-incremented if using autoIncrement in eas.json)
IOS_BUILD_NUMBER=1

# Apple Developer Credentials
APPLE_ID=your-email@icloud.com
APPLE_TEAM_ID=ABC123XYZ

# App Store Connect
FASTLANE_ITC_TEAM_ID=123456789
ASC_APP_ID=1234567890

# ============================================
# Android Configuration
# ============================================

# Package Name (must be unique, reverse domain notation)
ANDROID_PACKAGE=com.iceinvein.qrscanner

# Version Code (optional, auto-incremented if using autoIncrement in eas.json)
ANDROID_VERSION_CODE=1

# Google Play Console
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/absolute/path/to/service-account.json

# ============================================
# Google Maps API Keys
# ============================================

# Get from: https://console.cloud.google.com
GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### Optional Environment Variables

```bash
# App Store Connect API Key (recommended for CI/CD)
ASC_KEY_ID=ABCDEFG123
ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000
ASC_KEY_PATH=/absolute/path/to/AuthKey_ABCDEFG123.p8

# Build Options
EXPO_NO_DOTENV=1                    # Disable .env loading
EXPO_NO_CACHE=1                     # Disable build cache
EAS_BUILD_PROFILE=production        # Specify build profile
EAS_NO_VCS=1                        # Skip VCS checks

# Submission Options
EXPO_APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

## Initial Setup

### 1. Login to EAS

```bash
# Login to your Expo account
eas login

# Verify you're logged in
eas whoami
```

### 2. Initialize EAS Project

```bash
# Initialize EAS in your project
eas init

# This will:
# - Create an EAS project
# - Generate a project ID
# - Link your local project to EAS
```

**Output:**
```
✔ Created @iceinvein/qr-scanner
Project ID: aad55bc6-8b2b-4dd3-a305-40054e28d1f0
```

### 3. Update app.config.ts

Ensure your `app.config.ts` includes the project ID:

```typescript
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'aad55bc6-8b2b-4dd3-a305-40054e28d1f0',
    },
  },
  owner: process.env.EAS_OWNER || 'iceinvein',
});
```

### 4. Verify Configuration

```bash
# Check project info
eas project:info

# View build configuration
eas config
```

---

## iOS Setup

### Step 1: Choose Bundle Identifier

Your bundle identifier must be unique across the App Store.

```bash
# Format: com.yourcompany.appname
# Example: com.iceinvein.qrscanner

# Add to .env.local
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
```

### Step 2: Get Apple Developer Credentials

#### Apple Team ID

1. Go to https://developer.apple.com/account
2. Click "Membership" in sidebar
3. Copy your **Team ID** (10 characters)

```bash
APPLE_TEAM_ID=ABC123XYZ
```

#### Apple ID

Your Apple Developer account email:

```bash
APPLE_ID=your-email@icloud.com
```

### Step 3: Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: QR Scanner
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select your bundle ID (or create new)
   - **SKU**: qr-scanner (unique identifier)
   - **User Access**: Full Access

4. After creation, go to "App Information"
5. Copy the **Apple ID** (numeric, e.g., 1234567890)

```bash
ASC_APP_ID=1234567890
```

#### Get App Store Connect Team ID

1. In App Store Connect, click your name (top right)
2. Click "View Membership"
3. Copy the **Team ID** (numeric)

```bash
FASTLANE_ITC_TEAM_ID=123456789
```

### Step 4: Set Up iOS Credentials with EAS

EAS can automatically manage your iOS certificates and provisioning profiles.

```bash
# Configure iOS credentials
eas credentials

# Select:
# - Platform: iOS
# - Profile: production (or development)
# - Action: Set up credentials

# EAS will:
# 1. Create/reuse Distribution Certificate
# 2. Create/reuse Provisioning Profile
# 3. Store them securely in EAS
```

**Options:**

**Option A: Let EAS manage everything (Recommended)**
- EAS creates and manages certificates
- Easiest option
- Best for teams

**Option B: Use existing certificates**
- Upload your existing .p12 and .mobileprovision files
- Good if you already have certificates

**Option C: Use local credentials**
- Store credentials locally
- Not recommended for teams

### Step 5: Configure App Store Connect API Key (Optional but Recommended)

This allows automated submission without 2FA prompts.

1. Go to https://appstoreconnect.apple.com
2. Click "Users and Access" → "Keys" tab
3. Click "+" to create new key
4. Name: "EAS Deploy"
5. Access: "App Manager"
6. Click "Generate"
7. Download the `.p8` file (you can only download once!)
8. Note the **Key ID** and **Issuer ID**

```bash
ASC_KEY_ID=ABCDEFG123
ASC_ISSUER_ID=00000000-0000-0000-0000-000000000000
ASC_KEY_PATH=/Users/dikrana/secrets/AuthKey_ABCDEFG123.p8
```

---

## Android Setup

### Step 1: Choose Package Name

Your package name must be unique across Google Play.

```bash
# Format: com.yourcompany.appname
# Example: com.iceinvein.qrscanner

# Add to .env.local
ANDROID_PACKAGE=com.iceinvein.qrscanner
```

### Step 2: Create App in Google Play Console

1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - **App name**: QR Scanner
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept declarations and click "Create app"

### Step 3: Set Up Google Play Service Account

#### Create Service Account in Google Cloud

1. Go to https://console.cloud.google.com
2. Select or create a project
3. Go to "IAM & Admin" → "Service Accounts"
4. Click "Create Service Account"
5. Name: "eas-deploy" or "fastlane-deploy"
6. Click "Create and Continue"
7. Grant role: "Service Account User"
8. Click "Done"

#### Create and Download Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Click "Create"
6. Save the JSON file securely

```bash
# Move to secure location
mkdir -p ~/secrets
mv ~/Downloads/service-account-*.json ~/secrets/qr-scanner-play-store.json

# Add to .env.local
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/Users/dikrana/secrets/qr-scanner-play-store.json
```

#### Enable Google Play Developer API

1. In Google Cloud Console
2. Go to "APIs & Services" → "Library"
3. Search for "Google Play Android Developer API"
4. Click "Enable"

#### Link Service Account to Play Console

1. Go to https://play.google.com/console
2. Go to "Setup" → "API access"
3. Click "Link" next to your service account
4. Grant permissions:
   - ✅ View app information and download bulk reports
   - ✅ Create and edit draft apps
   - ✅ Release apps to testing tracks
   - ✅ Release apps to production
5. Click "Invite user"

### Step 4: Set Up Android Credentials with EAS

EAS can automatically manage your Android keystore.

```bash
# Configure Android credentials
eas credentials

# Select:
# - Platform: Android
# - Profile: production (or development)
# - Action: Set up credentials

# EAS will:
# 1. Generate a new keystore
# 2. Store it securely in EAS
# 3. Use it for all future builds
```

**Important:** Keep your keystore secure! If you lose it, you cannot update your app on Google Play.

---

## Google Maps Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Name: "QR Scanner"

### Step 2: Enable Required APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - ✅ Maps SDK for iOS
   - ✅ Maps SDK for Android

### Step 3: Create API Keys

#### iOS API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Click "Edit API key" (pencil icon)
4. Name: "QR Scanner iOS"
5. Under "Application restrictions":
   - Select "iOS apps"
   - Click "Add an item"
   - Enter bundle ID: `com.iceinvein.qrscanner`
6. Under "API restrictions":
   - Select "Restrict key"
   - Select "Maps SDK for iOS"
7. Click "Save"

```bash
GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

#### Android API Key

1. Click "Create Credentials" → "API Key"
2. Click "Edit API key"
3. Name: "QR Scanner Android"
4. Under "Application restrictions":
   - Select "Android apps"
   - Click "Add an item"
   - Enter package name: `com.iceinvein.qrscanner`
   - Enter SHA-1 fingerprint (get from EAS credentials)
5. Under "API restrictions":
   - Select "Restrict key"
   - Select "Maps SDK for Android"
6. Click "Save"

```bash
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

#### Get SHA-1 Fingerprint

```bash
# Get from EAS credentials
eas credentials

# Select Android → Production → View credentials
# Copy the SHA-1 fingerprint
```

---

## Building

### Development Builds

Development builds include the Expo dev client for testing.

#### iOS Development Build

```bash
# Build for iOS simulator
eas build --platform ios --profile development

# Build for physical device
eas build --platform ios --profile development --device
```

#### Android Development Build

```bash
# Build APK for testing
eas build --platform android --profile development
```

**Install on Device:**

```bash
# After build completes, download and install
# iOS: Use Apple Configurator or Xcode
# Android: Download APK and install directly
```

### Preview Builds

Preview builds are for internal testing without dev client.

```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview
```

### Production Builds

Production builds are optimized for store submission.

#### iOS Production Build

```bash
# Build for App Store
eas build --platform ios --profile production-ios

# Or use the generic production profile
eas build --platform ios --profile production
```

**What happens:**
1. EAS reads your `eas.json` configuration
2. Loads environment variables from `.env.local`
3. Runs on EAS Build servers
4. Uses your iOS credentials
5. Creates an `.ipa` file
6. Stores build artifacts in EAS

**Build time:** ~10-20 minutes

#### Android Production Build

```bash
# Build AAB for Google Play
eas build --platform android --profile production-android

# Or use the generic production profile
eas build --platform android --profile production
```

**What happens:**
1. EAS reads your `eas.json` configuration
2. Loads environment variables from `.env.local`
3. Runs on EAS Build servers
4. Uses your Android keystore
5. Creates an `.aab` file
6. Stores build artifacts in EAS

**Build time:** ~10-20 minutes

### Build Both Platforms

```bash
# Build iOS and Android simultaneously
eas build --platform all --profile production
```

### Monitor Builds

```bash
# List recent builds
eas build:list

# View specific build
eas build:view [BUILD_ID]

# View build logs
eas build:view [BUILD_ID] --logs

# Cancel a build
eas build:cancel [BUILD_ID]
```

### Build Options

```bash
# Build without waiting
eas build --platform ios --profile production --no-wait

# Build with specific message
eas build --platform ios --profile production --message "Release v1.0.0"

# Build from specific branch
eas build --platform ios --profile production --branch main

# Clear cache and build
eas build --platform ios --profile production --clear-cache

# Build locally (requires macOS for iOS)
eas build --platform ios --profile production --local
```

---

## Submitting

### iOS Submission

#### Method 1: EAS Submit (Recommended)

```bash
# Submit latest build
eas submit --platform ios --latest

# Submit specific build
eas submit --platform ios --id [BUILD_ID]

# Submit with specific IPA
eas submit --platform ios --path ./app.ipa
```

**What you'll be asked:**

1. **Apple ID**: Your Apple Developer email
2. **App-specific password**: Generate at appleid.apple.com
3. **ASC App ID**: Your App Store Connect app ID

**Or use environment variables:**

```bash
# Add to .env.local
EXPO_APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Then submit
eas submit --platform ios --latest
```

#### Method 2: Manual Upload

1. Download `.ipa` from EAS dashboard
2. Open Xcode
3. Go to "Window" → "Organizer"
4. Drag `.ipa` to Organizer
5. Click "Distribute App"
6. Follow prompts

#### Method 3: Transporter App

1. Download `.ipa` from EAS
2. Open Transporter app (Mac App Store)
3. Drag `.ipa` to Transporter
4. Click "Deliver"

### Android Submission

#### Method 1: EAS Submit

```bash
# Submit latest build
eas submit --platform android --latest

# Submit specific build
eas submit --platform android --id [BUILD_ID]

# Submit with specific AAB
eas submit --platform android --path ./app.aab
```

**What you'll need:**

- Service account JSON key
- Track: internal, alpha, beta, or production

**Configuration:**

```bash
# Add to eas.json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "${GOOGLE_SERVICE_ACCOUNT_KEY_PATH}",
        "track": "internal"
      }
    }
  }
}
```

#### Method 2: Google Play Console

1. Download `.aab` from EAS dashboard
2. Go to https://play.google.com/console
3. Select your app
4. Go to "Release" → "Production" (or Testing)
5. Click "Create new release"
6. Upload `.aab` file
7. Add release notes
8. Click "Review release"
9. Click "Start rollout to Production"

#### Method 3: Fastlane (Advanced)

```bash
# Download AAB from EAS
# Then use Fastlane
AAB_PATH=./qr-scanner.aab fastlane android deploy_internal
```

### Submission Tracks (Android)

**Internal Testing:**
- Up to 100 testers
- Instant availability
- No review required

**Closed Testing (Alpha/Beta):**
- Up to 100,000 testers
- Email list or Google Groups
- Minimal review

**Open Testing:**
- Anyone can join
- Public link
- Standard review

**Production:**
- Public release
- Full review process
- Gradual rollout options

---

## Troubleshooting

### Common Build Errors

#### "Bundle identifier already in use"

**Solution:**
```bash
# Change bundle identifier in .env.local
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner-new

# Update in App Store Connect
# Rebuild
```

#### "No credentials found"

**Solution:**
```bash
# Set up credentials
eas credentials

# Select platform and profile
# Follow prompts to create/upload credentials
```

#### "Build failed: Metro bundler error"

**Solution:**
```bash
# Clear Metro cache
npx expo start --clear

# Clear EAS cache
eas build --platform ios --profile production --clear-cache
```

#### "Android build failed: Gradle error"

**Solution:**
```bash
# Check Java version (should be 17)
java -version

# Update gradle.properties
# Rebuild
```

### Common Submission Errors

#### iOS: "Invalid binary"

**Causes:**
- Missing required device capabilities
- Invalid bundle identifier
- Missing privacy descriptions

**Solution:**
- Check `app.config.ts` for required permissions
- Verify bundle ID matches App Store Connect
- Add all required `NSUsageDescription` strings

#### iOS: "Missing compliance"

**Solution:**
1. Go to App Store Connect
2. Select your app
3. Go to "App Information"
4. Answer export compliance questions

#### Android: "Service account not authorized"

**Solution:**
1. Verify service account is linked in Play Console
2. Check API is enabled in Google Cloud
3. Verify JSON key file path is correct
4. Ensure service account has correct permissions

#### Android: "Version code already exists"

**Solution:**
```bash
# Increment version code in .env.local
ANDROID_VERSION_CODE=2

# Or use autoIncrement in eas.json
# Rebuild
```

### Getting Help

```bash
# View EAS documentation
eas help

# View specific command help
eas build --help
eas submit --help

# Check EAS status
curl https://status.expo.dev/api/v2/status.json
```

**Resources:**
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
- [Expo Forums](https://forums.expo.dev/)
- [Expo Discord](https://chat.expo.dev/)

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive
        
      - name: Build Android
        run: eas build --platform android --profile production --non-interactive
```

### Required Secrets

Add these to GitHub repository secrets:

```bash
EXPO_TOKEN=your-expo-access-token

# Get token:
eas whoami
# Then go to: https://expo.dev/accounts/[username]/settings/access-tokens
```

### Environment Variables in CI

```yaml
env:
  EAS_PROJECT_ID: ${{ secrets.EAS_PROJECT_ID }}
  IOS_BUNDLE_IDENTIFIER: ${{ secrets.IOS_BUNDLE_IDENTIFIER }}
  ANDROID_PACKAGE: ${{ secrets.ANDROID_PACKAGE }}
  GOOGLE_MAPS_API_KEY_IOS: ${{ secrets.GOOGLE_MAPS_API_KEY_IOS }}
  GOOGLE_MAPS_API_KEY_ANDROID: ${{ secrets.GOOGLE_MAPS_API_KEY_ANDROID }}
```

---

## Quick Reference

### Essential Commands

```bash
# Login
eas login

# Initialize project
eas init

# Configure credentials
eas credentials

# Build development
eas build --platform ios --profile development
eas build --platform android --profile development

# Build production
eas build --platform ios --profile production-ios
eas build --platform android --profile production-android

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest

# View builds
eas build:list
eas build:view [BUILD_ID]

# View project info
eas project:info
```

### Build Profiles

| Profile | Purpose | Output | Distribution |
|---------|---------|--------|--------------|
| development | Testing with dev client | APK/IPA | Internal |
| preview | Internal testing | APK/IPA | Internal |
| production | Store submission | AAB/IPA | Public |

### Submission Checklist

#### iOS
- [ ] App created in App Store Connect
- [ ] Bundle ID matches
- [ ] All required permissions in app.config.ts
- [ ] Privacy policy URL set
- [ ] Screenshots uploaded
- [ ] App description complete
- [ ] Export compliance answered

#### Android
- [ ] App created in Play Console
- [ ] Package name matches
- [ ] Service account configured
- [ ] All required permissions in app.config.ts
- [ ] Privacy policy URL set
- [ ] Screenshots uploaded (2-8 required)
- [ ] Feature graphic uploaded
- [ ] App description complete

---

## Summary

**Complete workflow:**

1. ✅ Set up accounts (Expo, Apple, Google)
2. ✅ Configure environment variables
3. ✅ Initialize EAS project
4. ✅ Set up credentials
5. ✅ Build development version (test)
6. ✅ Build production version
7. ✅ Submit to stores
8. ✅ Monitor review process

**Time estimate:**
- Initial setup: 2-4 hours
- First build: 30-60 minutes
- Subsequent builds: 10-20 minutes
- Store review: 1-7 days (iOS), 1-3 days (Android)

**Next steps:**
1. Fill in all environment variables in `.env.local`
2. Run `eas build --platform android --profile development` to test
3. Fix any issues
4. Build production versions
5. Submit to stores

---

**Need help?** Check [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for detailed credential setup instructions.
