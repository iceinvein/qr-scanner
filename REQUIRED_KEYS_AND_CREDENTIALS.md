# Required Keys and Credentials Reference

Quick reference guide for all keys, credentials, and environment variables needed for building and deploying the QR Scanner app.

## 📋 Quick Checklist

Use this checklist to track what you have and what you still need:

- [ ] Expo account created
- [ ] EAS CLI installed
- [ ] Apple Developer account ($99/year)
- [ ] Google Play Developer account ($25 one-time)
- [ ] Bundle identifiers chosen
- [ ] Apple Team ID obtained
- [ ] App Store Connect app created
- [ ] Google Play app created
- [ ] Service account created and linked
- [ ] Google Maps API keys created
- [ ] All environment variables filled in `.env.local`

---

## 🔑 Required Credentials by Platform

### Universal (Both Platforms)

| Credential | Where to Get | Format | Example | Required |
|------------|--------------|--------|---------|----------|
| EAS_PROJECT_ID | `eas init` | UUID | `aad55bc6-8b2b-4dd3-a305-40054e28d1f0` | ✅ Yes |
| EAS_OWNER | Expo account | String | `iceinvein` | ✅ Yes |
| GOOGLE_MAPS_API_KEY_IOS | Google Cloud Console | String | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` | ⚠️ Optional* |
| GOOGLE_MAPS_API_KEY_ANDROID | Google Cloud Console | String | `AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY` | ⚠️ Optional* |

*Required if your app uses location features

### iOS Only

| Credential | Where to Get | Format | Example | Required |
|------------|--------------|--------|---------|----------|
| IOS_BUNDLE_IDENTIFIER | Choose unique ID | Reverse domain | `com.iceinvein.qrscanner` | ✅ Yes |
| APPLE_ID | Apple Developer account | Email | `developer@icloud.com` | ✅ Yes |
| APPLE_TEAM_ID | developer.apple.com/account | 10 chars | `ABC123XYZ` | ✅ Yes |
| FASTLANE_ITC_TEAM_ID | App Store Connect | Numeric | `123456789` | ✅ Yes |
| ASC_APP_ID | App Store Connect | Numeric | `1234567890` | ✅ Yes |
| IOS_BUILD_NUMBER | Auto or manual | Integer | `1` | ⚠️ Optional |
| ASC_KEY_ID | App Store Connect API | 10 chars | `ABCDEFG123` | ⚠️ Optional** |
| ASC_ISSUER_ID | App Store Connect API | UUID | `00000000-0000-0000-0000-000000000000` | ⚠️ Optional** |
| ASC_KEY_PATH | Download from ASC | File path | `/path/to/AuthKey_ABCDEFG123.p8` | ⚠️ Optional** |

**Recommended for CI/CD to avoid 2FA prompts

### Android Only

| Credential | Where to Get | Format | Example | Required |
|------------|--------------|--------|---------|----------|
| ANDROID_PACKAGE | Choose unique ID | Reverse domain | `com.iceinvein.qrscanner` | ✅ Yes |
| GOOGLE_SERVICE_ACCOUNT_KEY_PATH | Google Cloud Console | File path | `/path/to/service-account.json` | ✅ Yes |
| ANDROID_VERSION_CODE | Auto or manual | Integer | `1` | ⚠️ Optional |
| SUPPLY_TRACK | Choose track | String | `internal` | ⚠️ Optional*** |

***Defaults to `internal` if not specified

---

## 📝 Detailed Credential Guide

### 1. EAS Project Credentials

#### EAS_PROJECT_ID
- **What**: Unique identifier for your EAS project
- **How to get**: Run `eas init` in your project
- **Format**: UUID (36 characters with dashes)
- **Example**: `aad55bc6-8b2b-4dd3-a305-40054e28d1f0`
- **Where to use**: `.env.local`, `app.config.ts`

```bash
# Get it by running:
eas init

