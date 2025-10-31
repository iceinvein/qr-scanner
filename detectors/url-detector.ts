import {
    IntentType,
    type DetectedIntent,
    type IntentDetector,
    type ScanResult,
} from "../types";

/**
 * URL Detector
 * Detects URLs with http(s), ftp protocols and common TLDs
 */
export class URLDetector implements IntentDetector {
	private readonly urlPattern = /^(https?:\/\/|ftp:\/\/)[^\s]+$/i;
	private readonly commonTLDPattern =
		/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for explicit protocol
		if (this.urlPattern.test(trimmedData)) {
			patterns.push("HTTP/HTTPS/FTP protocol");
			return {
				type: IntentType.URL,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for common TLD patterns (e.g., example.com)
		if (this.commonTLDPattern.test(trimmedData)) {
			patterns.push("Common TLD pattern");
			return {
				type: IntentType.URL,
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
