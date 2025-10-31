import type { ContentParser, EmailData, ParsedContent } from "../types/parsers";

/**
 * Email Parser
 * Parses email addresses and mailto: links
 */
export class EmailParser implements ContentParser<EmailData> {
	parse(rawData: string): ParsedContent<EmailData> {
		try {
			const trimmedData = rawData.trim();

			// Parse mailto: link
			if (/^mailto:/i.test(trimmedData)) {
				const url = new URL(trimmedData);
				const address = url.pathname;
				const params = new URLSearchParams(url.search);

				const data: EmailData = {
					address,
					subject: params.get("subject") || undefined,
					body: params.get("body") || undefined,
					cc: params.get("cc")?.split(",") || undefined,
					bcc: params.get("bcc")?.split(",") || undefined,
				};

				return { success: true, data };
			}

			// Parse plain email address
			const data: EmailData = {
				address: trimmedData,
			};

			return { success: true, data };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Failed to parse email",
			};
		}
	}
}
