import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * SMS Detector
 * Detects SMS/text message links
 * Supports: sms:+1234567890?body=Hello, smsto:+1234567890:Hello
 */
export class SMSDetector implements IntentDetector {
	private readonly smsPattern = /^sms:/i;
	private readonly smstoPattern = /^smsto:/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for sms: protocol
		if (this.smsPattern.test(trimmedData)) {
			patterns.push("sms: protocol");

			// Check if it has a body parameter
			if (/\?body=/i.test(trimmedData)) {
				patterns.push("Pre-filled message");
			}

			return {
				type: IntentType.SMS,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for smsto: protocol (alternative format)
		if (this.smstoPattern.test(trimmedData)) {
			patterns.push("smsto: protocol");

			return {
				type: IntentType.SMS,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		return {
			type: IntentType.UNKNOWN,
			confidence: 0,
			rawData: data,
		};
	}
}
