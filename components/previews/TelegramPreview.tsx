import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { TelegramData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const TelegramPreview: React.FC<PreviewProps<TelegramData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	
	const secondaryActions: SecondaryAction[] = [];

	if (data.username) {
		secondaryActions.push({ id: "copy_username", label: "Copy Username" });
	}

	secondaryActions.push(
		{ id: "copy_link", label: "Copy Link" },
		{ id: "share", label: "Share" }
	);

	// Build detail items
	const detailItems: DetailItem[] = [];

	detailItems.push({ 
		label: "Type", 
		value: data.type.charAt(0).toUpperCase() + data.type.slice(1), 
		icon: "📋" 
	});

	if (data.username) {
		detailItems.push({ 
			label: "Username", 
			value: `@${data.username}`, 
			icon: "👤" 
		});
	}

	if (data.phoneNumber) {
		detailItems.push({ 
			label: "Phone", 
			value: data.phoneNumber, 
			icon: "📱" 
		});
	}

	if (data.text) {
		detailItems.push({ 
			label: "Message Length", 
			value: `${data.text.length} characters`, 
			icon: "📝" 
		});
	}

	// Add metadata
	if (metadata?.format) {
		detailItems.push({ label: "Format", value: metadata.format, icon: "📱" });
	}
	if (metadata?.detectionTime !== undefined) {
		detailItems.push({
			label: "Detection",
			value: `${metadata.detectionTime}ms`,
			icon: "⚡",
		});
	}

	const getTypeIcon = () => {
		switch (data.type) {
			case "bot": return "🤖";
			case "channel": return "📢";
			case "group": return "👥";
			default: return "✈️";
		}
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Telegram"
			primaryActionLabel="Open in Telegram"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View style={styles.logoSection}>
					<Text style={styles.logo}>{getTypeIcon()}</Text>
					<View>
						<Text style={[styles.appName, { color: theme.text }]}>Telegram</Text>
						<Text style={[styles.typeLabel, { color: theme.textSecondary }]}>
							{data.type.charAt(0).toUpperCase() + data.type.slice(1)}
						</Text>
					</View>
				</View>

				{data.username && (
					<View 
						style={styles.section} 
						accessible={true} 
						accessibilityLabel={`Username: @${data.username}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Username
						</Text>
						<Text style={[styles.username, { color: theme.primary }]}>
							@{data.username}
						</Text>
					</View>
				)}

				{data.phoneNumber && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Phone: ${data.phoneNumber}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Phone Number
						</Text>
						<Text style={[styles.phoneNumber, { color: theme.text }]}>
							{data.phoneNumber}
						</Text>
					</View>
				)}

				{data.chatId && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel="Group invite link"
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Invite Link
						</Text>
						<Text style={[styles.value, { color: theme.text }]}>
							Group invitation
						</Text>
					</View>
				)}

				{data.text && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Pre-filled message: ${data.text}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Pre-filled Message
						</Text>
						<View style={[styles.messageBox, { 
							backgroundColor: `${theme.textSecondary}10`,
							borderColor: `${theme.textSecondary}20`
						}]}>
							<Text style={[styles.messageText, { color: theme.text }]}>
								{data.text}
							</Text>
						</View>
					</View>
				)}

				{detailItems.length > 0 && (
					<DetailSection title="Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

TelegramPreview.displayName = 'TelegramPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	logoSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	logo: {
		fontSize: 32,
	},
	appName: {
		fontSize: 20,
		fontWeight: "600",
	},
	typeLabel: {
		fontSize: 14,
		marginTop: 2,
	},
	section: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	username: {
		fontSize: 20,
		fontWeight: "600",
	},
	phoneNumber: {
		fontSize: 18,
		fontWeight: "600",
	},
	value: {
		fontSize: 15,
	},
	messageBox: {
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
	},
	messageText: {
		fontSize: 15,
		lineHeight: 22,
	},
});


