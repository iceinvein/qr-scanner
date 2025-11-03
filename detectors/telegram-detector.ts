import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Telegram Detector
 * Detects Telegram links for users, channels, groups, and bots
 */
export class TelegramDetector implements IntentDetector {
	private readonly telegramLinkPattern = /^https?:\/\/(t\.me|telegram\.me)\//i;
	private readonly telegramSchemePattern = /^tg:\/\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for t.me or telegram.me links
		if (this.telegramLinkPattern.test(trimmedData)) {
			patterns.push("Telegram link");
			return {
				type: IntentType.TELEGRAM,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for tg:// scheme
		if (this.telegramSchemePattern.test(trimmedData)) {
			patterns.push("Telegram scheme");
			return {
				type: IntentType.TELEGRAM,
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


