import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { WhatsAppData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const WhatsAppPreview: React.FC<PreviewProps<WhatsAppData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy_number", label: "Copy Number" },
	];

	if (data.text) {
		secondaryActions.push({ id: "copy_message", label: "Copy Message" });
	}

	secondaryActions.push(
		{ id: "open_web", label: "Open WhatsApp Web" },
		{ id: "share", label: "Share" }
	);

	// Build detail items
	const detailItems: DetailItem[] = [];

	detailItems.push({ 
		label: "Phone Number", 
		value: data.formattedNumber, 
		icon: "📱" 
	});

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

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="WhatsApp"
			primaryActionLabel="Open in WhatsApp"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View style={styles.logoSection}>
					<Text style={styles.logo}>💬</Text>
					<Text style={[styles.appName, { color: theme.text }]}>WhatsApp</Text>
				</View>

				<View 
					style={styles.section} 
					accessible={true} 
					accessibilityLabel={`Phone number: ${data.formattedNumber}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>
						Phone Number
					</Text>
					<Text style={[styles.phoneNumber, { color: theme.text }]}>
						{data.formattedNumber}
					</Text>
				</View>

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

				<View 
					style={[styles.infoBox, { 
						backgroundColor: `${theme.primary}15`,
						borderColor: `${theme.primary}40`
					}]}
				>
					<Text style={styles.infoIcon}>ℹ️</Text>
					<Text style={[styles.infoText, { color: theme.text }]}>
						This will open a WhatsApp chat with the number above
						{data.text ? " and pre-fill the message" : ""}.
					</Text>
				</View>

				{detailItems.length > 0 && (
					<DetailSection title="Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

WhatsAppPreview.displayName = 'WhatsAppPreview';

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
	section: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	phoneNumber: {
		fontSize: 20,
		fontWeight: "600",
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
	infoBox: {
		flexDirection: "row",
		gap: 10,
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
	},
	infoIcon: {
		fontSize: 20,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
});


