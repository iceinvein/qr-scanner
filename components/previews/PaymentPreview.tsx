import { useTheme } from "@/contexts/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { PaymentData } from "../../types/parsers";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const PaymentPreview: React.FC<PreviewProps<PaymentData>> = memo(({
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

	const getCurrencyIcon = (currency: string) => {
		const icons: Record<string, string> = {
			bitcoin: "₿",
			btc: "₿",
			ethereum: "Ξ",
			eth: "Ξ",
		};
		return icons[currency.toLowerCase()] || currency.toUpperCase();
	};

	const truncateAddress = (address: string, startChars = 10, endChars = 8) => {
		if (address.length <= startChars + endChars) return address;
		return `${address.substring(0, startChars)}...${address.substring(
			address.length - endChars,
		)}`;
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Payment Request"
			primaryActionLabel="Open Wallet"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={styles.currencySection}
					accessible={true}
					accessibilityLabel={`Currency: ${data.currency.toUpperCase()}`}
				>
					<View style={styles.currencyIcon}>
						<Text style={styles.currencyIconText}>
							{getCurrencyIcon(data.currency)}
						</Text>
					</View>
					<Text style={[styles.currencyName, { color: theme.text }]}>{data.currency.toUpperCase()}</Text>
				</View>

				<View 
					style={styles.addressSection}
					accessible={true}
					accessibilityLabel={`Payment address: ${data.address}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Address</Text>
					<Text style={[styles.address, { color: theme.text }]} numberOfLines={2} ellipsizeMode="middle">
						{truncateAddress(data.address)}
					</Text>
					<Text style={[styles.addressFull, { color: theme.textSecondary }]} numberOfLines={1}>
						{data.address}
					</Text>
				</View>

				{data.amount && (
					<View 
						style={styles.amountSection}
						accessible={true}
						accessibilityLabel={`Amount: ${data.amount} ${data.currency.toUpperCase()}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Amount</Text>
						<View style={styles.amountRow}>
							<Text style={[styles.amount, { color: theme.text }]}>{data.amount}</Text>
							<Text style={[styles.amountUnit, { color: theme.textSecondary }]}>
								{data.currency.toUpperCase()}
							</Text>
						</View>
					</View>
				)}

				{data.label && (
					<View 
						style={styles.infoSection}
						accessible={true}
						accessibilityLabel={`Label: ${data.label}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Label</Text>
						<Text style={[styles.infoText, { color: theme.text }]}>{data.label}</Text>
					</View>
				)}

				{data.message && (
					<View 
						style={styles.infoSection}
						accessible={true}
						accessibilityLabel={`Message: ${data.message}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Message</Text>
						<Text style={[styles.infoText, { color: theme.text }]}>{data.message}</Text>
					</View>
				)}

				<View style={[styles.typeSection, { borderTopColor: theme.border }]}>
					<Text style={[styles.typeLabel, { color: theme.textSecondary }]}>
						Type: {data.type === "crypto" ? "Cryptocurrency" : "Payment URI"}
					</Text>
				</View>
			</View>
		</PreviewModal>
	);
});

PaymentPreview.displayName = 'PaymentPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	currencySection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	currencyIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: "#FF9500",
		alignItems: "center",
		justifyContent: "center",
	},
	currencyIconText: {
		fontSize: 24,
		color: "#FFF",
		fontWeight: "600",
	},
	currencyName: {
		fontSize: 20,
		fontWeight: "600",
	},
	addressSection: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	address: {
		fontSize: 16,
		fontWeight: "500",
		fontFamily: "monospace",
	},
	addressFull: {
		fontSize: 11,
		fontFamily: "monospace",
	},
	amountSection: {
		gap: 8,
	},
	amountRow: {
		flexDirection: "row",
		alignItems: "baseline",
		gap: 8,
	},
	amount: {
		fontSize: 28,
		fontWeight: "700",
	},
	amountUnit: {
		fontSize: 18,
		fontWeight: "600",
	},
	infoSection: {
		gap: 4,
	},
	infoText: {
		fontSize: 15,
	},
	typeSection: {
		paddingTop: 8,
		borderTopWidth: 1,
	},
	typeLabel: {
		fontSize: 13,
	},
});
