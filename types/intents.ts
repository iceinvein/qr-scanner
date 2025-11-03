/**
 * Core types for intent detection and classification
 */

export interface ScanResult {
  data: string;
  timestamp: number;
  format?: string; // QR, EAN, etc.
}

export enum IntentType {
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  SMS = 'sms',
  WIFI = 'wifi',
  CONTACT = 'contact',
  EVENT = 'event',
  LOCATION = 'location',
  PAYMENT = 'payment',
  APP_LINK = 'app_link',
  FIDO = 'fido',
  TOTP = 'totp',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  MECARD = 'mecard',
  VIDEO_CONFERENCE = 'video_conference',
  SOCIAL_MEDIA = 'social_media',
  MUSIC_MEDIA = 'music_media',
  APP_STORE = 'app_store',
  EPC_PAYMENT = 'epc_payment',
  TEXT = 'text',
  UNKNOWN = 'unknown'
}

export interface DetectedIntent {
  type: IntentType;
  confidence: number; // 0-1
  rawData: string;
  metadata?: {
    detectorName?: string;
    detectionTime?: number; // ms
    format?: string; // QR, EAN, etc.
    dataLength?: number;
    encoding?: string;
    patterns?: string[]; // Matched patterns
  };
}

export interface IntentDetector {
  detect(scanResult: ScanResult): DetectedIntent;
}
