import type { ContentParser, ParsedContent, TelegramData } from "../types";

/**
 * Telegram Parser
 * Parses Telegram links (t.me, telegram.me, tg://)
 */
export class TelegramParser implements ContentParser<TelegramData> {
	parse(rawData: string): ParsedContent<TelegramData> {
		try {
			const trimmedData = rawData.trim();
			let type: "user" | "channel" | "group" | "bot" = "user";
			let username: string | undefined;
			let phoneNumber: string | undefined;
			let chatId: string | undefined;
			let text: string | undefined;

			if (trimmedData.startsWith("tg://")) {
				// Format: tg://resolve?domain=username or tg://msg?to=phone&text=message
				const url = new URL(trimmedData);
				const action = url.pathname.replace("//", "");

				if (action === "resolve") {
					username = url.searchParams.get("domain") || undefined;
				} else if (action === "msg") {
					const to = url.searchParams.get("to");
					if (to?.startsWith("+")) {
						phoneNumber = to;
					} else {
						username = to || undefined;
					}
					text = url.searchParams.get("text") || undefined;
				} else if (action === "join") {
					chatId = url.searchParams.get("invite") || undefined;
					type = "group";
				}
			} else {
				// Format: https://t.me/username or https://t.me/+phonenumber
				const url = new URL(trimmedData);
				const pathParts = url.pathname.split("/").filter(Boolean);
				
				if (pathParts.length > 0) {
					const identifier = pathParts[0];
					
					if (identifier.startsWith("+")) {
						// It's a phone number or invite link
						if (identifier.length > 12) {
							chatId = identifier;
							type = "group";
						} else {
							phoneNumber = identifier;
						}
					} else {
						username = identifier;
						
						// Determine type based on username pattern
						if (username.toLowerCase().endsWith("bot")) {
							type = "bot";
						} else if (url.searchParams.has("start")) {
							type = "bot";
						}
					}
					
					// Check for pre-filled message
					text = url.searchParams.get("text") || url.searchParams.get("start") || undefined;
				}
			}

			if (!username && !phoneNumber && !chatId) {
				return {
					success: false,
					error: "No valid Telegram identifier found",
				};
			}

			return {
				success: true,
				data: {
					type,
					username,
					phoneNumber,
					chatId,
					text,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse Telegram link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


