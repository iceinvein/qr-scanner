import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, URLData } from "../types";

export class URLHandler implements ActionHandler<URLData> {
	async executePrimary(data: URLData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			const fullUrl = this.constructFullUrl(data);

			// Try to open in expo-web-browser (in-app browser)
			const result = await WebBrowser.openBrowserAsync(fullUrl, {
				dismissButtonStyle: "close",
				readerMode: false,
				enableBarCollapsing: true,
			});

			if (result.type === "cancel" || result.type === "dismiss") {
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.success();
			return {
				success: true,
			};
		} catch (_error) {
			// Fallback to system browser
			try {
				const fullUrl = this.constructFullUrl(data);
				const canOpen = await Linking.canOpenURL(fullUrl);

				if (canOpen) {
					await Linking.openURL(fullUrl);
					hapticService.success();
					return {
						success: true,
					};
				}

				hapticService.error();
				return {
					success: false,
					error: "Unable to open URL",
				};
			} catch (fallbackError) {
				hapticService.error();
				return {
					success: false,
					error: `Failed to open URL: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
				};
			}
		}
	}

	async executeSecondary(action: string, data: URLData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		const fullUrl = this.constructFullUrl(data);

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(fullUrl);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const shareResult = await Share.share({
						message: fullUrl,
						url: fullUrl,
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

				case "open_external": {
					const canOpen = await Linking.canOpenURL(fullUrl);
					if (canOpen) {
						await Linking.openURL(fullUrl);
						hapticService.success();
						return {
							success: true,
						};
					}

					hapticService.error();
					return {
						success: false,
						error: "Unable to open URL in external browser",
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

	private constructFullUrl(data: URLData): string {
		let url = `${data.protocol}://${data.domain}${data.path}`;

		const queryString = Object.entries(data.queryParams)
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join("&");

		if (queryString) {
			url += `?${queryString}`;
		}

		if (data.fragment) {
			url += `#${data.fragment}`;
		}

		return url;
	}
}
