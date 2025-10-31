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
