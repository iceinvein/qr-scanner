import { hapticService } from "@/services/haptic-service";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Platform, Share } from "react-native";
import type { ActionHandler, ActionResult, WiFiData } from "../types";

export class WiFiHandler implements ActionHandler<WiFiData> {
	async executePrimary(data: WiFiData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			if (Platform.OS === "ios") {
				// iOS: Open WiFi settings
				// Note: iOS doesn't support direct WiFi connection via URL
				// We can only open the WiFi settings page
				const settingsUrl = "App-Prefs:root=WIFI";
				const canOpen = await Linking.canOpenURL(settingsUrl);

				if (canOpen) {
					await Linking.openURL(settingsUrl);

					// Show alert with credentials
					Alert.alert(
						"WiFi Credentials",
						`Network: ${data.ssid}\nPassword: ${data.password}\n\nPlease connect manually in Settings.`,
						[
							{
								text: "Copy Password",
								onPress: async () => {
									await Clipboard.setStringAsync(data.password);
								},
							},
							{ text: "OK" },
						],
					);

					hapticService.success();
					return {
						success: true,
					};
				}

				// Fallback: show credentials with copy action
				return this.showCredentialsFallback(data);
			} else if (Platform.OS === "android") {
				// Android: Try to use WiFi intent
				// Format: WIFI:T:WPA;S:NetworkName;P:password;H:false;;
				const wifiString = `WIFI:T:${data.securityType.toUpperCase()};S:${data.ssid};P:${data.password};H:${data.hidden};;`;

				try {
					// Try to open with intent (this may not work on all Android versions)
					await Linking.openURL(wifiString);
					hapticService.success();
					return {
						success: true,
					};
				} catch {
					// Fallback: show credentials
					return this.showCredentialsFallback(data);
				}
			}

			// Unsupported platform
			return this.showCredentialsFallback(data);
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to connect to WiFi: ${error instanceof Error ? error.message : "Unknown error"}`,
				fallbackAction: () => this.showCredentialsFallback(data),
			};
		}
	}

	async executeSecondary(
		action: string,
		data: WiFiData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const credentials = `Network: ${data.ssid}\nPassword: ${data.password}\nSecurity: ${data.securityType}`;
					await Clipboard.setStringAsync(credentials);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareMessage = `WiFi Network\n\nSSID: ${data.ssid}\nPassword: ${data.password}\nSecurity: ${data.securityType}`;
					const shareResult = await Share.share({
						message: shareMessage,
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

	private async showCredentialsFallback(data: WiFiData): Promise<ActionResult> {
		Alert.alert(
			"WiFi Credentials",
			`Network: ${data.ssid}\nPassword: ${data.password}\nSecurity: ${data.securityType}`,
			[
				{
					text: "Copy Password",
					onPress: async () => {
						await Clipboard.setStringAsync(data.password);
					},
				},
				{
					text: "Copy All",
					onPress: async () => {
						const credentials = `Network: ${data.ssid}\nPassword: ${data.password}\nSecurity: ${data.securityType}`;
						await Clipboard.setStringAsync(credentials);
					},
				},
				{ text: "OK" },
			],
		);

		hapticService.success();
		return {
			success: true,
		};
	}
}
