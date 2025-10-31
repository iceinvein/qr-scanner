import * as Clipboard from "expo-clipboard";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, TextData } from "../types";

export class TextHandler implements ActionHandler<TextData> {
	async executePrimary(data: TextData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Copy text to clipboard
			await Clipboard.setStringAsync(data.content);
			Alert.alert("Text Copied", "The content has been copied to your clipboard", [
				{ text: "OK" },
			]);
			hapticService.success();
			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to copy text: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: TextData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(data.content);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const shareResult = await Share.share({
						message: data.content,
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
