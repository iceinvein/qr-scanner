import type { ContentParser, ParsedContent, SMSData } from "../types/parsers";

/**
 * SMS Parser
 * Parses SMS/text message links
 */
export class SMSParser implements ContentParser<SMSData> {
	parse(rawData: string): ParsedContent<SMSData> {
		try {
			const trimmedData = rawData.trim();

			// Parse sms: format (sms:+1234567890?body=Hello)
			if (/^sms:/i.test(trimmedData)) {
				const match = trimmedData.match(/^sms:([^?]+)(\?body=(.+))?/i);
				if (match) {
					const data: SMSData = {
						number: match[1],
						message: match[3] ? decodeURIComponent(match[3]) : undefined,
					};
					return { success: true, data };
				}
			}

			// Parse smsto: format (smsto:+1234567890:Hello)
			if (/^smsto:/i.test(trimmedData)) {
				const match = trimmedData.match(/^smsto:([^:]+):?(.+)?/i);
				if (match) {
					const data: SMSData = {
						number: match[1],
						message: match[2] || undefined,
					};
					return { success: true, data };
				}
			}

			return {
				success: false,
				error: "Invalid SMS format",
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to parse SMS",
			};
		}
	}
}
