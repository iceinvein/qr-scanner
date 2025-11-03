import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, TelegramData } from "../types";

/**
 * Telegram Handler
 * Handles Telegram link actions
 */
export class TelegramHandler implements ActionHandler<TelegramData> {
	async executePrimary(data: TelegramData): Promise<ActionResult> {
		hapticService.selection();

		try {
			// Construct Telegram URL
			let telegramUrl = "";
			
			if (data.username) {
				telegramUrl = `https://t.me/${data.username}`;
				if (data.text) {
					telegramUrl += `?text=${encodeURIComponent(data.text)}`;
				}
			} else if (data.phoneNumber) {
				telegramUrl = `https://t.me/${data.phoneNumber}`;
			} else if (data.chatId) {
				telegramUrl = `https://t.me/${data.chatId}`;
			}

			if (!telegramUrl) {
				hapticService.error();
				return {
					success: false,
					error: "Invalid Telegram data",
				};
			}

			// Try to open Telegram
			const canOpen = await Linking.canOpenURL(telegramUrl);
			
			if (canOpen) {
				await Linking.openURL(telegramUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			// Fallback: Show install prompt
			hapticService.warning();
			Alert.alert(
				"Telegram Not Found",
				"Telegram doesn't appear to be installed. Would you like to copy the link instead?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Copy Link",
						onPress: async () => {
							await Clipboard.setStringAsync(telegramUrl);
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
				error: `Failed to open Telegram: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(action: string, data: TelegramData): Promise<ActionResult> {
		hapticService.selection();

		try {
			switch (action) {
				case "copy_username":
					if (!data.username) {
						hapticService.error();
						return {
							success: false,
							error: "No username available",
						};
					}
					await Clipboard.setStringAsync(`@${data.username}`);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_link": {
					let link = "";
					if (data.username) {
						link = `https://t.me/${data.username}`;
					} else if (data.phoneNumber) {
						link = `https://t.me/${data.phoneNumber}`;
					} else if (data.chatId) {
						link = `https://t.me/${data.chatId}`;
					}
					
					if (!link) {
						hapticService.error();
						return {
							success: false,
							error: "No link available",
						};
					}
					
					await Clipboard.setStringAsync(link);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					let link = "";
					if (data.username) {
						link = `https://t.me/${data.username}`;
					} else if (data.phoneNumber) {
						link = `https://t.me/${data.phoneNumber}`;
					} else if (data.chatId) {
						link = `https://t.me/${data.chatId}`;
					}
					
					const shareResult = await Share.share({
						message: link,
						title: "Telegram Link",
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


