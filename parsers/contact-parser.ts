import type { ContactData, ContentParser, ParsedContent } from "../types";

export class ContactParser implements ContentParser<ContactData> {
	parse(rawData: string): ParsedContent<ContactData> {
		try {
			
			if (rawData.startsWith("BEGIN:VCARD") || rawData.startsWith("VCARD:")) {
				const result = this.parseVCard(rawData);
				return result;
			} else if (rawData.startsWith("MECARD:")) {
				const result = this.parseMECARD(rawData);
				return result;
			} else {
				return {
					success: false,
					error:
						"Invalid contact format: must start with BEGIN:VCARD, VCARD:, or MECARD:",
				};
			}
		} catch (error) {
			console.error("[ContactParser] Error parsing contact:", error);
			return {
				success: false,
				error: `Failed to parse contact data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private parseVCard(rawData: string): ParsedContent<ContactData> {
		const fields = this.parseVCardFields(rawData);

		const name = this.parseVCardName(fields);
		const phones = this.parseVCardPhones(fields);
		const emails = this.parseVCardEmails(fields);

		// Parse address: ADR format is PO Box;Extended;Street;City;State;Postal;Country
		let address: string | undefined;
		if (fields.ADR?.[0]) {
			const adrParts = fields.ADR[0].split(";").filter((part) => part.trim());
			address = adrParts.join(", ") || undefined;
		}

		return {
			success: true,
			data: {
				name,
				phones,
				emails,
				organization: fields.ORG?.[0],
				url: fields.URL?.[0],
				address,
			},
		};
	}

	private parseVCardFields(rawData: string): Record<string, string[]> {
		const fields: Record<string, string[]> = {};
		const lines = rawData.split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// Skip BEGIN and END lines
			if (line.startsWith("BEGIN:") || line.startsWith("END:")) {
				continue;
			}

			// Handle line folding (continuation lines start with space or tab)
			while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
				line += lines[i + 1].substring(1);
				i++;
			}

			const colonIndex = line.indexOf(":");
			if (colonIndex > 0) {
				const keyPart = line.substring(0, colonIndex);
				const value = line.substring(colonIndex + 1);

				// Extract the field name (before any parameters)
				const key = keyPart.split(";")[0];

				if (!fields[key]) {
					fields[key] = [];
				}
				fields[key].push(value);
			}
		}

		return fields;
	}

	private parseVCardName(
		fields: Record<string, string[]>,
	): ContactData["name"] {
		const name: ContactData["name"] = {
			formatted: fields.FN?.[0],
		};

		// Parse N field (Family;Given;Middle;Prefix;Suffix)
		if (fields.N?.[0]) {
			const parts = fields.N[0].split(";");
			name.family = parts[0] || undefined;
			name.given = parts[1] || undefined;
		}

		return name;
	}

	private parseVCardPhones(
		fields: Record<string, string[]>,
	): Array<{ type: string; number: string }> {
		const phones: Array<{ type: string; number: string }> = [];

		if (fields.TEL) {
			fields.TEL.forEach((tel) => {
				phones.push({
					type: "mobile", // Could be enhanced to parse TYPE parameter
					number: tel,
				});
			});
		}

		return phones;
	}

	private parseVCardEmails(
		fields: Record<string, string[]>,
	): Array<{ type: string; address: string }> {
		const emails: Array<{ type: string; address: string }> = [];

		if (fields.EMAIL) {
			fields.EMAIL.forEach((email, index) => {
				// Use empty type for single email, or numbered for multiple
				const type = fields.EMAIL.length === 1 ? "" : `email ${index + 1}`;
				emails.push({
					type,
					address: email,
				});
			});
		}

		return emails;
	}

	private parseMECARD(rawData: string): ParsedContent<ContactData> {
		const content = rawData.substring(7); // Remove 'MECARD:' prefix
		const fields: Record<string, string[]> = {};

		// Parse MECARD format: MECARD:N:Name;TEL:123456;EMAIL:test@example.com;;
		const regex = /([A-Z]+):([^;]*);/g;
		let match: RegExpExecArray | null = regex.exec(content);
		while (match !== null) {
			const key = match[1];
			const value = match[2];

			if (!fields[key]) {
				fields[key] = [];
			}
			fields[key].push(value);
			match = regex.exec(content);
		}

		const name: ContactData["name"] = {
			formatted: fields.N?.[0],
		};

		const phones: Array<{ type: string; number: string }> = [];
		if (fields.TEL) {
			fields.TEL.forEach((tel) => {
				phones.push({
					type: "mobile",
					number: tel,
				});
			});
		}

		const emails: Array<{ type: string; address: string }> = [];
		if (fields.EMAIL) {
			fields.EMAIL.forEach((email) => {
				emails.push({
					type: "home",
					address: email,
				});
			});
		}

		return {
			success: true,
			data: {
				name,
				phones,
				emails,
				organization: fields.ORG?.[0],
				url: fields.URL?.[0],
				address: fields.ADR?.[0],
			},
		};
	}
}
