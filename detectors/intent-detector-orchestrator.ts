import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";
import { AppLinkDetector } from "./app-link-detector";
import { ContactDetector } from "./contact-detector";
import { EmailDetector } from "./email-detector";
import { EventDetector } from "./event-detector";
import { LocationDetector } from "./location-detector";
import { PaymentDetector } from "./payment-detector";
import { PhoneDetector } from "./phone-detector";
import { SMSDetector } from "./sms-detector";
import { TextDetector } from "./text-detector";
import { URLDetector } from "./url-detector";
import { WiFiDetector } from "./wifi-detector";

/**
 * Intent Detector Orchestrator
 * Coordinates multiple detectors in priority order with short-circuit logic
 * Ensures detection completes within 100ms performance target
 */
export class IntentDetectorOrchestrator implements IntentDetector {
	private readonly detectors: IntentDetector[];
	private readonly confidenceThreshold = 0.8;

	constructor() {
		// Priority order: most specific to least specific
		// Structured formats first (WiFi, Payment, Event, Contact, Location)
		// Communication formats (Email, Phone, SMS)
		// App links and URLs
		// Plain text as fallback
		this.detectors = [
			new WiFiDetector(),
			new PaymentDetector(),
			new EventDetector(),
			new ContactDetector(),
			new LocationDetector(),
			new EmailDetector(),
			new PhoneDetector(),
			new SMSDetector(),
			new AppLinkDetector(),
			new URLDetector(),
			new TextDetector(),
		];
	}

	detect(scanResult: ScanResult): DetectedIntent {
		const startTime = Date.now();

		// Run detectors in priority order with short-circuit
		for (const detector of this.detectors) {
			const result = detector.detect(scanResult);

			// Short-circuit if we have a confident detection
			if (
				result.type !== IntentType.UNKNOWN &&
				result.confidence >= this.confidenceThreshold
			) {
				const detectionTime = Date.now() - startTime;
				return {
					...result,
					metadata: {
						...result.metadata,
						detectorName: detector.constructor.name,
						detectionTime,
						format: scanResult.format,
						dataLength: scanResult.data.length,
						encoding: this.detectEncoding(scanResult.data),
					},
				};
			}

			// Performance check: ensure we stay under 100ms
			if (Date.now() - startTime > 100) {
				console.warn("Intent detection exceeded 100ms target");
				break;
			}
		}

		return {
			type: IntentType.TEXT,
			confidence: 0.5,
			rawData: scanResult.data,
			metadata: {
				detectorName: "IntentDetectorOrchestrator",
				detectionTime: Date.now() - startTime,
				format: scanResult.format,
				dataLength: scanResult.data.length,
				encoding: this.detectEncoding(scanResult.data),
			},
		};
	}

	private detectEncoding(data: string): string {
		// Check for common encodings
		// biome-ignore lint/suspicious/noControlCharactersInRegex: checking ASCII range
		if (/^[\x00-\x7F]*$/.test(data)) return "ASCII";
		if (/[\u0080-\uFFFF]/.test(data)) return "UTF-8";
		return "Unknown";
	}
}
