import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Social Media Detector
 * Detects social media profile links
 */
export class SocialMediaDetector implements IntentDetector {
	private readonly instagramPattern = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i;
	private readonly twitterPattern = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i;
	private readonly linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\//i;
	private readonly facebookPattern = /^https?:\/\/(www\.)?facebook\.com\//i;
	private readonly tiktokPattern = /^https?:\/\/(www\.)?tiktok\.com\/@/i;
	private readonly youtubeChannelPattern = /^https?:\/\/(www\.)?(youtube\.com\/(c\/|channel\/|@)|youtu\.be\/)/i;
	private readonly snapchatPattern = /^https?:\/\/(www\.)?snapchat\.com\/(add|t)\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for Instagram
		if (this.instagramPattern.test(trimmedData)) {
			patterns.push("Instagram profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Twitter/X
		if (this.twitterPattern.test(trimmedData)) {
			patterns.push("Twitter/X profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for LinkedIn
		if (this.linkedinPattern.test(trimmedData)) {
			patterns.push("LinkedIn profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Facebook
		if (this.facebookPattern.test(trimmedData)) {
			patterns.push("Facebook profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for TikTok
		if (this.tiktokPattern.test(trimmedData)) {
			patterns.push("TikTok profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for YouTube channel
		if (this.youtubeChannelPattern.test(trimmedData)) {
			patterns.push("YouTube channel");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.92,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Snapchat
		if (this.snapchatPattern.test(trimmedData)) {
			patterns.push("Snapchat profile");
			return {
				type: IntentType.SOCIAL_MEDIA,
				confidence: 0.95,
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


