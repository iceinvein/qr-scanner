import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { MeCardData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const MeCardPreview: React.FC<PreviewProps<MeCardData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy Details" },
		{ id: "share", label: "Share" },
	];

	// Build detail items
	const detailItems: DetailItem[] = [];

	if (data.phone) {
		detailItems.push({ 
			label: "Phone", 
			value: data.phone, 
			icon: "📞" 
		});
	}

	if (data.email) {
		detailItems.push({ 
			label: "Email", 
			value: data.email, 
			icon: "📧" 
		});
	}

	if (data.address) {
		detailItems.push({ 
			label: "Address", 
			value: data.address, 
			icon: "📍" 
		});
	}

	if (data.url) {
		detailItems.push({ 
			label: "Website", 
			value: data.url, 
			icon: "🌐" 
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
			title="Contact"
			primaryActionLabel="Save Contact"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View style={styles.avatarSection}>
					<View style={[styles.avatar, { backgroundColor: theme.primary }]}>
						<Text style={[styles.avatarText, { color: theme.primaryText }]}>
							{data.name.fullName?.charAt(0) || data.name.firstName?.charAt(0) || "?"}
						</Text>
					</View>
				</View>

				{data.name.fullName && (
					<View 
						style={styles.nameSection} 
						accessible={true} 
						accessibilityLabel={`Name: ${data.name.fullName}`}
					>
						<Text style={[styles.fullName, { color: theme.text }]}>
							{data.name.fullName}
						</Text>
					</View>
				)}

				{!data.name.fullName && (data.name.firstName || data.name.lastName) && (
					<View 
						style={styles.nameSection}
						accessible={true}
						accessibilityLabel={`Name: ${data.name.firstName} ${data.name.lastName}`}
					>
						<Text style={[styles.fullName, { color: theme.text }]}>
							{`${data.name.firstName || ""} ${data.name.lastName || ""}`.trim()}
						</Text>
					</View>
				)}

				{data.phone && (
					<View 
						style={styles.contactRow}
						accessible={true}
						accessibilityLabel={`Phone: ${data.phone}`}
					>
						<View style={[styles.iconBox, { backgroundColor: `${theme.primary}15` }]}>
							<Text style={styles.icon}>📞</Text>
						</View>
						<View style={styles.contactInfo}>
							<Text style={[styles.contactLabel, { color: theme.textSecondary }]}>
								Phone
							</Text>
							<Text style={[styles.contactValue, { color: theme.text }]}>
								{data.phone}
							</Text>
						</View>
					</View>
				)}

				{data.email && (
					<View 
						style={styles.contactRow}
						accessible={true}
						accessibilityLabel={`Email: ${data.email}`}
					>
						<View style={[styles.iconBox, { backgroundColor: `${theme.primary}15` }]}>
							<Text style={styles.icon}>📧</Text>
						</View>
						<View style={styles.contactInfo}>
							<Text style={[styles.contactLabel, { color: theme.textSecondary }]}>
								Email
							</Text>
							<Text style={[styles.contactValue, { color: theme.text }]}>
								{data.email}
							</Text>
						</View>
					</View>
				)}

				{data.address && (
					<View 
						style={styles.contactRow}
						accessible={true}
						accessibilityLabel={`Address: ${data.address}`}
					>
						<View style={[styles.iconBox, { backgroundColor: `${theme.primary}15` }]}>
							<Text style={styles.icon}>📍</Text>
						</View>
						<View style={styles.contactInfo}>
							<Text style={[styles.contactLabel, { color: theme.textSecondary }]}>
								Address
							</Text>
							<Text style={[styles.contactValue, { color: theme.text }]}>
								{data.address}
							</Text>
						</View>
					</View>
				)}

				{data.url && (
					<View 
						style={styles.contactRow}
						accessible={true}
						accessibilityLabel={`Website: ${data.url}`}
					>
						<View style={[styles.iconBox, { backgroundColor: `${theme.primary}15` }]}>
							<Text style={styles.icon}>🌐</Text>
						</View>
						<View style={styles.contactInfo}>
							<Text style={[styles.contactLabel, { color: theme.textSecondary }]}>
								Website
							</Text>
							<Text style={[styles.contactValue, { color: theme.text }]} numberOfLines={1}>
								{data.url}
							</Text>
						</View>
					</View>
				)}

				{data.memo && (
					<View style={[styles.memoBox, { 
						backgroundColor: `${theme.textSecondary}10`,
						borderColor: `${theme.textSecondary}20`
					}]}>
						<Text style={[styles.memoLabel, { color: theme.textSecondary }]}>
							Note
						</Text>
						<Text style={[styles.memoText, { color: theme.text }]}>
							{data.memo}
						</Text>
					</View>
				)}

				{metadata && (
					<DetailSection title="Metadata" items={detailItems.filter(item => 
						item.label === "Format" || item.label === "Detection"
					)} />
				)}
			</View>
		</PreviewModal>
	);
});

MeCardPreview.displayName = 'MeCardPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	avatarSection: {
		alignItems: "center",
		marginVertical: 8,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarText: {
		fontSize: 32,
		fontWeight: "600",
	},
	nameSection: {
		alignItems: "center",
	},
	fullName: {
		fontSize: 24,
		fontWeight: "600",
		textAlign: "center",
	},
	contactRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	iconBox: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
	},
	icon: {
		fontSize: 20,
	},
	contactInfo: {
		flex: 1,
		gap: 2,
	},
	contactLabel: {
		fontSize: 12,
		fontWeight: "500",
	},
	contactValue: {
		fontSize: 16,
	},
	memoBox: {
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		gap: 4,
	},
	memoLabel: {
		fontSize: 12,
		fontWeight: "500",
	},
	memoText: {
		fontSize: 14,
		lineHeight: 20,
	},
});


