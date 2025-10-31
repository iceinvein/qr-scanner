import * as Clipboard from "expo-clipboard";
import { Alert, Linking, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, PhoneData } from "../types";

export class PhoneHandler implements ActionHandler<PhoneData> {
	async executePrimary(data: PhoneData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Make phone call
			const phoneUrl = `tel:${data.number}`;
			const canOpen = await Linking.canOpenURL(phoneUrl);

			if (canOpen) {
				await Linking.openURL(phoneUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Unable to make phone call",
				fallbackAction: async () => {
					// Fallback: copy phone number
					await Clipboard.setStringAsync(data.formatted);
					Alert.alert("Phone Number Copied", "You can paste it into your phone app", [
						{ text: "OK" },
					]);
				},
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to make call: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: PhoneData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(data.formatted);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const shareText = `Phone: ${data.formatted}`;
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
}
