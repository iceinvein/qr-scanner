import {
    IntentType,
    type DetectedIntent,
    type IntentDetector,
    type ScanResult,
} from "../types";

/**
 * Event Detector
 * Detects calendar events in iCalendar and vCalendar formats
 */
export class EventDetector implements IntentDetector {
	private readonly iCalendarPattern = /BEGIN:VEVENT/i;
	private readonly vCalendarPattern = /VEVENT:/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();


		// Check for iCalendar format (BEGIN:VEVENT)
		if (this.iCalendarPattern.test(trimmedData)) {
			// Verify it has END:VEVENT for completeness
			const hasEnd = /END:VEVENT/i.test(trimmedData);
			return {
				type: IntentType.EVENT,
				confidence: hasEnd ? 0.95 : 0.85,
				rawData: data,
			};
		}

		// Check for vCalendar format (VEVENT:)
		if (this.vCalendarPattern.test(trimmedData)) {
			return {
				type: IntentType.EVENT,
				confidence: 0.9,
				rawData: data,
			};
		}

		return {
			type: IntentType.UNKNOWN,
			confidence: 0,
			rawData: data,
		};
	}
}