# Or view existing:
eas project:info
```

#### EAS_OWNER
- **What**: Your Expo account username
- **How to get**: Your Expo username
- **Format**: String (lowercase, no spaces)
- **Example**: `iceinvein`
- **Where to use**: `.env.local`, `app.config.ts`

```bash
# Check your username:
eas whoami
```

---

### 2. iOS Credentials

#### IOS_BUNDLE_IDENTIFIER
- **What**: Unique identifier for your iOS app
- **How to get**: Choose one (must be unique across App Store)
- **Format**: Reverse domain notation
- **Example**: `com.iceinvein.qrscanner`
- **Where to use**: `.env.local`, App Store Connect
- **Rules**:
  - Must be unique
  - Only letters, numbers, hyphens, periods
  - Cannot start with number
  - Typically: `com.yourcompany.appname`

#### APPLE_ID
- **What**: Your Apple Developer account email
- **How to get**: The email you used to sign up for Apple Developer
- **Format**: Email address
- **Example**: `developer@icloud.com`
- **Where to use**: `.env.local`, `fastlane/.env.fastlane`

#### APPLE_TEAM_ID
- **What**: Your Apple Developer Team ID
- **How to get**:
  1. Go to https://developer.apple.com/account
  2. Click "Membership" in sidebar
  3. Copy "Team ID"
- **Format**: 10 alphanumeric characters
- **Example**: `ABC123XYZ`
- **Where to use**: `.env.local`, `fastlane/.env.fastlane`

#### FASTLANE_ITC_TEAM_ID
- **What**: App Store Connect Team ID
- **How to get**:
  1. Go to https://appstoreconnect.apple.com
  2. Click your name (top right)
  3. Click "View Membership"
  4. Copy "Team ID"
- **Format**: Numeric (8-10 digits)
- **Example**: `123456789`
- **Where to use**: `.env.local`, `fastlane/.env.fastlane`

#### ASC_APP_ID
- **What**: App Store Connect App ID (Apple ID)
- **How to get**:
  1. Create app in App Store Connect
  2. Go to "App Information"
  3. Copy "Apple ID" (not to be confused with your Apple ID email)
- **Format**: Numeric (10 digits)
- **Example**: `1234567890`
- **Where to use**: `.env.local`, `eas.json`

#### App Store Connect API Key (Optional)

**ASC_KEY_ID**
- **What**: API Key ID
- **How to get**:
  1. App Store Connect → Users and Access → Keys
  2. Create new key
  3. Copy "Key ID"
- **Format**: 10 alphanumeric characters
- **Example**: `ABCDEFG123`

**ASC_ISSUER_ID**
- **What**: API Issuer ID
- **How to get**: Same page as Key ID, copy "Issuer ID"
- **Format**: UUID
- **Example**: `00000000-0000-0000-0000-000000000000`

**ASC_KEY_PATH**
- **What**: Path to downloaded .p8 key file
- **How to get**: Download when creating API key (only once!)
- **Format**: Absolute file path
- **Example**: `/Users/dikrana/secrets/AuthKey_ABCDEFG123.p8`

---

### 3. Android Credentials

#### ANDROID_PACKAGE
- **What**: Unique identifier for your Android app
- **How to get**: Choose one (must be unique across Google Play)
- **Format**: Reverse domain notation
- **Example**: `com.iceinvein.qrscanner`
- **Where to use**: `.env.local`, Google Play Console
- **Rules**:
  - Must be unique
  - Only letters, numbers, underscores, periods
  - Must have at least 2 segments
  - Typically: `com.yourcompany.appname`

#### GOOGLE_SERVICE_ACCOUNT_KEY_PATH
- **What**: Path to Google Play service account JSON key
- **How to get**:
  1. Google Cloud Console → IAM & Admin → Service Accounts
  2. Create service account
  3. Create JSON key
  4. Download and save securely
- **Format**: Absolute file path to JSON file
- **Example**: `/Users/dikrana/secrets/qr-scanner-play-store.json`
- **Where to use**: `.env.local`, `fastlane/.env.fastlane`
- **Security**: 
  - Never commit to git
  - Store outside project directory
  - Set permissions: `chmod 600 service-account.json`

**Service Account JSON Structure:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "service-account@project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

#### SUPPLY_TRACK
- **What**: Google Play release track
- **How to get**: Choose based on your deployment strategy
- **Format**: String
- **Options**:
  - `internal` - Internal testing (up to 100 testers)
  - `alpha` - Closed testing
  - `beta` - Closed testing
  - `production` - Public release
- **Example**: `internal`
- **Where to use**: `.env.local`, `fastlane/.env.fastlane`

---

### 4. Google Maps API Keys

#### GOOGLE_MAPS_API_KEY_IOS
- **What**: Google Maps API key for iOS
- **How to get**:
  1. Google Cloud Console → APIs & Services → Credentials
  2. Create API Key
  3. Restrict to iOS apps
  4. Add bundle identifier
  5. Restrict to Maps SDK for iOS
- **Format**: String (starts with `AIza`)
- **Example**: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Where to use**: `.env.local`

#### GOOGLE_MAPS_API_KEY_ANDROID
- **What**: Google Maps API key for Android
- **How to get**:
  1. Google Cloud Console → APIs & Services → Credentials
  2. Create API Key
  3. Restrict to Android apps
  4. Add package name and SHA-1 fingerprint
  5. Restrict to Maps SDK for Android
- **Format**: String (starts with `AIza`)
- **Example**: `AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY`
- **Where to use**: `.env.local`

**Get SHA-1 Fingerprint:**
```bash
# From EAS credentials
eas credentials
# Select: Android → Production → View credentials
# Copy SHA-1 fingerprint
```

---

## 🗂️ File Locations

### .env.local (Project Root)
```bash
# Location: /path/to/qr-scanner/.env.local
# Used by: EAS Build, app.config.ts
# Committed: NO (in .gitignore)

