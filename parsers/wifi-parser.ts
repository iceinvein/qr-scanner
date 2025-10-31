import type { ContentParser, ParsedContent, WiFiData } from "../types";

export class WiFiParser implements ContentParser<WiFiData> {
	parse(rawData: string): ParsedContent<WiFiData> {
		try {
			const trimmedData = rawData.trim();

			// Check for standard WIFI: format
			if (trimmedData.startsWith("WIFI:")) {
				return this.parseStandardFormat(trimmedData);
			}

			// Check for plain text format with "and" (e.g., "networkname and password")
			const plainTextWithAndMatch = trimmedData.match(/^(.+?)\s+(?:and|&)\s+(.+)$/i);
			if (plainTextWithAndMatch) {
				const [, ssid, password] = plainTextWithAndMatch;
				return {
					success: true,
					data: {
						ssid: ssid.trim(),
						password: password.trim(),
						securityType: "WPA2", // Default to WPA2 for plain text format
						hidden: false,
					},
				};
			}

			// Check for space-separated format (e.g., "networkname password")
			const spaceSeparatedMatch = trimmedData.match(/^([^\s]{2,32})\s+([^\s]{8,63})$/);
			if (spaceSeparatedMatch) {
				const [, ssid, password] = spaceSeparatedMatch;
				return {
					success: true,
					data: {
						ssid: ssid.trim(),
						password: password.trim(),
						securityType: "WPA2", // Default to WPA2 for plain text format
						hidden: false,
					},
				};
			}

			return {
				success: false,
				error: "Invalid WiFi format: must be WIFI:... or 'networkname and password'",
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse WiFi data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private parseStandardFormat(rawData: string): ParsedContent<WiFiData> {
		const content = rawData.substring(5); // Remove 'WIFI:' prefix
		const fields: Record<string, string> = {};

		// Parse key-value pairs
		const regex = /([TSPH]):([^;]*);/g;
		let match: RegExpExecArray | null = null;
		match = regex.exec(content);
		while (match !== null) {
			fields[match[1]] = match[2];
			match = regex.exec(content);
		}

		// Validate required fields
		if (!fields.T) {
			return {
				success: false,
				error: "Missing required field: T (security type)",
			};
		}

		if (!fields.S) {
			return {
				success: false,
				error: "Missing required field: S (SSID)",
			};
		}

		const securityType = fields.T.toUpperCase();
		if (!["WPA", "WPA2", "WEP", "NOPASS"].includes(securityType)) {
			return {
				success: false,
				error: `Invalid security type: ${fields.T}`,
			};
		}

		return {
			success: true,
			data: {
				ssid: fields.S,
				password: fields.P || "",
				securityType:
					securityType.toLowerCase() === "nopass"
						? "nopass"
						: (securityType as "WPA" | "WPA2" | "WEP"),
				hidden: fields.H === "true",
			},
		};
	}
}
