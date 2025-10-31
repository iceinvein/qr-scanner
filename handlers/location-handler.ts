import * as Clipboard from "expo-clipboard";
import { Alert, Linking, Platform, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, LocationData } from "../types";

export class LocationHandler implements ActionHandler<LocationData> {
	async executePrimary(data: LocationData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Open in default maps app
			const mapsUrl = this.getMapsUrl(data);
			const canOpen = await Linking.canOpenURL(mapsUrl);

			if (canOpen) {
				await Linking.openURL(mapsUrl);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Unable to open maps app",
				fallbackAction: async () => {
					// Fallback: copy coordinates
					const coords = `${data.latitude}, ${data.longitude}`;
					await Clipboard.setStringAsync(coords);
					Alert.alert("Coordinates Copied", "You can paste them into your maps app", [
						{ text: "OK" },
					]);
				},
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open location: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: LocationData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const locationText = this.formatLocationText(data);
					await Clipboard.setStringAsync(locationText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareText = this.formatLocationText(data);
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

	private getMapsUrl(data: LocationData): string {
		// Use platform-specific maps URL
		if (Platform.OS === "ios") {
			// Apple Maps
			const label = data.label ? `&q=${encodeURIComponent(data.label)}` : "";
			return `maps:0,0?q=${data.latitude},${data.longitude}${label}`;
		}

		// Android/Google Maps
		const label = data.label ? encodeURIComponent(data.label) : `${data.latitude},${data.longitude}`;
		return `geo:${data.latitude},${data.longitude}?q=${label}`;
	}

	private formatLocationText(data: LocationData): string {
		let text = `Location: ${data.latitude}, ${data.longitude}`;

		if (data.label) {
			text += `\nLabel: ${data.label}`;
		}

		text += `\n\nView on maps: ${this.getMapsUrl(data)}`;

		return text;
	}
}