EAS_PROJECT_ID=aad55bc6-8b2b-4dd3-a305-40054e28d1f0
EAS_OWNER=iceinvein
IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
ANDROID_PACKAGE=com.iceinvein.qrscanner
APPLE_ID=developer@icloud.com
APPLE_TEAM_ID=ABC123XYZ
FASTLANE_ITC_TEAM_ID=123456789
ASC_APP_ID=1234567890
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/Users/dikrana/secrets/qr-scanner-play-store.json
GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### fastlane/.env.fastlane
```bash
# Location: /path/to/qr-scanner/fastlane/.env.fastlane
# Used by: Fastlane deployment
# Committed: NO (in .gitignore)

IOS_BUNDLE_IDENTIFIER=com.iceinvein.qrscanner
APPLE_ID=developer@icloud.com
APPLE_TEAM_ID=ABC123XYZ
FASTLANE_ITC_TEAM_ID=123456789
ASC_APP_ID=1234567890
ANDROID_PACKAGE=com.iceinvein.qrscanner
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/Users/dikrana/secrets/qr-scanner-play-store.json
SUPPLY_TRACK=internal
EAS_PROJECT_ID=aad55bc6-8b2b-4dd3-a305-40054e28d1f0
EAS_OWNER=iceinvein
GOOGLE_MAPS_API_KEY_IOS=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GOOGLE_MAPS_API_KEY_ANDROID=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

### Service Account JSON
```bash
# Location: /Users/dikrana/secrets/qr-scanner-play-store.json
# Used by: Fastlane, EAS Submit
# Committed: NO (never commit!)
# Permissions: chmod 600

{
  "type": "service_account",
  "project_id": "your-project",
  ...
}
```

### App Store Connect API Key
```bash
# Location: /Users/dikrana/secrets/AuthKey_ABCDEFG123.p8
# Used by: Fastlane (optional)
# Committed: NO (never commit!)
# Permissions: chmod 600

