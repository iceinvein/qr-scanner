import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * EPC/SEPA Payment Detector
 * Detects European Payment Council (EPC) QR codes for SEPA payments
 * Format starts with BCD (Binary Coded Decimal) or EPC
 */
export class EPCPaymentDetector implements IntentDetector {
	private readonly epcPattern = /^(BCD|EPC)\n/;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const patterns: string[] = [];

		// Check for EPC/BCD format
		if (this.epcPattern.test(data)) {
			patterns.push("EPC/SEPA payment");
			return {
				type: IntentType.EPC_PAYMENT,
				confidence: 0.99,
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


