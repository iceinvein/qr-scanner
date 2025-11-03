import type { AppStoreData, ContentParser, ParsedContent } from "../types";

export class AppStoreParser implements ContentParser<AppStoreData> {
	parse(rawData: string): ParsedContent<AppStoreData> {
		try {
			const url = new URL(rawData.trim());
			let store: AppStoreData["store"] = "other";
			let appId = "";

			if (url.hostname.includes("apple.com")) {
				store = "apple";
				// Extract app ID from path (e.g., /us/app/app-name/id123456789)
				const match = url.pathname.match(/\/id(\d+)/);
				if (match) {
					appId = match[1];
				}
			} else if (url.hostname.includes("play.google.com")) {
				store = "google";
				// Extract app ID from query param (e.g., ?id=com.example.app)
				appId = url.searchParams.get("id") || "";
			}

			if (!appId) {
				return {
					success: false,
					error: "No app ID found in store link",
				};
			}

			return {
				success: true,
				data: {
					store,
					appId,
					url: rawData.trim(),
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse app store link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


