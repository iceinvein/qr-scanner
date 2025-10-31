import type { ContentParser, ParsedContent, URLData } from "../types";

export class URLParser implements ContentParser<URLData> {
	parse(rawData: string): ParsedContent<URLData> {
		try {
			const url = new URL(rawData);

			const queryParams: Record<string, string> = {};
			url.searchParams.forEach((value, key) => {
				queryParams[key] = value;
			});

			return {
				success: true,
				data: {
					protocol: url.protocol.replace(":", ""),
					domain: url.hostname,
					path: url.pathname,
					queryParams,
					fragment: url.hash ? url.hash.substring(1) : undefined,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}
