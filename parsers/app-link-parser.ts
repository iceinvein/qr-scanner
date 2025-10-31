import type { AppLinkData, ContentParser, ParsedContent } from "../types";

export class AppLinkParser implements ContentParser<AppLinkData> {
	parse(rawData: string): ParsedContent<AppLinkData> {
		try {
			// Parse the URL-like structure
			const colonIndex = rawData.indexOf(":");
			if (colonIndex === -1) {
				return {
					success: false,
					error: "Invalid app link format: missing scheme separator",
				};
			}

			const scheme = rawData.substring(0, colonIndex);
			const rest = rawData.substring(colonIndex + 1);

			// Remove leading slashes
			const cleanRest = rest.replace(/^\/+/, "");

			// Parse host, path, and query parameters
			let host: string | undefined;
			let path: string | undefined;
			const params: Record<string, string> = {};
			let fallbackUrl: string | undefined;

			// Check if there's a host (double slash after scheme)
			if (rest.startsWith("//")) {
				const slashIndex = cleanRest.indexOf("/");
				const questionIndex = cleanRest.indexOf("?");

				if (slashIndex > 0) {
					host = cleanRest.substring(0, slashIndex);
					const pathStart = slashIndex;
					const pathEnd = questionIndex > 0 ? questionIndex : cleanRest.length;
					path = cleanRest.substring(pathStart, pathEnd);
				} else if (questionIndex > 0) {
					host = cleanRest.substring(0, questionIndex);
				} else {
					host = cleanRest;
				}

				// Parse query parameters
				if (questionIndex > 0) {
					const queryString = cleanRest.substring(questionIndex + 1);
					const urlParams = new URLSearchParams(queryString);
					urlParams.forEach((value, key) => {
						params[key] = value;
					});

					// Check for fallback URL
					fallbackUrl = params.fallback_url || params.fallbackUrl || undefined;
				}
			} else {
				// No host, just path and params
				const questionIndex = cleanRest.indexOf("?");

				if (questionIndex > 0) {
					path = cleanRest.substring(0, questionIndex);
					const queryString = cleanRest.substring(questionIndex + 1);
					const urlParams = new URLSearchParams(queryString);
					urlParams.forEach((value, key) => {
						params[key] = value;
					});

					fallbackUrl = params.fallback_url || params.fallbackUrl || undefined;
				} else {
					path = cleanRest;
				}
			}

			return {
				success: true,
				data: {
					scheme,
					host,
					path,
					params,
					fallbackUrl,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse app link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}
