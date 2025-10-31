import { useTheme } from "@/contexts/ThemeContext";
import { format, isSameDay } from "date-fns";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { EventData } from "../../types/parsers";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const EventPreview: React.FC<PreviewProps<EventData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
}) => {
	const { theme } = useTheme();
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy" },
		{ id: "share", label: "Share" },
	];

	const formatDateTime = () => {
		if (data.allDay) {
			if (data.endDate && !isSameDay(data.startDate, data.endDate)) {
				return `${format(data.startDate, "MMM d, yyyy")} - ${format(
					data.endDate,
					"MMM d, yyyy",
				)}`;
			}
			return format(data.startDate, "EEEE, MMMM d, yyyy");
		}

		const startStr = format(data.startDate, "EEEE, MMMM d, yyyy • h:mm a");
		if (data.endDate) {
			if (isSameDay(data.startDate, data.endDate)) {
				return `${startStr} - ${format(data.endDate, "h:mm a")}`;
			}
			return `${startStr}\n${format(data.endDate, "EEEE, MMMM d, yyyy • h:mm a")}`;
		}
		return startStr;
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Calendar Event"
			primaryActionLabel="Add to Calendar"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={styles.headerSection}
					accessible={true}
					accessibilityLabel={`Event: ${data.title}`}
					accessibilityRole="header"
				>
					<View style={styles.calendarIcon}>
						<Text style={styles.calendarIconText}>📅</Text>
					</View>
					<Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
				</View>

				<View 
					style={styles.dateSection}
					accessible={true}
					accessibilityLabel={`Date and time: ${formatDateTime()}${data.allDay ? ', All day event' : ''}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Date & Time</Text>
					<Text style={[styles.dateTime, { color: theme.text }]}>{formatDateTime()}</Text>
					{data.allDay && (
						<View style={[styles.allDayBadge, { backgroundColor: theme.primary }]}>
							<Text style={[styles.allDayText, { color: theme.primaryText }]}>All Day</Text>
						</View>
					)}
				</View>

				{data.location && (
					<View 
						style={styles.locationSection}
						accessible={true}
						accessibilityLabel={`Location: ${data.location}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Location</Text>
						<View style={styles.locationRow}>
							<Text style={styles.locationIcon}>📍</Text>
							<Text style={[styles.location, { color: theme.text }]}>{data.location}</Text>
						</View>
					</View>
				)}

				{data.description && (
					<View 
						style={styles.descriptionSection}
						accessible={true}
						accessibilityLabel={`Description: ${data.description}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
						<Text style={[styles.description, { color: theme.text }]} numberOfLines={4}>
							{data.description}
						</Text>
					</View>
				)}
			</View>
		</PreviewModal>
	);
});

EventPreview.displayName = 'EventPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	calendarIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: "#FF3B30",
		alignItems: "center",
		justifyContent: "center",
	},
	calendarIconText: {
		fontSize: 28,
	},
	title: {
		flex: 1,
		fontSize: 20,
		fontWeight: "600",
	},
	dateSection: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	dateTime: {
		fontSize: 16,
		lineHeight: 22,
	},
	allDayBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	allDayText: {
		fontSize: 12,
		fontWeight: "600",
	},
	locationSection: {
		gap: 8,
	},
	locationRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 8,
	},
	locationIcon: {
		fontSize: 16,
	},
	location: {
		flex: 1,
		fontSize: 15,
	},
	descriptionSection: {
		gap: 8,
	},
	description: {
		fontSize: 15,
		lineHeight: 20,
	},
});
