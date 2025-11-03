import type { ContentParser, FIDOData, ParsedContent } from "../types";

/**
 * FIDO Parser
 * Parses FIDO (Fast Identity Online) authentication data
 * Supports FIDO2/WebAuthn formats
 */
export class FIDOParser implements ContentParser<FIDOData> {
	parse(rawData: string): ParsedContent<FIDOData> {
		try {
			const trimmedData = rawData.trim();
			
			// Try to parse FIDO URI scheme (fido:// or webauthn://)
			if (trimmedData.startsWith("fido://") || trimmedData.startsWith("webauthn://")) {
				return this.parseFidoUri(trimmedData);
			}

			// Try to parse U2F format
			if (trimmedData.startsWith("U2F_V2")) {
				return this.parseU2FFormat(trimmedData);
			}

			// Try to parse JSON format (WebAuthn)
			if (trimmedData.startsWith("{") && trimmedData.includes("type")) {
				return this.parseFidoJson(trimmedData);
			}

			// Try to parse as base64-encoded credential
			if (this.isBase64(trimmedData)) {
				return this.parseBase64Credential(trimmedData);
			}

			// Fallback: treat as raw FIDO data
			return {
				success: true,
				data: {
					protocol: "fido",
					rawData: trimmedData,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse FIDO data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	/**
	 * Parse FIDO URI format (fido://... or webauthn://...)
	 */
	private parseFidoUri(data: string): ParsedContent<FIDOData> {
		try {
			const url = new URL(data);
			const protocol = url.protocol.replace(":", "");
			
			const result: FIDOData = {
				protocol,
				rawData: data,
			};

			// Extract parameters from URL
			const rpId = url.searchParams.get("rpId") || url.hostname;
			if (rpId) result.rpId = rpId;

			const credentialId = url.searchParams.get("credentialId");
			if (credentialId) result.credentialId = credentialId;

			const challenge = url.searchParams.get("challenge");
			if (challenge) result.challenge = challenge;

			const userId = url.searchParams.get("userId");
			if (userId) result.userId = userId;

			const attestation = url.searchParams.get("attestation");
			if (attestation) result.attestation = attestation;

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			return {
				success: false,
				error: `Invalid FIDO URI: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	/**
	 * Parse U2F format
	 */
	private parseU2FFormat(data: string): ParsedContent<FIDOData> {
		// U2F format: U2F_V2:base64data
		const parts = data.split(":");
		
		if (parts.length < 2) {
			return {
				success: false,
				error: "Invalid U2F format",
			};
		}

		return {
			success: true,
			data: {
				protocol: "u2f",
				credentialId: parts[1],
				rawData: data,
			},
		};
	}

	/**
	 * Parse FIDO/WebAuthn JSON format
	 */
	private parseFidoJson(data: string): ParsedContent<FIDOData> {
		try {
			const json = JSON.parse(data);
			
			const result: FIDOData = {
				protocol: json.type || "fido2",
				rawData: data,
			};

			// Extract common WebAuthn fields
			if (json.credentialId) result.credentialId = json.credentialId;
			if (json.rpId) result.rpId = json.rpId;
			if (json.challenge) result.challenge = json.challenge;
			if (json.userId || json.user?.id) result.userId = json.userId || json.user.id;
			if (json.attestation) result.attestation = json.attestation;

			// Handle nested structures
			if (json.publicKey) {
				if (json.publicKey.rpId) result.rpId = json.publicKey.rpId;
				if (json.publicKey.challenge) result.challenge = json.publicKey.challenge;
			}

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			return {
				success: false,
				error: `Invalid FIDO JSON: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	/**
	 * Parse base64-encoded FIDO credential
	 */
	private parseBase64Credential(data: string): ParsedContent<FIDOData> {
		try {
			// Attempt to decode and see if it's valid
			const decoded = atob(data);
			
			// Check if decoded data looks like FIDO credential
			// (contains binary data or JSON)
			let parsedData: FIDOData;
			
			try {
				// Try to parse as JSON first
				const json = JSON.parse(decoded);
				parsedData = {
					protocol: json.type || "fido2",
					credentialId: data, // Keep original base64 as credential ID
					rawData: data,
				};
				
				if (json.rpId) parsedData.rpId = json.rpId;
				if (json.challenge) parsedData.challenge = json.challenge;
			} catch {
				// Not JSON, treat as binary credential
				parsedData = {
					protocol: "fido",
					credentialId: data,
					rawData: data,
				};
			}

			return {
				success: true,
				data: parsedData,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to decode base64 credential: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	/**
	 * Check if string is valid base64
	 */
	private isBase64(str: string): boolean {
		try {
			return /^[A-Za-z0-9+/]+=*$/.test(str) && str.length % 4 === 0;
		} catch {
			return false;
		}
	}
}

