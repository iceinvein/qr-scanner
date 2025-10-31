# Environment Variables Setup Guide

Complete guide for setting up all environment variables needed for building and deploying your QR Scanner app.

## 📁 Files Overview

- **`.env.local`** - Root environment file (for EAS builds and app config)
- **`fastlane/.env.fastlane`** - Fastlane-specific environment file (for deployments)

Both files are in `.gitignore` and should never be committed.

## 🔧 Quick Setup

### 1. Update Bundle Identifiers

Choose your unique bundle identifiers (reverse domain notation):

```bash
# In both .env.local and fastlane/.env.fastlane
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
ANDROID_PACKAGE=com.iceinvein.qrscanner
```

### 2. Apple Developer Setup

#### Get Your Apple Team ID
1. Go to https://developer.apple.com/account
2. Click on "Membership" in the sidebar
3. Copy your **Team ID** (10 characters, e.g., `ABC123XYZ`)

```bash
APPLE_ID=your-email@icloud.com
APPLE_TEAM_ID=ABC123XYZ
```

#### Get App Store Connect Team ID
1. Go to https://appstoreconnect.apple.com
2. Click your name in top right > View Membership
3. Copy the **Team ID** (numeric, e.g., `123456789`)

```bash
FASTLANE_ITC_TEAM_ID=123456789
FASTLANE_ITC_TEAM_NAME="Your Team Name"
```

#### Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" > "+" > "New App"
3. Fill in app details
4. After creation, go to App Information
5. Copy the **Apple ID** (numeric, e.g., `1234567890`)

```bash
ASC_APP_ID=1234567890
```

### 3. Google Play Console Setup

#### Create App
1. Go to https://play.google.com/console
2. Create a new app
3. Complete the app details

#### Create Service Account
1. Go to https://console.cloud.google.com
2. Select your project (or create one)
3. Go to "IAM & Admin" > "Service Accounts"
4. Click "Create Service Account"
5. Name it (e.g., "fastlane-deploy")
6. Grant role: "Service Account User"
7. Click "Done"
8. Click on the service account
9. Go to "Keys" tab
10. Click "Add Key" > "Create new key" > "JSON"
11. Download the JSON file
12. Save it securely (e.g., `~/secrets/qr-scanner-play-store.json`)

#### Enable Google Play Developer API
1. In Google Cloud Console
2. Go to "APIs & Services" > "Library"
3. Search for "Google Play Android Developer API"
4. Click "Enable"

#### Link Service Account to Play Console
1. Go to https://play.google.com/console
2. Go to "Setup" > "API access"
3. Click "Link" next to your service account
4. Grant permissions: "Admin (all permissions)"

```bash
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/Users/dikrana/secrets/qr-scanner-play-store.json
```

### 4. Google Maps API Keys

#### Create Project (if needed)
1. Go to https://console.cloud.google.com
2. Create a new project or select existing

#### Enable APIs
1. Go to "APIs & Services" > "Library"
2. Search and enable:
   - "Maps SDK for iOS"
   - "Maps SDK for Android"

#### Create API Keys
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Create two keys (one for iOS, one for Android)

#### Restrict Keys (Recommended)
**iOS Key:**
- Click "Edit API key"
- Under "Application restrictions" select "iOS apps"
- Add your bundle identifier: `com.iceinvein.qrscanner`
- Under "API restrictions" select "Restrict key"
- Select "Maps SDK for iOS"

**Android Key:**
- Click "Edit API key"
- Under "Application restrictions" select "Android apps"
- Add package name: `com.iceinvein.qrscanner`
- Add your SHA-1 certificate fingerprint (get from EAS credentials)
- Under "API restrictions" select "Restrict key"
- Select "Maps SDK for Android"

```bash
GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

## 📋 Complete Environment Variables

### Required for EAS Build

```bash
# .env.local
EAS_PROJECT_ID=aad55bc6-8b2b-4dd3-a305-40054e28d1f0
EAS_OWNER=iceinvein
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
ANDROID_PACKAGE=com.iceinvein.qrscanner
GOOGLE_MAPS_API_KEY_IOS=your-ios-key
GOOGLE_MAPS_API_KEY_ANDROID=your-android-key
```

### Required for Fastlane Deployment

```bash
# fastlane/.env.fastlane
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
APPLE_ID=your-email@icloud.com
APPLE_TEAM_ID=ABC123XYZ
FASTLANE_ITC_TEAM_ID=123456789
ASC_APP_ID=1234567890

