import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { TOTPData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const TOTPPreview: React.FC<PreviewProps<TOTPData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy_secret", label: "Copy Secret" },
		{ id: "copy_uri", label: "Copy URI" },
		{ id: "share", label: "Share" },
		{ id: "view_details", label: "View Details" },
	];

	// Build detail items
	const detailItems: DetailItem[] = [];

	detailItems.push({ 
		label: "Algorithm", 
		value: data.algorithm || "SHA1", 
		icon: "🔐" 
	});

	detailItems.push({ 
		label: "Digits", 
		value: String(data.digits || 6), 
		icon: "🔢" 
	});

	if (data.period) {
		detailItems.push({ 
			label: "Period", 
			value: `${data.period} seconds`, 
			icon: "⏱️" 
		});
	}

	if (data.counter !== undefined) {
		detailItems.push({ 
			label: "Counter", 
			value: String(data.counter), 
			icon: "🔄" 
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
			title="Authenticator Setup"
			primaryActionLabel="Add to Authenticator"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={[styles.typeBadge, { backgroundColor: theme.primary }]}
					accessible={true}
					accessibilityLabel={`Type: ${data.type.toUpperCase()}`}
					accessibilityRole="text"
				>
					<Text style={[styles.typeText, { color: theme.primaryText }]}>
						{data.type.toUpperCase()}
					</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={[styles.infoTitle, { color: theme.text }]}>
						Two-Factor Authentication
					</Text>
					<Text style={[styles.infoDescription, { color: theme.textSecondary }]}>
						Set up 2FA for enhanced account security
					</Text>
				</View>

				{data.issuer && (
					<View 
						style={styles.section} 
						accessible={true} 
						accessibilityLabel={`Issuer: ${data.issuer}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Issuer
						</Text>
						<Text style={[styles.value, styles.prominentValue, { color: theme.text }]}>
							{data.issuer}
						</Text>
					</View>
				)}

				{data.accountName && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Account: ${data.accountName}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Account
						</Text>
						<Text style={[styles.value, { color: theme.text }]}>
							{data.accountName}
						</Text>
					</View>
				)}

				<View 
					style={styles.section}
					accessible={true}
					accessibilityLabel="Secret key"
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>
						Secret Key
					</Text>
					<Text 
						style={[styles.value, styles.secretText, { 
							color: theme.text,
							backgroundColor: `${theme.textSecondary}10`
						}]} 
						numberOfLines={2}
						ellipsizeMode="middle"
					>
						{data.secret}
					</Text>
				</View>

				<View 
					style={[styles.warningBox, { 
						backgroundColor: `${theme.primary}15`,
						borderColor: `${theme.primary}40`
					}]}
				>
					<Text style={styles.warningIcon}>⚠️</Text>
					<Text style={[styles.warningText, { color: theme.text }]}>
						Keep this secret key secure. Anyone with access to it can generate codes for your account.
					</Text>
				</View>

				{detailItems.length > 0 && (
					<DetailSection title="Configuration" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

TOTPPreview.displayName = 'TOTPPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	typeBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	typeText: {
		fontSize: 12,
		fontWeight: "600",
	},
	infoSection: {
		gap: 6,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	infoDescription: {
		fontSize: 14,
		lineHeight: 20,
	},
	section: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	value: {
		fontSize: 15,
	},
	prominentValue: {
		fontSize: 17,
		fontWeight: "600",
	},
	secretText: {
		fontFamily: "monospace",
		fontSize: 13,
		padding: 8,
		borderRadius: 4,
	},
	warningBox: {
		flexDirection: "row",
		gap: 10,
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
	},
	warningIcon: {
		fontSize: 20,
	},
	warningText: {
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
});


