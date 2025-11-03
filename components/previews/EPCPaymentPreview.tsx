import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { EPCPaymentData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const EPCPaymentPreview: React.FC<PreviewProps<EPCPaymentData>> = memo(({
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

	detailItems.push({ 
		label: "Beneficiary", 
		value: data.beneficiaryName, 
		icon: "👤" 
	});

	detailItems.push({ 
		label: "IBAN", 
		value: data.beneficiaryAccount, 
		icon: "🏦" 
	});

	if (data.bic) {
		detailItems.push({ 
			label: "BIC", 
			value: data.bic, 
			icon: "🔢" 
		});
	}

	if (data.amount) {
		detailItems.push({ 
			label: "Amount", 
			value: `€${data.amount}`, 
			icon: "💶" 
		});
	}

	if (data.reference) {
		detailItems.push({ 
			label: "Reference", 
			value: data.reference, 
			icon: "📋" 
		});
	}

	// Add metadata
	if (metadata?.format) {
		detailItems.push({ label: "Format", value: metadata.format, icon: "📱" });
	}

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="SEPA Payment"
			primaryActionLabel="Copy Payment Info"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View style={styles.iconSection}>
					<Text style={styles.largeIcon}>💳</Text>
					<Text style={[styles.title, { color: theme.text }]}>SEPA Payment</Text>
				</View>

				<View style={[styles.amountBox, { backgroundColor: `${theme.primary}15` }]}>
					<Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
						Amount
					</Text>
					<Text style={[styles.amountValue, { color: theme.primary }]}>
						{data.amount ? `€${data.amount}` : "Not specified"}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={[styles.label, { color: theme.textSecondary }]}>
						Pay To
					</Text>
					<Text style={[styles.beneficiaryName, { color: theme.text }]}>
						{data.beneficiaryName}
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={[styles.label, { color: theme.textSecondary }]}>
						IBAN
					</Text>
					<Text style={[styles.iban, { color: theme.text }]} numberOfLines={1}>
						{data.beneficiaryAccount}
					</Text>
				</View>

				{data.remittanceInfo && (
					<View style={[styles.memoBox, { 
						backgroundColor: `${theme.textSecondary}10`,
						borderColor: `${theme.textSecondary}20`
					}]}>
						<Text style={[styles.memoLabel, { color: theme.textSecondary }]}>
							Reference
						</Text>
						<Text style={[styles.memoText, { color: theme.text }]}>
							{data.remittanceInfo}
						</Text>
					</View>
				)}

				<View 
					style={[styles.warningBox, { 
						backgroundColor: `${theme.primary}15`,
						borderColor: `${theme.primary}40`
					}]}
				>
					<Text style={styles.warningIcon}>ℹ️</Text>
					<Text style={[styles.warningText, { color: theme.text }]}>
						Use this information in your banking app to complete the payment.
					</Text>
				</View>

				{detailItems.length > 0 && (
					<DetailSection title="Payment Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

EPCPaymentPreview.displayName = 'EPCPaymentPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	iconSection: {
		alignItems: "center",
		gap: 8,
	},
	largeIcon: {
		fontSize: 48,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
	},
	amountBox: {
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		gap: 4,
	},
	amountLabel: {
		fontSize: 14,
		fontWeight: "500",
	},
	amountValue: {
		fontSize: 32,
		fontWeight: "700",
	},
	section: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	beneficiaryName: {
		fontSize: 18,
		fontWeight: "600",
	},
	iban: {
		fontSize: 15,
		fontFamily: "monospace",
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


