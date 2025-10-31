import { hapticService } from "@/services/haptic-service";
import { PermissionType, permissionService } from "@/services/permission-service";
import * as Clipboard from "expo-clipboard";
import { format } from "date-fns";
import * as Calendar from "expo-calendar";
import { Alert, Platform, Share } from "react-native";
import type { ActionHandler, ActionResult, EventData } from "../types";

export class EventHandler implements ActionHandler<EventData> {
	async executePrimary(data: EventData): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			// Request calendar permissions
			const { status, canAskAgain } = await Calendar.requestCalendarPermissionsAsync();

			if (status !== "granted") {
				const explanation = permissionService.getPermissionExplanation(PermissionType.CALENDAR);
				const fallbackMessage = permissionService.getFallbackMessage(PermissionType.CALENDAR);

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
					error: "Calendar permission denied",
					fallbackAction: async () => {
						// Fallback: copy event details
						const eventText = this.formatEventText(data);
						await Clipboard.setStringAsync(eventText);
						Alert.alert("Event Details Copied", fallbackMessage, [{ text: "OK" }]);
					},
				};
			}

			// Get the default calendar
			const calendars = await Calendar.getCalendarsAsync(
				Calendar.EntityTypes.EVENT,
			);

			let defaultCalendar = calendars.find(
				(cal) => cal.allowsModifications && cal.isPrimary,
			);

			if (!defaultCalendar) {
				defaultCalendar = calendars.find((cal) => cal.allowsModifications);
			}

			if (!defaultCalendar) {
				hapticService.error();
				return {
					success: false,
					error: "No writable calendar found",
				};
			}

			// Create the event
			const eventDetails = {
				title: data.title,
				startDate: data.startDate,
				endDate: data.endDate || data.startDate,
				location: data.location ?? null,
				notes: data.description ?? "",
				allDay: data.allDay,
				...(Platform.OS === "ios" && { timeZone: "GMT" }),
			};

			const eventId = await Calendar.createEventAsync(
				defaultCalendar.id,
				eventDetails,
			);

			if (eventId) {
				Alert.alert("Success", "Event added to calendar", [{ text: "OK" }]);
				hapticService.success();
				return {
					success: true,
				};
			}

			hapticService.error();
			return {
				success: false,
				error: "Failed to create event",
			};
		} catch (error) {
			hapticService.error();
			return {
				success: false,
				error: `Failed to add event: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	}

	async executeSecondary(
		action: string,
		data: EventData,
	): Promise<ActionResult> {
		// Trigger selection haptic on button tap
		hapticService.selection();

		try {
			switch (action) {
				case "copy": {
					const eventText = this.formatEventText(data);
					await Clipboard.setStringAsync(eventText);
					hapticService.success();
					return {
						success: true,
					};
				}

				case "share": {
					const shareText = this.formatEventText(data);
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

	private formatEventText(data: EventData): string {
		let text = `Event: ${data.title}\n`;

		if (data.allDay) {
			text += `Date: ${format(data.startDate, "MMMM d, yyyy")}\n`;
		} else {
			text += `Start: ${format(data.startDate, "MMMM d, yyyy 'at' h:mm a")}\n`;
			if (data.endDate) {
				text += `End: ${format(data.endDate, "MMMM d, yyyy 'at' h:mm a")}\n`;
			}
		}

		if (data.location) {
			text += `Location: ${data.location}\n`;
		}

		if (data.description) {
			text += `\n${data.description}`;
		}

		return text;
	}
}
