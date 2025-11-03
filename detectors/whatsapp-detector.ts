import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * WhatsApp Detector
 * Detects WhatsApp chat links and numbers
 */
export class WhatsAppDetector implements IntentDetector {
	private readonly waLinkPattern = /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i;
	private readonly whatsappSchemePattern = /^whatsapp:\/\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for wa.me or api.whatsapp.com links
		if (this.waLinkPattern.test(trimmedData)) {
			patterns.push("WhatsApp link");
			return {
				type: IntentType.WHATSAPP,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for whatsapp:// scheme
		if (this.whatsappSchemePattern.test(trimmedData)) {
			patterns.push("WhatsApp scheme");
			return {
				type: IntentType.WHATSAPP,
				confidence: 0.98,
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


