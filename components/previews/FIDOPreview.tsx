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

	// Type guard: Handle case where data might be a string instead of FIDOData object
	// This can happen if data gets serialized/deserialized incorrectly
	const fidoData: FIDOData = typeof data === 'string'
		? { protocol: 'fido', rawData: data }
		: data;

	// Check if this is a passkey QR (cross-device authentication)
	const isPasskey = fidoData.protocol === 'fido2-hybrid';

	// Determine primary action label based on type
	const primaryActionLabel = isPasskey ? "Authenticate with Passkey" : "Use Credential";

	// Build secondary actions based on available data
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy All" },
	];

	if (fidoData.credentialId) {
		secondaryActions.push({ id: "copy_credential_id", label: "Copy Credential ID" });
	}

	if (fidoData.rpId) {
		secondaryActions.push({ id: "copy_rp_id", label: "Copy RP ID" });
	}

	if (fidoData.challenge) {
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
	if (fidoData.rpId) {
		detailItems.push({
			label: "Relying Party",
			value: fidoData.rpId,
			icon: "🏢"
		});
	}

	if (fidoData.credentialId) {
		detailItems.push({
			label: "Credential ID",
			value: truncateString(fidoData.credentialId, 30),
			icon: "🔑"
		});
	}

	if (fidoData.challenge) {
		detailItems.push({
			label: "Challenge",
			value: truncateString(fidoData.challenge, 30),
			icon: "🎲"
		});
	}

	if (fidoData.userId) {
		detailItems.push({
			label: "User ID",
			value: fidoData.userId,
			icon: "👤"
		});
	}

	if (fidoData.attestation) {
		detailItems.push({
			label: "Attestation",
			value: fidoData.attestation,
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
			title={isPasskey ? "Passkey Authentication" : "FIDO Authentication"}
			primaryActionLabel={primaryActionLabel}
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View
					style={[styles.protocolBadge, { backgroundColor: theme.primary }]}
					accessible={true}
					accessibilityLabel={`Protocol: ${fidoData.protocol}`}
					accessibilityRole="text"
				>
					<Text style={[styles.protocolText, { color: theme.primaryText }]}>
						{isPasskey ? "PASSKEY" : fidoData.protocol.toUpperCase()}
					</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={[styles.infoTitle, { color: theme.text }]}>
						{isPasskey ? "Cross-Device Authentication" : "Authentication Credential"}
					</Text>
					<Text style={[styles.infoDescription, { color: theme.textSecondary }]}>
						{isPasskey 
							? "Tap below to authenticate using your device's passkey (Face ID, Touch ID, or PIN)."
							: "This QR code contains FIDO authentication data for passwordless login."}
					</Text>
				</View>

				{fidoData.rpId && (
					<View
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Relying Party: ${fidoData.rpId}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Relying Party ID
						</Text>
						<Text style={[styles.value, { color: theme.text }]} numberOfLines={2}>
							{fidoData.rpId}
						</Text>
					</View>
				)}

				{fidoData.credentialId && (
					<View
						style={styles.section}
						accessible={true}
						accessibilityLabel={`Credential ID: ${truncateString(fidoData.credentialId, 40)}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Credential ID
						</Text>
						<Text
							style={[styles.value, styles.monoText, { color: theme.text }]}
							numberOfLines={2}
							ellipsizeMode="middle"
						>
							{truncateString(fidoData.credentialId, 50)}
						</Text>
					</View>
				)}

				{fidoData.challenge && (
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
							{truncateString(fidoData.challenge, 50)}
						</Text>
					</View>
				)}

				{fidoData.userId && (
					<View
						style={styles.section}
						accessible={true}
						accessibilityLabel={`User ID: ${fidoData.userId}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							User ID
						</Text>
						<Text style={[styles.value, { color: theme.text }]}>
							{fidoData.userId}
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

