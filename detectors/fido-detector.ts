import {
	IntentType,
	type DetectedIntent,
	type IntentDetector,
	type ScanResult,
} from "../types";

/**
 * FIDO Detector
 * Detects FIDO (Fast Identity Online) authentication QR codes
 * Supports various FIDO formats including FIDO2/WebAuthn
 */
export class FIDODetector implements IntentDetector {
	// FIDO URI schemes and patterns
	private readonly fidoSchemePattern = /^fido:\/\//i;
	private readonly webauthnPattern = /^webauthn:\/\//i;
	private readonly fidoJsonPattern = /^\{.*"type"\s*:\s*"(webauthn|fido2?)"/i;
	private readonly fidoU2FPattern = /^U2F_V2/;
	
	// FIDO-specific keywords
	private readonly fidoKeywords = [
		'credentialId',
		'rpId',
		'challenge',
		'publicKey',
		'attestation',
		'allowCredentials',
		'authenticatorData'
	];

	detect(scanResult: ScanResult): DetectedIntent {
		const { data } = scanResult;
		const trimmedData = data.trim();
		const patterns: string[] = [];

		// Check for explicit FIDO URI scheme
		if (this.fidoSchemePattern.test(trimmedData)) {
			patterns.push("FIDO URI scheme");
			return {
				type: IntentType.FIDO,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for WebAuthn URI scheme
		if (this.webauthnPattern.test(trimmedData)) {
			patterns.push("WebAuthn URI scheme");
			return {
				type: IntentType.FIDO,
				confidence: 0.98,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for U2F format
		if (this.fidoU2FPattern.test(trimmedData)) {
			patterns.push("U2F format");
			return {
				type: IntentType.FIDO,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for FIDO JSON format
		if (this.fidoJsonPattern.test(trimmedData)) {
			patterns.push("FIDO/WebAuthn JSON");
			return {
				type: IntentType.FIDO,
				confidence: 0.95,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for FIDO-specific keywords in data
		const lowercaseData = trimmedData.toLowerCase();
		const matchedKeywords = this.fidoKeywords.filter(keyword => 
			lowercaseData.includes(keyword.toLowerCase())
		);

		// If data contains multiple FIDO keywords, it's likely a FIDO credential
		if (matchedKeywords.length >= 3) {
			patterns.push(`FIDO keywords: ${matchedKeywords.join(', ')}`);
			return {
				type: IntentType.FIDO,
				confidence: 0.85,
				rawData: data,
				metadata: { patterns },
			};
		}

		// Check for base64-encoded FIDO data (common in WebAuthn)
		if (this.looksLikeFidoBase64(trimmedData)) {
			patterns.push("Base64-encoded FIDO data");
			return {
				type: IntentType.FIDO,
				confidence: 0.75,
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

	/**
	 * Check if data looks like base64-encoded FIDO credential
	 * FIDO credentials are typically long base64 strings with specific length
	 */
	private looksLikeFidoBase64(data: string): boolean {
		// Base64 pattern with proper length for FIDO credentials
		const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
		
		// FIDO credentials are typically 64-256 characters when base64 encoded
		if (data.length >= 64 && data.length <= 512 && base64Pattern.test(data)) {
			// Additional check: should not look like a regular URL or email
			if (data.includes('http') || data.includes('@') || data.includes('.com')) {
				return false;
			}
			return true;
		}
		
		return false;
	}
}

