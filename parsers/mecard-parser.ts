import type { ContentParser, MeCardData, ParsedContent } from "../types";

/**
 * MeCard Parser
 * Parses MeCard contact format
 * Format: MECARD:N:LastName,FirstName;TEL:Phone;EMAIL:Email;ADR:Address;URL:Website;MEMO:Note;;
 */
export class MeCardParser implements ContentParser<MeCardData> {
	parse(rawData: string): ParsedContent<MeCardData> {
		try {
			const trimmedData = rawData.trim();
			
			if (!trimmedData.startsWith("MECARD:")) {
				return {
					success: false,
					error: "Invalid MeCard format: must start with MECARD:",
				};
			}

			// Remove MECARD: prefix and trailing ;;
			let content = trimmedData.substring(7);
			if (content.endsWith(";;")) {
				content = content.substring(0, content.length - 2);
			}

			// Parse fields (simple parser, handles basic cases)
			const fields = this.parseFields(content);

			// Extract name
			const nameField = fields.get("N");
			let firstName: string | undefined;
			let lastName: string | undefined;
			let fullName: string | undefined;

			if (nameField) {
				if (nameField.includes(",")) {
					const nameParts = nameField.split(",");
					lastName = nameParts[0]?.trim();
					firstName = nameParts[1]?.trim();
					fullName = `${firstName} ${lastName}`.trim();
				} else {
					fullName = nameField;
				}
			}

			// Extract other fields
			const phone = fields.get("TEL") || fields.get("TELAV") || undefined;
			const email = fields.get("EMAIL") || undefined;
			const address = fields.get("ADR") || undefined;
			const url = fields.get("URL") || undefined;
			const memo = fields.get("MEMO") || fields.get("NOTE") || undefined;

			if (!fullName && !phone && !email) {
				return {
					success: false,
					error: "MeCard must contain at least a name, phone, or email",
				};
			}

			return {
				success: true,
				data: {
					name: {
						fullName,
						firstName,
						lastName,
					},
					phone,
					email,
					address,
					url,
					memo,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse MeCard: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	/**
	 * Parse MeCard fields
	 * Basic parser that handles most common cases
	 */
	private parseFields(content: string): Map<string, string> {
		const fields = new Map<string, string>();
		const regex = /([A-Z]+):((?:[^;\\]|\\[;\\:])*);/g;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(content)) !== null) {
			const key = match[1];
			const value = match[2].replace(/\\([;\\:])/g, "$1"); // Unescape special chars
			fields.set(key, value);
		}

		return fields;
	}
}


