import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * Email Detector
 * Detects email addresses and mailto: links
 * Supports: mailto:email@example.com?subject=Hello&body=Message
 */
export class EmailDetector implements IntentDetector {
	private readonly mailtoPattern = /^mailto:/i;
	private readonly emailPattern =
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];


		// Check for mailto: protocol
		if (this.mailtoPattern.test(trimmedData)) {
			patterns.push("mailto: protocol");

			// Extract email address (before ? or end of string)
			const emailMatch = trimmedData.match(
				/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\?|$)/i,
			);
			if (emailMatch) {
				patterns.push(`Email: ${emailMatch[1]}`);
			}

			// Check for additional parameters
			if (trimmedData.includes("?")) {
				const hasSubject = /[?&]subject=/i.test(trimmedData);
				const hasBody = /[?&]body=/i.test(trimmedData);
				const hasCc = /[?&]cc=/i.test(trimmedData);
				const hasBcc = /[?&]bcc=/i.test(trimmedData);

				if (hasSubject) patterns.push("Subject included");
				if (hasBody) patterns.push("Body included");
				if (hasCc) patterns.push("CC included");
				if (hasBcc) patterns.push("BCC included");
			}

			return {
				type: IntentType.EMAIL,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for plain email address
		if (this.emailPattern.test(trimmedData)) {
			patterns.push("Email address format");

			return {
				type: IntentType.EMAIL,
				confidence: 0.9,
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
