import {
    IntentType,
    type DetectedIntent,
    type IntentDetector,
    type ScanResult,
} from "../types";

/**
 * Contact Detector
 * Detects contact information in vCard and MECARD formats
 * Supports vCard 2.1, 3.0, and 4.0 versions
 */
export class ContactDetector implements IntentDetector {
	private readonly vCardBeginPattern = /BEGIN:VCARD/i;
	private readonly vCardPrefixPattern = /^VCARD:/i;
	private readonly meCardPattern = /^MECARD:/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for vCard format with BEGIN:VCARD
		if (this.vCardBeginPattern.test(trimmedData)) {
			patterns.push("vCard format");
			
			// Verify it has END:VCARD and VERSION for completeness
			const hasEnd = /END:VCARD/i.test(trimmedData);
			const hasVersion = /VERSION:(2\.1|3\.0|4\.0)/i.test(trimmedData);
			const versionMatch = trimmedData.match(/VERSION:(2\.1|3\.0|4\.0)/i);
			
			if (versionMatch) {
				patterns.push(`vCard ${versionMatch[1]}`);
			}


			if (hasEnd && hasVersion) {
				return {
					type: IntentType.CONTACT,
					confidence: 0.95,
					rawData: data,
					metadata: { patterns },
				};
			}

			return {
				type: IntentType.CONTACT,
				confidence: 0.85,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for vCard with VCARD: prefix
		if (this.vCardPrefixPattern.test(trimmedData)) {
			patterns.push("vCard prefix");
			return {
				type: IntentType.CONTACT,
				confidence: 0.9,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for MECARD format
		if (this.meCardPattern.test(trimmedData)) {
			patterns.push("MECARD format");
			
			// MECARD should have at least a name field (N:)
			const hasName = /N:/i.test(trimmedData);
			return {
				type: IntentType.CONTACT,
				confidence: hasName ? 0.9 : 0.75,
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
