/**
 * Permission Service
 * Handles permission requests, denials, and provides fallback actions
 */

import * as Linking from "expo-linking";
import { Platform } from "react-native";

export enum PermissionType {
	CAMERA = "camera",
	CALENDAR = "calendar",
	CONTACTS = "contacts",
}

export interface PermissionResult {
	granted: boolean;
	canAskAgain: boolean;
	message: string;
}

export interface PermissionExplanation {
	title: string;
	message: string;
	settingsPrompt: string;
}

export class PermissionService {
	/**
	 * Get user-friendly explanation for permission request
	 */
	getPermissionExplanation(type: PermissionType): PermissionExplanation {
		switch (type) {
			case PermissionType.CAMERA:
				return {
					title: "Camera Access Required",
					message:
						"This app needs camera access to scan QR codes and barcodes. Your privacy is important - we only use the camera for scanning.",
					settingsPrompt:
						"Camera access was denied. To enable scanning, please grant camera permission in Settings.",
				};

			case PermissionType.CALENDAR:
				return {
					title: "Calendar Access Required",
					message:
						"This app needs calendar access to add events from scanned QR codes. We'll only add events when you explicitly tap 'Add to Calendar'.",
					settingsPrompt:
						"Calendar access was denied. To add events, please grant calendar permission in Settings.",
				};

			case PermissionType.CONTACTS:
				return {
					title: "Contacts Access Required",
					message:
						"This app needs contacts access to save contact information from scanned QR codes. We'll only add contacts when you explicitly tap 'Add Contact'.",
					settingsPrompt:
						"Contacts access was denied. To save contacts, please grant contacts permission in Settings.",
				};

			default:
				return {
					title: "Permission Required",
					message: "This app needs permission to complete this action.",
					settingsPrompt:
						"Permission was denied. Please grant the required permission in Settings.",
				};
		}
	}

	/**
	 * Open system settings for the app
	 * Provides deep link to system settings when permissions are denied
	 * Requirements: 4.2, 4.4
	 */
	async openSettings(): Promise<boolean> {
		try {
			if (Platform.OS === "ios") {
				// iOS: Open app-specific settings
				await Linking.openSettings();
				return true;
			} else if (Platform.OS === "android") {
				// Android: Open app-specific settings
				await Linking.openSettings();
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to open settings:", error);
			return false;
		}
	}

	/**
	 * Get fallback action message when permission is unavailable
	 */
	getFallbackMessage(type: PermissionType): string {
		switch (type) {
			case PermissionType.CAMERA:
				return "You can manually enter QR code data or grant camera permission in Settings.";

			case PermissionType.CALENDAR:
				return "You can copy the event details and add them manually to your calendar.";

			case PermissionType.CONTACTS:
				return "You can copy the contact details and add them manually to your contacts.";

			default:
				return "You can copy the content and use it manually.";
		}
	}

	/**
	 * Check if we should show permission rationale
	 * On iOS, we can't distinguish between "never ask again" and first denial
	 * On Android, we can check if we can ask again
	 */
	shouldShowRationale(canAskAgain: boolean): boolean {
		if (Platform.OS === "android") {
			return !canAskAgain;
		}
		// On iOS, always show rationale on denial
		return true;
	}

	/**
	 * Create a permission result with appropriate messaging
	 */
	createPermissionResult(
		granted: boolean,
		canAskAgain: boolean,
		type: PermissionType
	): PermissionResult {
		if (granted) {
			return {
				granted: true,
				canAskAgain: true,
				message: "Permission granted",
			};
		}

		const explanation = this.getPermissionExplanation(type);

		if (this.shouldShowRationale(canAskAgain)) {
			return {
				granted: false,
				canAskAgain,
				message: explanation.settingsPrompt,
			};
		}

		return {
			granted: false,
			canAskAgain,
			message: explanation.message,
		};
	}
}

// Export singleton instance
export const permissionService = new PermissionService();
