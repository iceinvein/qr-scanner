import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Video Conference Detector
 * Detects video conferencing links (Zoom, Google Meet, Microsoft Teams, Webex)
 */
export class VideoConferenceDetector implements IntentDetector {
	private readonly zoomPattern = /^https?:\/\/([\w-]+\.)?zoom\.(us|com)\/(j|w)\/\d+/i;
	private readonly meetPattern = /^https?:\/\/meet\.google\.com\//i;
	private readonly teamsPattern = /^https?:\/\/teams\.microsoft\.com\/(l\/meetup-join|dl\/launcher\/launcher\.html)/i;
	private readonly webexPattern = /^https?:\/\/([\w-]+\.)?webex\.com\/(meet|join)\//i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for Zoom
		if (this.zoomPattern.test(trimmedData)) {
			patterns.push("Zoom meeting");
			return {
				type: IntentType.VIDEO_CONFERENCE,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Google Meet
		if (this.meetPattern.test(trimmedData)) {
			patterns.push("Google Meet");
			return {
				type: IntentType.VIDEO_CONFERENCE,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Microsoft Teams
		if (this.teamsPattern.test(trimmedData)) {
			patterns.push("Microsoft Teams");
			return {
				type: IntentType.VIDEO_CONFERENCE,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for Webex
		if (this.webexPattern.test(trimmedData)) {
			patterns.push("Webex");
			return {
				type: IntentType.VIDEO_CONFERENCE,
				confidence: 0.98,
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


