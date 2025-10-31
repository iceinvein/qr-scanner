import {
    IntentType,
    type DetectedIntent,
    type IntentDetector,
    type ScanResult,
} from "../types";

/**
 * WiFi Detector
 * Detects WiFi credentials in WIFI: format or plain text format
 * Standard format: WIFI:T:<WPA|WPA2|WEP|nopass>;S:<SSID>;P:<password>;H:<true|false>;;
 * Plain text format: networkname and password (or similar variations)
 */
export class WiFiDetector implements IntentDetector {
	private readonly wifiPattern = /^WIFI:/i;
	private readonly securityTypes = ["WPA", "WPA2", "WEP", "nopass"];
	// Pattern to detect plain text WiFi credentials with "and" or "&"
	private readonly plainTextWithAndPattern = /^(.+?)\s+(?:and|&)\s+(.+)$/i;
	// Pattern for space-separated format (SSID password)
	// More restrictive: password should look like a password (mix of chars, reasonable length)
	private readonly spaceSeparatedPattern = /^([^\s]{2,32})\s+([^\s]{8,63})$/;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();

		// Debug logging

		// Check for standard WIFI: format
		if (this.wifiPattern.test(trimmedData)) {
			return this.detectStandardFormat(trimmedData, data);
		}

		// Check for plain text format with "and" (e.g., "networkname and password")
		if (this.plainTextWithAndPattern.test(trimmedData)) {
			const match = trimmedData.match(this.plainTextWithAndPattern);
			if (match) {
				const [, possibleSSID, possiblePassword] = match;
				// Basic validation: SSID should be reasonable length
				if (possibleSSID.length > 0 && possibleSSID.length <= 32) {
					return {
						type: IntentType.WIFI,
						confidence: 0.7,
						rawData: data,
						metadata: {
							patterns: ["Plain text WiFi format (with 'and')", `SSID: ${possibleSSID}`],
						},
					};
				}
			}
		}

		// Check for space-separated format (e.g., "networkname password")
		// This is less confident because it's ambiguous
		if (this.spaceSeparatedPattern.test(trimmedData)) {
			const match = trimmedData.match(this.spaceSeparatedPattern);
			if (match) {
				const [, possibleSSID, possiblePassword] = match;
				
				// Additional validation: password should have some complexity
				const hasLetters = /[a-zA-Z]/.test(possiblePassword);
				const hasNumbers = /[0-9]/.test(possiblePassword);
				const hasMixedCase = /[a-z]/.test(possiblePassword) && /[A-Z]/.test(possiblePassword);
				
				// Higher confidence if password looks complex
				const confidence = (hasLetters && hasNumbers) || hasMixedCase ? 0.75 : 0.65;
				
				
				return {
					type: IntentType.WIFI,
					confidence,
					rawData: data,
					metadata: {
						patterns: ["Plain text WiFi format (space-separated)", `SSID: ${possibleSSID}`],
					},
				};
			}
		}

		return {
			type: IntentType.UNKNOWN,
			confidence: 0,
			rawData: data,
		};
	}

	private detectStandardFormat(
		trimmedData: string,
		rawData: string,
	): DetectedIntent {
		// Check for required fields: T (type) and S (SSID)
		const hasType = /T:[^;]+/i.test(trimmedData);
		const hasSSID = /S:[^;]+/i.test(trimmedData);

		if (hasType && hasSSID) {
			// Validate security type if present
			const typeMatch = trimmedData.match(/T:([^;]+)/i);
			const patterns: string[] = ["WIFI: prefix"];

			if (typeMatch) {
				const securityType = typeMatch[1].toUpperCase();
				const isValidType = this.securityTypes.includes(securityType);
				patterns.push(`Security: ${securityType}`);

				return {
					type: IntentType.WIFI,
					confidence: isValidType ? 0.95 : 0.85,
					rawData: rawData,
					metadata: { patterns },
				};
			}
		}

		// Has WIFI: prefix but missing required fields
		return {
			type: IntentType.WIFI,
			confidence: 0.6,
			rawData: rawData,
			metadata: { patterns: ["WIFI: prefix (incomplete)"] },
		};
	}
}
