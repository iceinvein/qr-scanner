import * as Clipboard from "expo-clipboard";
import { Alert, Linking, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, EmailData } from "../types";

export class EmailHandler implements ActionHandler<EmailData> {
	async executePrimary(data: EmailData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Compose email
			const emailUrl = this.buildEmailUrl(data);
			const canOpen = await Linking.canOpenURL(emailUrl);

			if (canOpen) {
				await Linking.openURL(emailUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Unable to open email app",
				fallbackAction: async () => {
					// Fallback: copy email address
					await Clipboard.setStringAsync(data.address);
					Alert.alert("Email Address Copied", "You can paste it into your email app", [
						{ text: "OK" },
					]);
				},
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to compose email: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: EmailData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const emailText = this.formatEmailText(data);
					await Clipboard.setStringAsync(emailText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareText = this.formatEmailText(data);
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

	private buildEmailUrl(data: EmailData): string {
		let url = `mailto:${data.address}`;
		const params: string[] = [];

		if (data.subject) {
			params.push(`subject=${encodeURIComponent(data.subject)}`);
		}

		if (data.body) {
			params.push(`body=${encodeURIComponent(data.body)}`);
		}

		if (data.cc && data.cc.length > 0) {
			params.push(`cc=${data.cc.join(",")}`);
		}

		if (data.bcc && data.bcc.length > 0) {
			params.push(`bcc=${data.bcc.join(",")}`);
		}

		if (params.length > 0) {
			url += `?${params.join("&")}`;
		}

		return url;
	}

	private formatEmailText(data: EmailData): string {
		let text = `Email: ${data.address}`;

		if (data.subject) {
			text += `\nSubject: ${data.subject}`;
		}

		if (data.body) {
			text += `\nBody: ${data.body}`;
		}

		if (data.cc && data.cc.length > 0) {
			text += `\nCC: ${data.cc.join(", ")}`;
		}

		if (data.bcc && data.bcc.length > 0) {
			text += `\nBCC: ${data.bcc.join(", ")}`;
		}

		return text;
	}
}
