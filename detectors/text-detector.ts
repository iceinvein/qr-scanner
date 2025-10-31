import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Text Detector
 * Detects plain text content (fallback for non-structured data)
 * This should run last in the detection chain
 */
export class TextDetector implements IntentDetector {
	private readonly minTextLength = 3;
	private readonly maxTextLength = 1000;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Only detect as text if it's within reasonable length
		if (
			trimmedData.length >= this.minTextLength &&
			trimmedData.length <= this.maxTextLength
		) {
			// Check for multi-line text
			if (trimmedData.includes("\n")) {
				patterns.push("Multi-line text");
			} else {
				patterns.push("Single-line text");
			}

			// Check for sentence-like structure
			if (/[.!?]/.test(trimmedData)) {
				patterns.push("Sentence structure");
			}

			// Lower confidence for very short text
			const confidence = trimmedData.length < 10 ? 0.6 : 0.75;

			return {
				type: IntentType.TEXT,
				confidence,
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
