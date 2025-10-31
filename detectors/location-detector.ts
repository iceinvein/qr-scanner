import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Location Detector
 * Detects geographic coordinates and map links
 * Supports: geo:37.7749,-122.4194, https://maps.google.com/?q=..., https://www.google.com/maps/...
 */
export class LocationDetector implements IntentDetector {
	private readonly geoPattern = /^geo:/i;
	private readonly googleMapsPattern =
		/^https?:\/\/(www\.)?(google\.com\/maps|maps\.google\.com)/i;
	private readonly coordinatesPattern =
		/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for geo: protocol
		if (this.geoPattern.test(trimmedData)) {
			patterns.push("geo: protocol");

			// Check for query parameter
			if (/\?q=/i.test(trimmedData)) {
				patterns.push("Location query");
			}

			return {
				type: IntentType.LOCATION,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Google Maps URLs
		if (this.googleMapsPattern.test(trimmedData)) {
			patterns.push("Google Maps URL");

			return {
				type: IntentType.LOCATION,
				confidence: 0.9,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for plain coordinates (lat,lng)
		if (this.coordinatesPattern.test(trimmedData)) {
			patterns.push("Coordinate format");

			return {
				type: IntentType.LOCATION,
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
