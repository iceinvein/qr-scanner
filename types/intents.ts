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
