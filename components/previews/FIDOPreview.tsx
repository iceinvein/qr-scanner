import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { FIDOData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const FIDOPreview: React.FC<PreviewProps<FIDOData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	
	// Build secondary actions based on available data
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy All" },
	];

	if (data.credentialId) {
		secondaryActions.push({ id: "copy_credential_id", label: "Copy Credential ID" });
	}

	if (data.rpId) {
		secondaryActions.push({ id: "copy_rp_id", label: "Copy RP ID" });
	}

	if (data.challenge) {
		secondaryActions.push({ id: "copy_challenge", label: "Copy Challenge" });
	}

	secondaryActions.push(
		{ id: "share", label: "Share" },
		{ id: "view_details", label: "View Details" }
	);

	const truncateString = (str: string, maxLength: number) => {
		if (str.length <= maxLength) return str;
		return str.substring(0, maxLength - 3) + "...";
	};

	// Build detail items
	const detailItems: DetailItem[] = [];

	// Add FIDO-specific details
	if (data.rpId) {
		detailItems.push({ 
			label: "Relying Party", 
			value: data.rpId, 
			icon: "🏢" 
		});
	}

	if (data.credentialId) {
		detailItems.push({ 
			label: "Credential ID", 
			value: truncateString(data.credentialId, 30), 
			icon: "🔑" 
		});
	}

	if (data.challenge) {
		detailItems.push({ 
			label: "Challenge", 
			value: truncateString(data.challenge, 30), 
			icon: "🎲" 
		});
	}

	if (data.userId) {
		detailItems.push({ 
			label: "User ID", 
			value: data.userId, 
			icon: "👤" 
		});
	}

	if (data.attestation) {
		detailItems.push({ 
			label: "Attestation", 
			value: data.attestation, 
			icon: "✓" 
		});
	}

	// Add metadata details
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
	if (metadata?.patterns && metadata.patterns.length > 0) {
		detailItems.push({
			label: "Matched",
			value: metadata.patterns[0],
			icon: "✓",
		});
	}

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="FIDO Authentication"
			primaryActionLabel="Use Credential"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={[styles.protocolBadge, { backgroundColor: theme.primary }]}
					accessible={true}
					accessibilityLabel={`Protocol: ${data.protocol}`}
					accessibilityRole="text"
				>
					<Text style={[styles.protocolText, { color: theme.primaryText }]}>
						{data.protocol.toUpperCase()}
					</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={[styles.infoTitle, { color: theme.text }]}>
						Authentication Credential
					</Text>
					<Text style={[styles.infoDescription, { color: theme.textSecondary }]}>
						This QR code contains FIDO authentication data for passwordless login.
					</Text>
				</View>

				{data.rpId && (
					<View 
						style={styles.section} 
						accessible={true} 
						accessibilityLabel={`Relying Party: ${data.rpId}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Relying Party ID
						</Text>
						<Text style={[styles.value, { color: theme.text }]} numberOfLines={2}>
							{data.rpId}
						</Text>
					</View>
				)}

				{data.credentialId && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Credential ID: ${truncateString(data.credentialId, 40)}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Credential ID
						</Text>
						<Text 
							style={[styles.value, styles.monoText, { color: theme.text }]} 
							numberOfLines={2}
							ellipsizeMode="middle"
						>
							{truncateString(data.credentialId, 50)}
						</Text>
					</View>
				)}

				{data.challenge && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Challenge present`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Challenge
						</Text>
						<Text 
							style={[styles.value, styles.monoText, { color: theme.text }]} 
							numberOfLines={2}
							ellipsizeMode="middle"
						>
							{truncateString(data.challenge, 50)}
						</Text>
					</View>
				)}

				{data.userId && (
					<View 
						style={styles.section}
						accessible={true}
						accessibilityLabel={`User ID: ${data.userId}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							User ID
						</Text>
						<Text style={[styles.value, { color: theme.text }]}>
							{data.userId}
						</Text>
					</View>
				)}

				<View 
					style={[styles.warningBox, { 
						backgroundColor: `${theme.primary}15`,
						borderColor: `${theme.primary}40`
					}]}
				>
					<Text style={[styles.warningIcon]}>🔒</Text>
					<Text style={[styles.warningText, { color: theme.text }]}>
						This credential is used for secure authentication. Only use it with trusted applications.
					</Text>
				</View>

				{detailItems.length > 0 && (
					<DetailSection title="Additional Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

FIDOPreview.displayName = 'FIDOPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	protocolBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	protocolText: {
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
	monoText: {
		fontFamily: "monospace",
		fontSize: 13,
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

