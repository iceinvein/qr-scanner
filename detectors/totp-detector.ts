import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * TOTP/OTP Detector
 * Detects Time-based One-Time Password (TOTP) and HMAC-based One-Time Password (HOTP)
 * Used by authenticator apps like Google Authenticator, Authy, etc.
 */
export class TOTPDetector implements IntentDetector {
	private readonly totpPattern = /^otpauth:\/\/(totp|hotp)\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for otpauth:// scheme
		if (this.totpPattern.test(trimmedData)) {
			const match = trimmedData.match(this.totpPattern);
			if (match) {
				patterns.push(`OTP Auth (${match[1].toUpperCase()})`);
			}
			return {
				type: IntentType.TOTP,
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