-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```

---

## 🔐 Security Best Practices

### DO ✅

- ✅ Store credentials in `.env.local` (already in `.gitignore`)
- ✅ Store service account JSON outside project directory
- ✅ Use absolute paths for file references
- ✅ Set restrictive file permissions: `chmod 600`
- ✅ Use different API keys for development and production
- ✅ Restrict API keys to specific bundle IDs/packages
- ✅ Rotate keys periodically
- ✅ Use App Store Connect API key for CI/CD
- ✅ Keep backups of keystores and certificates

### DON'T ❌

- ❌ Commit `.env.local` or `.env.fastlane` to git
- ❌ Commit service account JSON files
- ❌ Commit API keys or certificates
- ❌ Share credentials in plain text
- ❌ Use production keys in development
- ❌ Store credentials in code
- ❌ Use unrestricted API keys
- ❌ Lose your Android keystore (you can't update your app!)

---

## 📊 Credential Priority Matrix

| Credential | Build | Submit | Deploy | CI/CD |
|------------|-------|--------|--------|-------|
| EAS_PROJECT_ID | ✅ | ✅ | ✅ | ✅ |
| EAS_OWNER | ✅ | ✅ | ✅ | ✅ |
| IOS_BUNDLE_IDENTIFIER | ✅ | ✅ | ✅ | ✅ |
| ANDROID_PACKAGE | ✅ | ✅ | ✅ | ✅ |
| APPLE_ID | ⚠️ | ✅ | ✅ | ✅ |
| APPLE_TEAM_ID | ✅ | ✅ | ✅ | ✅ |
| ASC_APP_ID | ⚠️ | ✅ | ✅ | ✅ |
| GOOGLE_SERVICE_ACCOUNT | ⚠️ | ✅ | ✅ | ✅ |
| GOOGLE_MAPS_API_KEYS | ✅ | ⚠️ | ⚠️ | ✅ |
| ASC_API_KEY | ❌ | ⚠️ | ⚠️ | ✅ |

Legend:
- ✅ Required
- ⚠️ Optional but recommended
- ❌ Not needed

---

## 🧪 Testing Your Credentials

### Test EAS Configuration
```bash
# Verify project setup
eas project:info

# Test build configuration
eas config

# Dry run build (doesn't actually build)
eas build --platform ios --profile development --no-wait
```

### Test iOS Credentials
```bash
# View iOS credentials
eas credentials
# Select: iOS → Production → View credentials

# Test with development build
eas build --platform ios --profile development
```

### Test Android Credentials
```bash
# View Android credentials
eas credentials
# Select: Android → Production → View credentials

# Test with development build
eas build --platform android --profile development
```

### Test Google Maps Keys
```bash
# Build and run app
npm run ios
npm run android

# Scan a location QR code
# Verify map displays correctly
```

### Test Service Account
```bash
# Validate Fastlane configuration
fastlane android validate

# Should show:
# ✓ Service account authenticated
# ✓ App found in Play Console
# ✓ Permissions verified
```

---

## 📞 Where to Get Help

### Official Documentation
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Apple Developer](https://developer.apple.com/documentation/)
- [Google Play Console](https://support.google.com/googleplay/android-developer)
- [Google Maps Platform](https://developers.google.com/maps/documentation)

### Community Support
- [Expo Forums](https://forums.expo.dev/)
- [Expo Discord](https://chat.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Project Documentation
- [EAS Complete Guide](./EAS_COMPLETE_GUIDE.md)
- [Environment Setup Guide](./ENV_SETUP_GUIDE.md)
- [Quick Start](./QUICK_START.md)

---

## ✅ Final Checklist

Before building:
- [ ] All required credentials obtained
- [ ] `.env.local` created and filled
- [ ] `fastlane/.env.fastlane` created and filled
- [ ] Service account JSON downloaded and secured
- [ ] Google Maps API keys created and restricted
- [ ] Bundle identifiers match everywhere
- [ ] Apps created in App Store Connect and Play Console
- [ ] Tested with `eas config`
- [ ] Tested with development build

Ready to build! 🚀

```bash
# Build development version first
eas build --platform android --profile development

# Then production
eas build --platform ios --profile production-ios
eas build --platform android --profile production-android
```
