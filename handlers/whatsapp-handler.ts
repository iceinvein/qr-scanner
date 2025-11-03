import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, WhatsAppData } from "../types";

/**
 * WhatsApp Handler
 * Handles WhatsApp link actions
 */
export class WhatsAppHandler implements ActionHandler<WhatsAppData> {
	async executePrimary(data: WhatsAppData): Promise<ActionResult> {
		hapticService.selection();

		try {
			// Construct WhatsApp URL
			let whatsappUrl = `https://wa.me/${data.phoneNumber}`;
			if (data.text) {
				whatsappUrl += `?text=${encodeURIComponent(data.text)}`;
			}

			// Try to open WhatsApp
			const canOpen = await Linking.canOpenURL(whatsappUrl);
			
			if (canOpen) {
				await Linking.openURL(whatsappUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			// Fallback: Show install prompt
			hapticService.warning();
			Alert.alert(
				"WhatsApp Not Found",
				"WhatsApp doesn't appear to be installed. Would you like to copy the phone number instead?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Copy Number",
						onPress: async () => {
							await Clipboard.setStringAsync(data.formattedNumber);
							hapticService.success();
						},
					},
				]
			);

			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open WhatsApp: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(action: string, data: WhatsAppData): Promise<ActionResult> {
		hapticService.selection();

		try {
			switch (action) {
				case "copy_number":
					await Clipboard.setStringAsync(data.formattedNumber);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_message":
					if (!data.text) {
						hapticService.error();
						return {
							success: false,
							error: "No message text available",
						};
					}
					await Clipboard.setStringAsync(data.text);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					let message = `WhatsApp: ${data.formattedNumber}`;
					if (data.text) {
						message += `\nMessage: ${data.text}`;
					}
					
					const shareResult = await Share.share({ message });

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

				case "open_web": {
					let webUrl = `https://web.whatsapp.com/send?phone=${data.phoneNumber}`;
					if (data.text) {
						webUrl += `&text=${encodeURIComponent(data.text)}`;
					}
					
					const canOpen = await Linking.canOpenURL(webUrl);
					if (canOpen) {
						await Linking.openURL(webUrl);
						hapticService.success();
						return {
							success: true,
						};
					}

					hapticService.error();
					return {
						success: false,
						error: "Unable to open WhatsApp Web",
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


