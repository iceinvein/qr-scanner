import * as Clipboard from "expo-clipboard";
import * as Contacts from "expo-contacts";
import { Alert, Linking, Share } from "react-native";
import { hapticService } from "../services/haptic-service";
import { PermissionType, permissionService } from "../services/permission-service";
import type { ActionHandler, ActionResult, ContactData } from "../types";

export class ContactHandler implements ActionHandler<ContactData> {
	async executePrimary(data: ContactData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Request contacts permissions
			const { status, canAskAgain } = await Contacts.requestPermissionsAsync();

			if (status !== "granted") {
				const explanation = permissionService.getPermissionExplanation(PermissionType.CONTACTS);
				const fallbackMessage = permissionService.getFallbackMessage(PermissionType.CONTACTS);

				// Show permission explanation with option to open settings
				Alert.alert(
					explanation.title,
					canAskAgain ? explanation.message : explanation.settingsPrompt,
					[
						{
							text: "Cancel",
							style: "cancel",
							onPress: () => {
								hapticService.error();
							},
						},
						...(canAskAgain
							? []
							: [
									{
										text: "Open Settings",
										onPress: async () => {
											await permissionService.openSettings();
										},
									},
							  ]),
					],
				);

				hapticService.error();
				return {
					success: false,
					error: "Contacts permission denied",
					fallbackAction: async () => {
						// Fallback: copy contact details
						const contactText = this.formatContactText(data);
						await Clipboard.setStringAsync(contactText);
						Alert.alert("Contact Details Copied", fallbackMessage, [{ text: "OK" }]);
					},
				};
			}

			// Create the contact
			const contact: Contacts.Contact = {
				contactType: Contacts.ContactTypes.Person,
				name: data.name.formatted || "",
				firstName: data.name.given,
				lastName: data.name.family,
				phoneNumbers: data.phones.map((phone) => ({
					label: phone.type,
					number: phone.number,
				})),
				emails: data.emails.map((email) => ({
					label: email.type,
					email: email.address,
				})),
				company: data.organization,
				urlAddresses: data.url
					? [{ label: "website", url: data.url }]
					: undefined,
			};

			// Add address if available
			if (data.address) {
				contact.addresses = [
					{
						label: "home",
						street: data.address,
					},
				];
			}

			const contactId = await Contacts.addContactAsync(contact);

			if (contactId) {
				Alert.alert("Success", "Contact added successfully", [{ text: "OK" }]);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Failed to add contact",
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to add contact: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: ContactData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const contactText = this.formatContactText(data);
					await Clipboard.setStringAsync(contactText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareText = this.formatContactText(data);
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

	private formatContactText(data: ContactData): string {
		let text = "";

		const name =
			data.name.formatted ||
			`${data.name.given || ""} ${data.name.family || ""}`.trim();
		if (name) {
			text += `Name: ${name}\n`;
		}

		if (data.organization) {
			text += `Organization: ${data.organization}\n`;
		}

		if (data.phones.length > 0) {
			text += "\nPhone Numbers:\n";
			data.phones.forEach((phone) => {
				text += `  ${phone.type}: ${phone.number}\n`;
			});
		}

		if (data.emails.length > 0) {
			text += "\nEmails:\n";
			data.emails.forEach((email) => {
				text += `  ${email.type}: ${email.address}\n`;
			});
		}

		if (data.url) {
			text += `\nWebsite: ${data.url}\n`;
		}

		if (data.address) {
			text += `\nAddress: ${data.address}\n`;
		}

		return text;
	}
}
