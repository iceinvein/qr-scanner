import {
    hapticService
} from "@/services/haptic-service";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";
import type { ActionHandler, ActionResult, PaymentData } from "../types";

export class PaymentHandler implements ActionHandler<PaymentData> {
	private readonly WALLET_SCHEMES: Record<string, string[]> = {
		BTC: ["bitcoin:", "bluewallet:", "coinbase:", "trust:"],
		ETH: ["ethereum:", "metamask:", "coinbase:", "trust:"],
	};

	async executePrimary(data: PaymentData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Construct payment URI
			const paymentUri = this.constructPaymentUri(data);

			// Try to find an installed wallet app
			const installedWallet = await this.findInstalledWallet(data.currency);

			if (installedWallet) {
				// Open the wallet with the payment URI
				await Linking.openURL(paymentUri);
				hapticService.success();
				return {
					success: true,
				};
			}

			// No wallet installed, show alert with options
			Alert.alert(
				"No Wallet App Found",
				`No ${data.currency} wallet app is installed. You can copy the address to use in your wallet.`,
				[
					{
						text: "Copy Address",
						onPress: async () => {
							await Clipboard.setStringAsync(data.address);
						},
					},
					{ text: "Cancel", style: "cancel" },
				],
			);

			hapticService.error();
			return {
				success: false,
				error: "No wallet app installed",
				fallbackAction: async () => {
					await Clipboard.setStringAsync(data.address);
				},
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open wallet: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: PaymentData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					let copyText = `${data.currency} Payment\n\nAddress: ${data.address}`;
					if (data.amount) {
						copyText += `\nAmount: ${data.amount} ${data.currency}`;
					}
					if (data.label) {
						copyText += `\nLabel: ${data.label}`;
					}
					if (data.message) {
						copyText += `\nMessage: ${data.message}`;
					}
					await Clipboard.setStringAsync(copyText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					let shareMessage = `${data.currency} Payment\n\nAddress: ${data.address}`;
					if (data.amount) {
						shareMessage += `\nAmount: ${data.amount} ${data.currency}`;
					}
					if (data.label) {
						shareMessage += `\nLabel: ${data.label}`;
					}
					if (data.message) {
						shareMessage += `\nMessage: ${data.message}`;
					}

					const shareResult = await Share.share({
						message: shareMessage,
					});

					if (shareResult.action === Share.sharedAction) {
						hapticService.success();
						return {
							success: true,
						};
					}

					hapticService.success();
					return {
						success: true,
					};
				}

				default:
					hapticService.error();
					return {
						success: false,
						error: `Unknown action: ${action}`,
					};
			}
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to execute action: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	private constructPaymentUri(data: PaymentData): string {
		if (data.type === "uri") {
			// Already a URI, reconstruct it
			const scheme = data.currency === "BTC" ? "bitcoin" : "ethereum";
			let uri = `${scheme}:${data.address}`;

			const params: string[] = [];
			if (data.amount) params.push(`amount=${data.amount}`);
			if (data.label) params.push(`label=${encodeURIComponent(data.label)}`);
			if (data.message)
				params.push(`message=${encodeURIComponent(data.message)}`);

			if (params.length > 0) {
				uri += `?${params.join("&")}`;
			}

			return uri;
		}

		// Crypto address, create basic URI
		const scheme = data.currency === "BTC" ? "bitcoin" : "ethereum";
		return `${scheme}:${data.address}`;
	}

	private async findInstalledWallet(currency: string): Promise<string | null> {
		const schemes = this.WALLET_SCHEMES[currency] || [];

		for (const scheme of schemes) {
			try {
				const testUrl = `${scheme}//`;
				const canOpen = await Linking.canOpenURL(testUrl);
				if (canOpen) {
					return scheme;
				}
			} catch {
				// Continue to next scheme
			}
		}

		return null;
	}
}
