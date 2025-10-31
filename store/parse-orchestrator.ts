/**
 * Orchestrates content parsing based on detected intent type
 */

import {
    AppLinkParser,
    ContactParser,
    EmailParser,
    EventParser,
    LocationParser,
    PaymentParser,
    PhoneParser,
    SMSParser,
    TextParser,
    URLParser,
    WiFiParser,
} from "../parsers";
import type { DetectedIntent } from "../types/intents";
import { IntentType } from "../types/intents";
import type { ParsedContent } from "../types/parsers";

// Initialize parser instances
const urlParser = new URLParser();
const emailParser = new EmailParser();
const phoneParser = new PhoneParser();
const smsParser = new SMSParser();
const wifiParser = new WiFiParser();
const contactParser = new ContactParser();
const eventParser = new EventParser();
const locationParser = new LocationParser();
const paymentParser = new PaymentParser();
const appLinkParser = new AppLinkParser();
const textParser = new TextParser();

/**
 * Parse content based on the detected intent type
 */
export const parseContent = (
	intent: DetectedIntent,
): ParsedContent<unknown> => {
	try {
		switch (intent.type) {
			case IntentType.URL:
				return urlParser.parse(intent.rawData);

			case IntentType.EMAIL:
				return emailParser.parse(intent.rawData);

			case IntentType.PHONE:
				return phoneParser.parse(intent.rawData);

			case IntentType.SMS:
				return smsParser.parse(intent.rawData);

			case IntentType.WIFI:
				return wifiParser.parse(intent.rawData);

			case IntentType.CONTACT:
				return contactParser.parse(intent.rawData);

			case IntentType.EVENT:
				return eventParser.parse(intent.rawData);

			case IntentType.LOCATION:
				return locationParser.parse(intent.rawData);

			case IntentType.PAYMENT:
				return paymentParser.parse(intent.rawData);

			case IntentType.APP_LINK:
				return appLinkParser.parse(intent.rawData);

			case IntentType.TEXT:
				return textParser.parse(intent.rawData);

			case IntentType.UNKNOWN:
			default:
				return {
					success: true,
					data: { raw: intent.rawData },
				};
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to parse content",
		};
	}
};
