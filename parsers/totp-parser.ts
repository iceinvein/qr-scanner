import type { ContentParser, ParsedContent, TOTPData } from "../types";

/**
 * TOTP/OTP Parser
 * Parses otpauth:// URIs for TOTP and HOTP
 * Format: otpauth://TYPE/LABEL?PARAMETERS
 */
export class TOTPParser implements ContentParser<TOTPData> {
	parse(rawData: string): ParsedContent<TOTPData> {
		try {
			// Parse the otpauth:// URI
			const url = new URL(rawData.trim());

			if (url.protocol !== "otpauth:") {
				return {
					success: false,
					error: "Invalid OTP URI: must start with otpauth://",
				};
			}

			// Get type (totp or hotp)
			const type = url.hostname.toLowerCase() as "totp" | "hotp";
			if (type !== "totp" && type !== "hotp") {
				return {
					success: false,
					error: `Invalid OTP type: ${type}`,
				};
			}

			// Get label (issuer:accountname or just accountname)
			const label = decodeURIComponent(url.pathname.substring(1));
			let issuer: string | undefined;
			let accountName: string | undefined;

			if (label.includes(":")) {
				const parts = label.split(":");
				issuer = parts[0];
				accountName = parts.slice(1).join(":");
			} else {
				accountName = label;
			}

			// Get secret (required)
			const secret = url.searchParams.get("secret");
			if (!secret) {
				return {
					success: false,
					error: "Missing required secret parameter",
				};
			}

			// Get optional parameters
			const issuerParam = url.searchParams.get("issuer");
			if (issuerParam) {
				issuer = issuerParam; // issuer parameter takes precedence over label
			}

			const algorithm = url.searchParams.get("algorithm") || "SHA1";
			const digits = Number.parseInt(url.searchParams.get("digits") || "6", 10);
			const period = Number.parseInt(url.searchParams.get("period") || "30", 10);
			const counter = url.searchParams.get("counter")
				? Number.parseInt(url.searchParams.get("counter")!, 10)
				: undefined;

			return {
				success: true,
				data: {
					type,
					secret,
					issuer,
					accountName,
					algorithm,
					digits,
					period: type === "totp" ? period : undefined,
					counter: type === "hotp" ? counter : undefined,
					rawUri: rawData.trim(),
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse OTP URI: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


