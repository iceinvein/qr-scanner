import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Phone Detector
 * Detects phone numbers in various formats
 * Supports: tel:+1234567890, +1-234-567-8900, (123) 456-7890
 */
export class PhoneDetector implements IntentDetector {
	private readonly telPattern = /^tel:/i;
	private readonly phonePattern =
		/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
	private readonly internationalPattern = /^\+[1-9]\d{1,14}$/;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for tel: protocol
		if (this.telPattern.test(trimmedData)) {
			patterns.push("tel: protocol");

			return {
				type: IntentType.PHONE,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for international format
		if (this.internationalPattern.test(trimmedData)) {
			patterns.push("International format");

			return {
				type: IntentType.PHONE,
				confidence: 0.9,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for general phone pattern
		if (this.phonePattern.test(trimmedData)) {
			patterns.push("Phone number format");

			return {
				type: IntentType.PHONE,
				confidence: 0.85,
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
