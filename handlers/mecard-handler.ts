import * as Clipboard from "expo-clipboard";
import * as Contacts from "expo-contacts";
import { Alert, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import { permissionService } from "../services/permission-service";
import type { ActionHandler, ActionResult, MeCardData } from "../types";

/**
 * MeCard Handler
 * Handles MeCard contact actions
 */
export class MeCardHandler implements ActionHandler<MeCardData> {
	async executePrimary(data: MeCardData): Promise<ActionResult> {
		hapticService.selection();

		try {
			// Request contacts permission
			const hasPermission = await permissionService.requestContacts();

			if (!hasPermission) {
				hapticService.warning();
				Alert.alert(
					"Permission Required",
					"Contacts permission is required to save this contact. You can copy the details instead.",
					[
						{ text: "Cancel", style: "cancel" },
						{
							text: "Copy Details",
							onPress: async () => {
								await this.copyContactDetails(data);
								hapticService.success();
							},
						},
					]
				);
				return {
					success: false,
					error: "Contacts permission denied",
					fallbackAction: () => this.copyContactDetails(data),
				};
			}

			// Create contact
			const contact: Partial<Contacts.Contact> = {};

			if (data.name.firstName || data.name.lastName) {
				contact.firstName = data.name.firstName || "";
				contact.lastName = data.name.lastName || "";
			} else if (data.name.fullName) {
				// Try to split full name
				const nameParts = data.name.fullName.split(" ");
				contact.firstName = nameParts[0] || "";
				contact.lastName = nameParts.slice(1).join(" ") || "";
			}

			if (data.phone) {
				contact.phoneNumbers = [
					{
						label: "mobile",
						number: data.phone,
					},
				];
			}

			if (data.email) {
				contact.emails = [
					{
						label: "home",
						email: data.email,
					},
				];
			}

			if (data.url) {
				contact.urlAddresses = [
					{
						label: "homepage",
						url: data.url,
					},
				];
			}

			if (data.address) {
				contact.addresses = [
					{
						label: "home",
						street: data.address,
					},
				];
			}

			if (data.memo) {
				contact.note = data.memo;
			}

			// Add contact
			await Contacts.addContactAsync(contact);
			hapticService.success();

			Alert.alert(
				"Contact Saved",
				`${data.name.fullName || "Contact"} has been added to your contacts.`,
				[{ text: "OK" }]
			);

			return {
				success: true,
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to save contact: ${error instanceof Error ? error.message : "Unknown error"}`,
				fallbackAction: () => this.copyContactDetails(data),
			};
		}
	}

	async executeSecondary(action: string, data: MeCardData): Promise<ActionResult> {
		hapticService.selection();

		try {
			switch (action) {
				case "copy":
					await this.copyContactDetails(data);
					hapticService.success();
					return {
						success: true,
					};

				case "share": {
					const message = this.formatContactMessage(data);
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

	private async copyContactDetails(data: MeCardData): Promise<void> {
		const details = this.formatContactMessage(data);
		await Clipboard.setStringAsync(details);
	}

	private formatContactMessage(data: MeCardData): string {
		let message = "";

		if (data.name.fullName) {
			message += `${data.name.fullName}\n`;
		}

		if (data.phone) {
			message += `Phone: ${data.phone}\n`;
		}

		if (data.email) {
			message += `Email: ${data.email}\n`;
		}

		if (data.address) {
			message += `Address: ${data.address}\n`;
		}

		if (data.url) {
			message += `Website: ${data.url}\n`;
		}

		if (data.memo) {
			message += `\n${data.memo}`;
		}

		return message.trim();
	}
}


