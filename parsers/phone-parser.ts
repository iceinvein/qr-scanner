import type { ContentParser, ParsedContent, PhoneData } from "../types/parsers";

/**
 * Phone Parser
 * Parses phone numbers in various formats
 */
export class PhoneParser implements ContentParser<PhoneData> {
	parse(rawData: string): ParsedContent<PhoneData> {
		try {
			let number = rawData.trim();

			// Remove tel: prefix if present
			if (/^tel:/i.test(number)) {
				number = number.replace(/^tel:/i, "");
			}

			// Extract country code if present
			const countryCodeMatch = number.match(/^\+(\d{1,3})/);
			const countryCode = countryCodeMatch ? countryCodeMatch[1] : undefined;

			// Format the number for display
			const formatted = this.formatPhoneNumber(number);

			const data: PhoneData = {
				number,
				formatted,
				countryCode,
				type: "unknown",
			};

			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to parse phone",
			};
		}
	}

	private formatPhoneNumber(number: string): string {
		// Remove all non-digit characters except +
		const cleaned = number.replace(/[^\d+]/g, "");

		// Basic formatting for display
		if (cleaned.startsWith("+")) {
			// International format
			return cleaned;
		}

		// US format (if 10 digits)
		if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
		}

		return cleaned;
	}
}
