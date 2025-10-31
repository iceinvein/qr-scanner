import type { ContentParser, ParsedContent, PaymentData } from "../types";

export class PaymentParser implements ContentParser<PaymentData> {
	private readonly BITCOIN_REGEX =
		/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,87}$/;
	private readonly ETHEREUM_REGEX = /^0x[a-fA-F0-9]{40}$/;

	parse(rawData: string): ParsedContent<PaymentData> {
		try {
			// Check if it's a payment URI (bitcoin:, ethereum:, etc.)
			if (rawData.includes(":")) {
				return this.parsePaymentURI(rawData);
			}

			// Check if it's a cryptocurrency address
			return this.parseCryptoAddress(rawData);
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse payment data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private parsePaymentURI(rawData: string): ParsedContent<PaymentData> {
		try {
			const colonIndex = rawData.indexOf(":");
			const scheme = rawData.substring(0, colonIndex).toLowerCase();
			const rest = rawData.substring(colonIndex + 1);

			let currency: string;
			if (scheme === "bitcoin") {
				currency = "BTC";
			} else if (scheme === "ethereum") {
				currency = "ETH";
			} else {
				return {
					success: false,
					error: `Unsupported payment scheme: ${scheme}`,
				};
			}

			// Parse address and query parameters
			const questionIndex = rest.indexOf("?");
			const address =
				questionIndex > 0 ? rest.substring(0, questionIndex) : rest;

			let amount: string | undefined;
			let label: string | undefined;
			let message: string | undefined;

			if (questionIndex > 0) {
				const queryString = rest.substring(questionIndex + 1);
				const params = new URLSearchParams(queryString);
				amount = params.get("amount") || undefined;
				label = params.get("label") || undefined;
				message = params.get("message") || undefined;
			}

			return {
				success: true,
				data: {
					type: "uri",
					currency,
					address,
					amount,
					label,
					message,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Invalid payment URI format: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private parseCryptoAddress(rawData: string): ParsedContent<PaymentData> {
		if (this.BITCOIN_REGEX.test(rawData)) {
			return {
				success: true,
				data: {
					type: "crypto",
					currency: "BTC",
					address: rawData,
				},
			};
		}

		if (this.ETHEREUM_REGEX.test(rawData)) {
			return {
				success: true,
				data: {
					type: "crypto",
					currency: "ETH",
					address: rawData,
				},
			};
		}

		return {
			success: false,
			error: "Unrecognized cryptocurrency address format",
		};
	}
}
