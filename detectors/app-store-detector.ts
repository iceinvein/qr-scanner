import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * App Store Detector
 * Detects app store links (Apple App Store, Google Play Store)
 */
export class AppStoreDetector implements IntentDetector {
	private readonly appStorePattern = /^https?:\/\/(apps|itunes)\.apple\.com\/.+\/app\//i;
	private readonly playStorePattern = /^https?:\/\/play\.google\.com\/store\/apps\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for Apple App Store
		if (this.appStorePattern.test(trimmedData)) {
			patterns.push("Apple App Store");
			return {
				type: IntentType.APP_STORE,
				confidence: 0.97,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Google Play Store
		if (this.playStorePattern.test(trimmedData)) {
			patterns.push("Google Play Store");
			return {
				type: IntentType.APP_STORE,
				confidence: 0.97,
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


