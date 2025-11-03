import type { ContentParser, EPCPaymentData, ParsedContent } from "../types";

export class EPCPaymentParser implements ContentParser<EPCPaymentData> {
	parse(rawData: string): ParsedContent<EPCPaymentData> {
		try {
			const lines = rawData.trim().split("\n");

			if (lines.length < 12) {
				return {
					success: false,
					error: "Invalid EPC payment format: insufficient data lines",
				};
			}

			// EPC QR Code format:
			// Line 1: Service Tag (BCD)
			// Line 2: Version (002)
			// Line 3: Character Set (1 = UTF-8)
			// Line 4: Identification (SCT)
			// Line 5: BIC
			// Line 6: Beneficiary Name
			// Line 7: Beneficiary Account (IBAN)
			// Line 8: Amount (EUR)
			// Line 9: Purpose
			// Line 10: Structured Reference
			// Line 11: Unstructured Remittance
			// Line 12: Information

			const serviceTag = lines[0];
			if (serviceTag !== "BCD" && serviceTag !== "EPC") {
				return {
					success: false,
					error: "Invalid EPC service tag",
				};
			}

			return {
				success: true,
				data: {
					version: lines[1] || "",
					encoding: lines[2] === "1" ? "UTF-8" : "ISO-8859-1",
					bic: lines[4] || undefined,
					beneficiaryName: lines[5] || "",
					beneficiaryAccount: lines[6] || "",
					amount: lines[7] || undefined,
					currency: "EUR", // EPC is always EUR
					purpose: lines[8] || undefined,
					reference: lines[9] || undefined,
					remittanceInfo: lines[10] || undefined,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to parse EPC payment: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


