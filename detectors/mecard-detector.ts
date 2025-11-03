import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * MeCard Detector
 * Detects MeCard contact format (alternative to vCard, popular in Japan)
 * Format: MECARD:N:Name;TEL:Phone;EMAIL:Email;...;;
 */
export class MeCardDetector implements IntentDetector {
	private readonly mecardPattern = /^MECARD:/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for MECARD: prefix
		if (this.mecardPattern.test(trimmedData)) {
			patterns.push("MeCard format");
			return {
				type: IntentType.MECARD,
				confidence: 0.99,
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


