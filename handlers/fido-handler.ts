import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import type { ActionHandler, ActionResult, FIDOData } from "../types";

/**
 * FIDO Handler
 * Handles FIDO (Fast Identity Online) authentication actions
 * Primary action: Copy credential data or open FIDO app
 * Secondary actions: Share, view details, copy specific fields
 */
export class FIDOHandler implements ActionHandler<FIDOData> {
	async executePrimary(data: FIDOData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Handle FIDO2 hybrid/caBLE passkey QR - open original URI for native handling
			if (data.protocol === "fido2-hybrid" && data.rawData) {
				try {
					const canOpen = await Linking.canOpenURL(data.rawData);
					
					if (canOpen) {
						await Linking.openURL(data.rawData);
						hapticService.success();
						return {
							success: true,
						};
					}
					
					// iOS may not report it can open FIDO: URLs, try anyway
					await Linking.openURL(data.rawData);
					hapticService.success();
					return {
						success: true,
					};
				} catch (error) {
					// If opening fails, show helpful message
					hapticService.error();
					Alert.alert(
						"Passkey Not Available",
						"Your device couldn't open the passkey authentication. Make sure you have passkeys enabled in your device settings.",
						[{ text: "OK" }]
					);
					return {
						success: false,
						error: "Failed to open passkey authentication",
					};
				}
			}

			// Try to open FIDO URI if it's a valid URI scheme
			if (data.protocol === "fido" || data.protocol === "webauthn") {
				const uri = this.constructFidoUri(data);
				
				try {
					const canOpen = await Linking.canOpenURL(uri);
					
					if (canOpen) {
						await Linking.openURL(uri);
						hapticService.success();
						return {
							success: true,
						};
					}
				} catch {
					// Fall through to copy action
				}
			}

			// Fallback: Copy credential to clipboard
			await Clipboard.setStringAsync(data.rawData);
			hapticService.success();
			
			// Show alert to inform user
			Alert.alert(
				"FIDO Credential Copied",
				"The FIDO authentication data has been copied to your clipboard. You can now paste it in your authentication app.",
				[{ text: "OK" }]
			);

			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to handle FIDO credential: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(action: string, data: FIDOData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy":
					await Clipboard.setStringAsync(data.rawData);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_credential_id":
					if (!data.credentialId) {
						hapticService.error();
						return {
							success: false,
							error: "No credential ID available",
						};
					}
					await Clipboard.setStringAsync(data.credentialId);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_rp_id":
					if (!data.rpId) {
						hapticService.error();
						return {
							success: false,
							error: "No relying party ID available",
						};
					}
					await Clipboard.setStringAsync(data.rpId);
					hapticService.success();
					return {
						success: true,
					};

				case "copy_challenge":
					if (!data.challenge) {
						hapticService.error();
						return {
							success: false,
							error: "No challenge available",
						};
					}
					await Clipboard.setStringAsync(data.challenge);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const message = this.formatShareMessage(data);
					const shareResult = await Share.share({
						message,
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

				case "view_details":
					// Show detailed information
					this.showDetailsAlert(data);
					hapticService.success();
					return {
						success: true,
					};

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

	/**
	 * Construct FIDO URI from parsed data
	 */
	private constructFidoUri(data: FIDOData): string {
		const protocol = data.protocol === "webauthn" ? "webauthn" : "fido";
		let uri = `${protocol}://`;

		if (data.rpId) {
			uri += data.rpId;
		}

		const params = new URLSearchParams();
		if (data.credentialId) params.append("credentialId", data.credentialId);
		if (data.challenge) params.append("challenge", data.challenge);
		if (data.userId) params.append("userId", data.userId);
		if (data.attestation) params.append("attestation", data.attestation);

		const queryString = params.toString();
		if (queryString) {
			uri += `?${queryString}`;
		}

		return uri;
	}

	/**
	 * Format message for sharing
	 */
	private formatShareMessage(data: FIDOData): string {
		let message = `FIDO Authentication Data\n\n`;
		message += `Protocol: ${data.protocol}\n`;
		
		if (data.rpId) {
			message += `Relying Party: ${data.rpId}\n`;
		}
		
		if (data.credentialId) {
			message += `Credential ID: ${this.truncateString(data.credentialId, 40)}\n`;
		}
		
		if (data.challenge) {
			message += `Challenge: ${this.truncateString(data.challenge, 40)}\n`;
		}
		
		if (data.userId) {
			message += `User ID: ${data.userId}\n`;
		}

		message += `\nRaw Data:\n${this.truncateString(data.rawData, 200)}`;

		return message;
	}

	/**
	 * Show detailed alert
	 */
	private showDetailsAlert(data: FIDOData): void {
		let details = `Protocol: ${data.protocol}\n\n`;
		
		if (data.rpId) {
			details += `Relying Party ID:\n${data.rpId}\n\n`;
		}
		
		if (data.credentialId) {
			details += `Credential ID:\n${this.truncateString(data.credentialId, 80)}\n\n`;
		}
		
		if (data.challenge) {
			details += `Challenge:\n${this.truncateString(data.challenge, 80)}\n\n`;
		}
		
		if (data.userId) {
			details += `User ID:\n${data.userId}\n\n`;
		}

		if (data.attestation) {
			details += `Attestation:\n${data.attestation}\n\n`;
		}

		Alert.alert("FIDO Details", details, [{ text: "OK" }]);
	}

	/**
	 * Truncate string with ellipsis
	 */
	private truncateString(str: string, maxLength: number): string {
		if (str.length <= maxLength) return str;
		return str.substring(0, maxLength - 3) + "...";
	}
}

