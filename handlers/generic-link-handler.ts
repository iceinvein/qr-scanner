import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult } from "../types";

/**
 * Generic Link Handler
 * Reusable handler for simple link-based types
 */
export class GenericLinkHandler<T extends { url: string }> implements ActionHandler<T> {
	private typeName: string;

	constructor(typeName: string) {
		this.typeName = typeName;
	}

	async executePrimary(data: T): Promise<ActionResult> {
		hapticService.selection();

		try {
			const canOpen = await Linking.canOpenURL(data.url);
			
			if (canOpen) {
				await Linking.openURL(data.url);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: `Unable to open ${this.typeName}`,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to open ${this.typeName}: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(action: string, data: T): Promise<ActionResult> {
		hapticService.selection();

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(data.url);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const shareResult = await Share.share({
						message: data.url,
						url: data.url,
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

// Export specific handler instances
export class VideoConferenceHandler extends GenericLinkHandler<any> {
	constructor() {
		super("video conference");
	}
}

export class SocialMediaHandler extends GenericLinkHandler<any> {
	constructor() {
		super("social media profile");
	}
}

export class MusicMediaHandler extends GenericLinkHandler<any> {
	constructor() {
		super("media link");
	}
}

export class AppStoreHandler extends GenericLinkHandler<any> {
	constructor() {
		super("app store");
	}
}

export class EPCPaymentHandler extends GenericLinkHandler<any> {
	constructor() {
		super("payment");
	}
	
	async executePrimary(data: any): Promise<ActionResult> {
		hapticService.selection();
		// EPC payments typically need to be copied for use in banking apps
		try {
			const paymentInfo = `Pay to: ${data.beneficiaryName}\nIBAN: ${data.beneficiaryAccount}${data.amount ? `\nAmount: €${data.amount}` : ""}`;
			await Clipboard.setStringAsync(paymentInfo);
			hapticService.success();
			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to copy payment info: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}
}


