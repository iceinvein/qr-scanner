import type { ContentParser, ParsedContent, VideoConferenceData } from "../types";

export class VideoConferenceParser implements ContentParser<VideoConferenceData> {
	parse(rawData: string): ParsedContent<VideoConferenceData> {
		try {
			const url = new URL(rawData.trim());
			let platform: VideoConferenceData["platform"] = "other";
			let meetingId: string | undefined;
			let password: string | undefined;

			if (url.hostname.includes("zoom")) {
				platform = "zoom";
				// Extract meeting ID from path (e.g., /j/1234567890)
				const match = url.pathname.match(/\/(j|w)\/(\d+)/);
				if (match) meetingId = match[2];
				password = url.searchParams.get("pwd") || undefined;
			} else if (url.hostname.includes("meet.google")) {
				platform = "meet";
				// Extract meeting code from path
				meetingId = url.pathname.split("/").filter(Boolean).pop();
			} else if (url.hostname.includes("teams.microsoft")) {
				platform = "teams";
			} else if (url.hostname.includes("webex")) {
				platform = "webex";
			}

			return {
				success: true,
				data: {
					platform,
					meetingId,
					password,
					url: rawData.trim(),
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse video conference link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


