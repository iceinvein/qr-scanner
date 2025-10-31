import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, AppLinkData } from "../types";

export class AppLinkHandler implements ActionHandler<AppLinkData> {
	async executePrimary(data: AppLinkData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Construct the full deep link URL
			const deepLink = this.constructDeepLink(data);

			// Check if the app is installed
			const canOpen = await Linking.canOpenURL(deepLink);

			if (canOpen) {
				// App is installed, open it
				await Linking.openURL(deepLink);
				hapticService.success();
				return {
					success: true,
				};
			}

			// App is not installed, try fallback URL
			if (data.fallbackUrl) {
				Alert.alert(
					"App Not Installed",
					"The app is not installed. Opening fallback URL instead.",
					[
						{
							text: "Open",
							onPress: async () => {
								if (data.fallbackUrl) {
									try {
										await WebBrowser.openBrowserAsync(data.fallbackUrl, {
											dismissButtonStyle: "close",
										});
									} catch {
										await Linking.openURL(data.fallbackUrl);
									}
								}
							},
						},
						{ text: "Cancel", style: "cancel" },
					],
				);

				hapticService.error();
				return {
					success: false,
					error: "App not installed",
					fallbackAction: async () => {
						if (data.fallbackUrl) {
							try {
								await WebBrowser.openBrowserAsync(data.fallbackUrl, {
									dismissButtonStyle: "close",
								});
							} catch {
								await Linking.openURL(data.fallbackUrl);
							}
						}
					},
				};
			}

			// No fallback URL available
			Alert.alert(
				"App Not Installed",
				"The required app is not installed on your device.",
				[{ text: "OK" }],
			);

			hapticService.error();
			return {
				success: false,
				error: "App not installed and no fallback URL available",
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open app link: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: AppLinkData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		const deepLink = this.constructDeepLink(data);

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(deepLink);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const shareResult = await Share.share({
						message: deepLink,
						url: deepLink,
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

	private constructDeepLink(data: AppLinkData): string {
		let link = `${data.scheme}:`;

		if (data.host) {
			link += `//${data.host}`;
		}

		if (data.path) {
			// Ensure path starts with /
			const cleanPath = data.path.startsWith("/") ? data.path : `/${data.path}`;
			link += cleanPath;
		}

		// Add query parameters
		const params = Object.entries(data.params)
			.filter(([key]) => key !== "fallback_url" && key !== "fallbackUrl")
			.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
			.join("&");

		if (params) {
			link += `?${params}`;
		}

		return link;
	}
}
