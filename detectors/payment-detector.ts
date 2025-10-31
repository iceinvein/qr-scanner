import {
    IntentType,
    type DetectedIntent,
    type IntentDetector,
    type ScanResult,
} from "../types";

/**
 * Payment Detector
 * Detects cryptocurrency addresses and payment URIs
 */
export class PaymentDetector implements IntentDetector {
	// Bitcoin address patterns (P2PKH, P2SH, Bech32)
	private readonly bitcoinPattern =
		/^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,87})$/;

	// Ethereum address pattern (0x followed by 40 hex characters)
	private readonly ethereumPattern = /^0x[a-fA-F0-9]{40}$/;

	// Payment URI patterns
	private readonly bitcoinURIPattern = /^bitcoin:/i;
	private readonly ethereumURIPattern = /^ethereum:/i;

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();


		// Check for payment URIs first (higher confidence)
		if (this.bitcoinURIPattern.test(trimmedData)) {
			return {
				type: IntentType.PAYMENT,
				confidence: 0.95,
				rawData: data,
			};
		}

		if (this.ethereumURIPattern.test(trimmedData)) {
			return {
				type: IntentType.PAYMENT,
				confidence: 0.95,
				rawData: data,
			};
		}

		// Check for cryptocurrency addresses
		if (this.bitcoinPattern.test(trimmedData)) {
			return {
				type: IntentType.PAYMENT,
				confidence: 0.9,
				rawData: data,
			};
		}

		if (this.ethereumPattern.test(trimmedData)) {
			return {
				type: IntentType.PAYMENT,
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
