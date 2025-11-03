import type { ContentParser, ParsedContent, WhatsAppData } from "../types";

/**
 * WhatsApp Parser
 * Parses WhatsApp links (wa.me, api.whatsapp.com, whatsapp://)
 */
export class WhatsAppParser implements ContentParser<WhatsAppData> {
	parse(rawData: string): ParsedContent<WhatsAppData> {
		try {
			const trimmedData = rawData.trim();
			let phoneNumber = "";
			let text: string | undefined;

			// Parse different WhatsApp formats
			if (trimmedData.startsWith("whatsapp://")) {
				// Format: whatsapp://send?phone=1234567890&text=Hello
				const url = new URL(trimmedData);
				phoneNumber = url.searchParams.get("phone") || "";
				text = url.searchParams.get("text") || undefined;
			} else if (trimmedData.includes("wa.me/")) {
				// Format: https://wa.me/1234567890?text=Hello
				const url = new URL(trimmedData);
				const pathParts = url.pathname.split("/").filter(Boolean);
				phoneNumber = pathParts[pathParts.length - 1];
				text = url.searchParams.get("text") || undefined;
			} else if (trimmedData.includes("api.whatsapp.com/")) {
				// Format: https://api.whatsapp.com/send?phone=1234567890&text=Hello
				const url = new URL(trimmedData);
				phoneNumber = url.searchParams.get("phone") || "";
				text = url.searchParams.get("text") || undefined;
			}

			if (!phoneNumber) {
				return {
					success: false,
					error: "No phone number found in WhatsApp link",
				};
			}

			// Format the phone number for display
			const cleanNumber = phoneNumber.replace(/\D/g, "");
			const formattedNumber = this.formatPhoneNumber(cleanNumber);

			return {
				success: true,
				data: {
					phoneNumber: cleanNumber,
					text: text ? decodeURIComponent(text) : undefined,
					formattedNumber,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse WhatsApp link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private formatPhoneNumber(number: string): string {
		// Simple formatting: +X XXX XXX XXXX
		if (number.length > 10) {
			const countryCode = number.slice(0, -10);
			const areaCode = number.slice(-10, -7);
			const firstPart = number.slice(-7, -4);
			const secondPart = number.slice(-4);
			return `+${countryCode} ${areaCode} ${firstPart} ${secondPart}`;
		}
		return `+${number}`;
	}
}


