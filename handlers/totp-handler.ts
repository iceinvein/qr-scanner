import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, TOTPData } from "../types";

/**
 * TOTP/OTP Handler
 * Handles Time-based One-Time Password actions
 * Primary: Open in authenticator app or copy secret
 * Secondary: Copy secret, share, show QR info
 */
export class TOTPHandler implements ActionHandler<TOTPData> {
	async executePrimary(data: TOTPData): Promise<ActionResult> {
		hapticService.selection();

		try {
			// Try to open in authenticator apps
			const appSchemes = [
				data.rawUri, // Try the original URI first
				`google-authenticator://${data.rawUri}`, // Google Authenticator
				`authy://${data.rawUri}`, // Authy
			];

			for (const scheme of appSchemes) {
				try {
					const canOpen = await Linking.canOpenURL(scheme);
					if (canOpen) {
						await Linking.openURL(scheme);
						hapticService.success();
						return {
							success: true,
						};
					}
				} catch {
					// Continue to next app
					continue;
				}
			}

			// Fallback: Copy secret and show instructions
			await Clipboard.setStringAsync(data.secret);
			hapticService.success();

			Alert.alert(
				"Secret Copied",
				`No authenticator app detected. The secret key has been copied to your clipboard.\n\nSecret: ${data.secret}\n\nYou can manually add this to your authenticator app.`,
				[{ text: "OK" }]
			);

			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to setup authenticator: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(action: string, data: TOTPData): Promise<ActionResult> {
		hapticService.selection();

		try {
			switch (action) {
				case "copy_secret":
					await Clipboard.setStringAsync(data.secret);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_uri":
					await Clipboard.setStringAsync(data.rawUri);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const message = this.formatShareMessage(data);
					const shareResult = await Share.share({
						message,
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

				case "view_details":
					this.showDetailsAlert(data);
					hapticService.success();
					return {
						success: true,
					};

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

	private formatShareMessage(data: TOTPData): string {
		let message = `${data.type.toUpperCase()} Authentication Setup\n\n`;
		
		if (data.issuer) {
			message += `Issuer: ${data.issuer}\n`;
		}
		
		if (data.accountName) {
			message += `Account: ${data.accountName}\n`;
		}
		
		message += `Secret: ${data.secret}\n`;
		message += `Algorithm: ${data.algorithm}\n`;
		message += `Digits: ${data.digits}\n`;
		
		if (data.period) {
			message += `Period: ${data.period} seconds\n`;
		}
		
		if (data.counter !== undefined) {
			message += `Counter: ${data.counter}\n`;
		}

		return message;
	}

	private showDetailsAlert(data: TOTPData): void {
		let details = `Type: ${data.type.toUpperCase()}\n\n`;
		
		if (data.issuer) {
			details += `Issuer: ${data.issuer}\n`;
		}
		
		if (data.accountName) {
			details += `Account: ${data.accountName}\n\n`;
		}
		
		details += `Secret: ${data.secret}\n\n`;
		details += `Algorithm: ${data.algorithm}\n`;
		details += `Digits: ${data.digits}\n`;
		
		if (data.period) {
			details += `Period: ${data.period}s\n`;
		}
		
		if (data.counter !== undefined) {
			details += `Counter: ${data.counter}\n`;
		}

		Alert.alert("Authenticator Details", details, [{ text: "OK" }]);
	}
}


