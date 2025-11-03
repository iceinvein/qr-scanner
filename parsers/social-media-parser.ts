import type { ContentParser, ParsedContent, SocialMediaData } from "../types";

export class SocialMediaParser implements ContentParser<SocialMediaData> {
	parse(rawData: string): ParsedContent<SocialMediaData> {
		try {
			const url = new URL(rawData.trim());
			let platform: SocialMediaData["platform"] = "other";
			let username: string | undefined;

			if (url.hostname.includes("instagram")) {
				platform = "instagram";
				const pathParts = url.pathname.split("/").filter(Boolean);
				username = pathParts[0];
			} else if (url.hostname.includes("twitter") || url.hostname.includes("x.com")) {
				platform = "twitter";
				const pathParts = url.pathname.split("/").filter(Boolean);
				username = pathParts[0];
			} else if (url.hostname.includes("linkedin")) {
				platform = "linkedin";
				const pathParts = url.pathname.split("/").filter(Boolean);
				if (pathParts[0] === "in" || pathParts[0] === "company") {
					username = pathParts[1];
				}
			} else if (url.hostname.includes("facebook")) {
				platform = "facebook";
				const pathParts = url.pathname.split("/").filter(Boolean);
				username = pathParts[0];
			} else if (url.hostname.includes("tiktok")) {
				platform = "tiktok";
				const match = url.pathname.match(/@([^\/]+)/);
				if (match) username = match[1];
			} else if (url.hostname.includes("youtube")) {
				platform = "youtube";
				if (url.pathname.includes("/@")) {
					const match = url.pathname.match(/@([^\/]+)/);
					if (match) username = match[1];
				}
			} else if (url.hostname.includes("snapchat")) {
				platform = "snapchat";
				const pathParts = url.pathname.split("/").filter(Boolean);
				if (pathParts[0] === "add" || pathParts[0] === "t") {
					username = pathParts[1];
				}
			}

			return {
				success: true,
				data: {
					platform,
					username,
					profileUrl: rawData.trim(),
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse social media link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