ANDROID_PACKAGE=com.iceinvein.qrscanner
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account.json
SUPPLY_TRACK=internal

EAS_PROJECT_ID=aad55bc6-8b2b-4dd3-a305-40054e28d1f0
EAS_OWNER=iceinvein

GOOGLE_MAPS_API_KEY_IOS=your-ios-key
GOOGLE_MAPS_API_KEY_ANDROID=your-android-key
```

## 🧪 Testing Your Setup

### Test EAS Configuration
```bash
# Check if EAS can read your config
eas config

# Test build (won't actually build)
eas build --platform android --profile development --no-wait
```

### Test Fastlane Configuration
```bash
# Validate iOS setup
fastlane ios validate

# Validate Android setup
fastlane android validate
```

### Test Google Maps Keys
```bash
# Build and run on device/simulator
npm run ios
npm run android

# Scan a location QR code and verify map displays
```

## 🔐 Security Best Practices

### Local Development
- ✅ Keep `.env.local` and `fastlane/.env.fastlane` in `.gitignore`
- ✅ Never commit API keys or credentials
- ✅ Use different keys for development and production
- ✅ Restrict API keys to specific bundle IDs/packages

### CI/CD (GitHub Actions, etc.)
- ✅ Store secrets in CI/CD environment variables
- ✅ Use App Store Connect API Key instead of password
- ✅ Rotate keys periodically
- ✅ Use separate service accounts for different environments

### Service Account JSON
- ✅ Store in secure location outside of project
- ✅ Never commit to version control
- ✅ Set restrictive file permissions: `chmod 600 service-account.json`
- ✅ Use absolute paths in environment variables

## 🚀 Build & Deploy Workflow

### Development Build
```bash
# Set environment
export $(cat .env.local | xargs)

# Build
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Build
```bash
# Build
eas build --platform ios --profile production-ios
eas build --platform android --profile production-android
```

### Deploy to Stores
```bash
# iOS (via EAS)
eas submit --platform ios --latest

# Android (via Fastlane)
# Download AAB from EAS first
AAB_PATH=./qr-scanner.aab fastlane android deploy_internal
```

## 🆘 Troubleshooting

### "Invalid bundle identifier"
- Ensure bundle ID matches in:
  - `.env.local`
  - `fastlane/.env.fastlane`
  - App Store Connect
  - Google Play Console

### "Authentication failed"
- Verify `APPLE_ID` and `APPLE_TEAM_ID` are correct
- Try logging in manually: `fastlane spaceauth -u your-email@icloud.com`
- Consider using App Store Connect API Key

### "Service account not authorized"
- Ensure service account is linked in Play Console
- Verify Google Play Developer API is enabled
- Check service account has correct permissions

### "Invalid API key"
- Verify API keys are not restricted incorrectly
- Check bundle ID/package name matches restrictions
- Ensure Maps SDK is enabled for the project

### "Maps not displaying"
- Verify API keys are set in `.env.local`
- Check keys are enabled for correct platform
- Ensure Maps SDK is enabled in Google Cloud Console
- Rebuild the app after adding keys

## 📚 Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Fastlane Documentation](https://docs.fastlane.tools/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Google Play Developer API](https://developers.google.com/android-publisher)
- [Google Maps Platform](https://developers.google.com/maps)

## ✅ Setup Checklist

- [ ] Updated bundle identifiers in both env files
- [ ] Got Apple Team ID from developer portal
- [ ] Got App Store Connect Team ID
- [ ] Created app in App Store Connect
- [ ] Got ASC App ID
- [ ] Created Google Play app
- [ ] Created service account in Google Cloud
- [ ] Downloaded service account JSON
- [ ] Linked service account to Play Console
- [ ] Created Google Maps API keys
- [ ] Restricted API keys appropriately
- [ ] Updated all environment variables
- [ ] Tested with `fastlane ios validate`
- [ ] Tested with `fastlane android validate`
- [ ] Successfully built development version
- [ ] Verified Google Maps works in app

---

**Current Status:**
- ✅ EAS project initialized
- ✅ Environment files created
- ⏳ Credentials need to be filled in
- ⏳ Apps need to be created in stores
- ⏳ API keys need to be generated

**Next Step:** Update bundle identifiers and start filling in credentials!
