import * as Clipboard from "expo-clipboard";
import { Alert, Linking, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, SMSData } from "../types";

export class SMSHandler implements ActionHandler<SMSData> {
	async executePrimary(data: SMSData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Open SMS app with pre-filled message
			const smsUrl = this.buildSmsUrl(data);
			const canOpen = await Linking.canOpenURL(smsUrl);

			if (canOpen) {
				await Linking.openURL(smsUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Unable to open messaging app",
				fallbackAction: async () => {
					// Fallback: copy message
					const text = data.message || data.number;
					await Clipboard.setStringAsync(text);
					Alert.alert("Message Copied", "You can paste it into your messaging app", [
						{ text: "OK" },
					]);
				},
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open messaging app: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: SMSData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const smsText = this.formatSmsText(data);
					await Clipboard.setStringAsync(smsText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareText = this.formatSmsText(data);
					const shareResult = await Share.share({
						message: shareText,
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

	private buildSmsUrl(data: SMSData): string {
		let url = `sms:${data.number}`;

		if (data.message) {
			// iOS uses ? and Android uses & for the body parameter
			// Using ? works on both platforms
			url += `?body=${encodeURIComponent(data.message)}`;
		}

		return url;
	}

	private formatSmsText(data: SMSData): string {
		let text = `Phone: ${data.number}`;

		if (data.message) {
			text += `\nMessage: ${data.message}`;
		}

		return text;
	}
}
