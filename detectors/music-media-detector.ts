import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Music/Media Detector
 * Detects music and media platform links
 */
export class MusicMediaDetector implements IntentDetector {
	private readonly spotifyPattern = /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist|artist)\//i;
	private readonly youtubePattern = /^https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/)/i;
	private readonly appleMusicPattern = /^https?:\/\/(music\.)?apple\.com\//i;
	private readonly soundcloudPattern = /^https?:\/\/(www\.)?soundcloud\.com\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for Spotify
		if (this.spotifyPattern.test(trimmedData)) {
			patterns.push("Spotify");
			return {
				type: IntentType.MUSIC_MEDIA,
				confidence: 0.96,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for YouTube video
		if (this.youtubePattern.test(trimmedData)) {
			patterns.push("YouTube video");
			return {
				type: IntentType.MUSIC_MEDIA,
				confidence: 0.94,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Apple Music
		if (this.appleMusicPattern.test(trimmedData)) {
			patterns.push("Apple Music");
			return {
				type: IntentType.MUSIC_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for SoundCloud
		if (this.soundcloudPattern.test(trimmedData)) {
			patterns.push("SoundCloud");
			return {
				type: IntentType.MUSIC_MEDIA,
				confidence: 0.94,
				rawData: data,
				metadata: { patterns },
			};
		}

		return {
			type: IntentType.UNKNOWN,
			confidence: 0,
			rawData: data,
		};
	}
}


