import type { ContentParser, MusicMediaData, ParsedContent } from "../types";

export class MusicMediaParser implements ContentParser<MusicMediaData> {
	parse(rawData: string): ParsedContent<MusicMediaData> {
		try {
			const url = new URL(rawData.trim());
			let platform: MusicMediaData["platform"] = "other";
			let type: MusicMediaData["type"] = "other";
			let id: string | undefined;

			if (url.hostname.includes("spotify")) {
				platform = "spotify";
				const match = url.pathname.match(/\/(track|album|playlist|artist)\/([^?\/]+)/);
				if (match) {
					type = match[1] as MusicMediaData["type"];
					id = match[2];
				}
			} else if (url.hostname.includes("youtube") || url.hostname.includes("youtu.be")) {
				platform = "youtube";
				if (url.hostname === "youtu.be") {
					id = url.pathname.substring(1);
					type = "video";
				} else if (url.searchParams.has("v")) {
					id = url.searchParams.get("v") || undefined;
					type = "video";
				} else if (url.pathname.includes("/channel/")) {
					type = "channel";
					id = url.pathname.split("/channel/")[1];
				}
			} else if (url.hostname.includes("apple.com")) {
				platform = "apple_music";
				if (url.pathname.includes("/album/")) {
					type = "album";
				} else if (url.pathname.includes("/playlist/")) {
					type = "playlist";
				} else if (url.pathname.includes("/artist/")) {
					type = "artist";
				}
			} else if (url.hostname.includes("soundcloud")) {
				platform = "soundcloud";
				const pathParts = url.pathname.split("/").filter(Boolean);
				if (pathParts.length >= 2) {
					type = pathParts[1].includes("sets") ? "playlist" : "track";
				}
			}

			return {
				success: true,
				data: {
					platform,
					type,
					id,
					url: rawData.trim(),
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse music/media link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


