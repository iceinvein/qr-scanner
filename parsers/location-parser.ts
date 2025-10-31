import type {
	ContentParser,
	LocationData,
	ParsedContent,
} from "../types/parsers";

/**
 * Location Parser
 * Parses geographic coordinates and map links
 */
export class LocationParser implements ContentParser<LocationData> {
	parse(rawData: string): ParsedContent<LocationData> {
		try {
			const trimmedData = rawData.trim();

			// Parse geo: format (geo:37.7749,-122.4194?q=label)
			if (/^geo:/i.test(trimmedData)) {
				const match = trimmedData.match(
					/^geo:([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)(\?(.+))?/i,
				);
				if (match) {
					const params = new URLSearchParams(match[4] || "");
					const data: LocationData = {
						latitude: Number.parseFloat(match[1]),
						longitude: Number.parseFloat(match[2]),
						label: params.get("q") || undefined,
						zoom: params.get("z")
							? Number.parseInt(params.get("z")!)
							: undefined,
					};
					return { success: true, data };
				}
			}

			// Parse Google Maps URL
			if (/google\.com\/maps|maps\.google\.com/i.test(trimmedData)) {
				const url = new URL(trimmedData);
				const params = new URLSearchParams(url.search);

				// Try to extract coordinates from query
				const query = params.get("q");
				if (query) {
					const coordMatch = query.match(/([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)/);
					if (coordMatch) {
						const data: LocationData = {
							latitude: Number.parseFloat(coordMatch[1]),
							longitude: Number.parseFloat(coordMatch[2]),
							query,
						};
						return { success: true, data };
					}
				}

				// Try to extract from path (/@lat,lng format)
				const pathMatch = url.pathname.match(/@([-+]?\d+\.?\d*),([-+]?\d+\.?\d*)/);
				if (pathMatch) {
					const data: LocationData = {
						latitude: Number.parseFloat(pathMatch[1]),
						longitude: Number.parseFloat(pathMatch[2]),
					};
					return { success: true, data };
				}
			}

			// Parse plain coordinates
			const coordMatch = trimmedData.match(
				/^([-+]?\d+\.?\d*),\s*([-+]?\d+\.?\d*)$/,
			);
			if (coordMatch) {
				const data: LocationData = {
					latitude: Number.parseFloat(coordMatch[1]),
					longitude: Number.parseFloat(coordMatch[2]),
				};
				return { success: true, data };
			}

			return {
				success: false,
				error: "Invalid location format",
			};
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to parse location",
			};
		}
	}
}
