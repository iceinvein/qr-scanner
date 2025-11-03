/**
 * Types for content parsing
 */

export interface ParsedContent<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContentParser<T> {
  parse(rawData: string): ParsedContent<T>;
}

export interface URLData {
  protocol: string;
  domain: string;
  path: string;
  queryParams: Record<string, string>;
  fragment?: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  securityType: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface PaymentData {
  type: 'crypto' | 'uri';
  currency: string;
  address: string;
  amount?: string;
  label?: string;
  message?: string;
}

export interface EventData {
  title: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  description?: string;
  allDay: boolean;
}

export interface ContactData {
  name: {
    formatted?: string;
    given?: string;
    family?: string;
  };
  phones: Array<{ type: string; number: string }>;
  emails: Array<{ type: string; address: string }>;
  organization?: string;
  url?: string;
  address?: string;
}

export interface AppLinkData {
  scheme: string;
  host?: string;
  path?: string;
  params: Record<string, string>;
  fallbackUrl?: string;
}

export interface EmailData {
  address: string;
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
}

export interface PhoneData {
  number: string;
  formatted: string;
  countryCode?: string;
  type?: 'mobile' | 'landline' | 'unknown';
}

export interface SMSData {
  number: string;
  message?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  label?: string;
  query?: string;
  zoom?: number;
}

export interface TextData {
  content: string;
  language?: string;
  wordCount: number;
  lineCount: number;
}

export interface FIDOData {
  protocol: string;
  credentialId?: string;
  rpId?: string; // Relying Party ID
  challenge?: string;
  userId?: string;
  attestation?: string;
  rawData: string;
}

export interface TOTPData {
  type: 'totp' | 'hotp';
  secret: string;
  issuer?: string;
  accountName?: string;
  algorithm?: string;
  digits?: number;
  period?: number;
  counter?: number;
  rawUri: string;
}

export interface WhatsAppData {
  phoneNumber: string;
  text?: string;
  formattedNumber: string;
}

export interface TelegramData {
  type: 'user' | 'channel' | 'group' | 'bot';
  username?: string;
  phoneNumber?: string;
  chatId?: string;
  text?: string;
}

export interface MeCardData {
  name: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
  };
  phone?: string;
  email?: string;
  address?: string;
  url?: string;
  memo?: string;
}

export interface VideoConferenceData {
  platform: 'zoom' | 'meet' | 'teams' | 'webex' | 'other';
  meetingId?: string;
  password?: string;
  url: string;
  displayName?: string;
}

export interface SocialMediaData {
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'snapchat' | 'other';
  username?: string;
  profileUrl: string;
  displayName?: string;
}

export interface MusicMediaData {
  platform: 'spotify' | 'youtube' | 'apple_music' | 'soundcloud' | 'other';
  type: 'track' | 'album' | 'playlist' | 'artist' | 'video' | 'channel' | 'other';
  id?: string;
  url: string;
  title?: string;
}

export interface AppStoreData {
  store: 'apple' | 'google' | 'other';
  appId: string;
  url: string;
  appName?: string;
  developer?: string;
}

export interface EPCPaymentData {
  version: string;
  encoding: string;
  bic?: string;
  beneficiaryName: string;
  beneficiaryAccount: string; // IBAN
  amount?: string;
  currency?: string;
  purpose?: string;
  reference?: string;
  remittanceInfo?: string;
}
