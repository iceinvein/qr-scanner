import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { PhoneData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const PhonePreview: React.FC<PreviewProps<PhoneData>> = memo(
	({
		data,
		onPrimaryAction,
		onSecondaryAction,
		onDismiss,
		isProcessing = false,
		metadata,
	}) => {
		const { theme } = useTheme();
		const secondaryActions: SecondaryAction[] = [
			{ id: "copy", label: "Copy" },
			{ id: "share", label: "Share" },
		];

		// Build detail items
		const detailItems: DetailItem[] = [];

		if (data.countryCode) {
			detailItems.push({
				label: "Country Code",
				value: `+${data.countryCode}`,
				icon: "🌍",
			});
		}

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
				title="Phone Number"
				primaryActionLabel="Call"
				onPrimaryAction={onPrimaryAction}
				secondaryActions={secondaryActions}
				onSecondaryAction={onSecondaryAction}
				isLoading={isProcessing}
			>
				<View style={styles.container} accessible={false}>
					<View style={styles.phoneIcon}>
						<Text style={styles.iconText}>📞</Text>
					</View>

					<View
						style={styles.phoneSection}
						accessible={true}
						accessibilityLabel={`Phone number: ${data.formatted}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number</Text>
						<Text style={[styles.phoneNumber, { color: theme.text }]}>{data.formatted}</Text>
					</View>

					{data.number !== data.formatted && (
						<View
							style={[styles.rawSection, { borderTopColor: theme.border }]}
							accessible={true}
							accessibilityLabel={`Raw number: ${data.number}`}
						>
							<Text style={[styles.rawLabel, { color: theme.textSecondary }]}>Raw Format</Text>
							<Text style={[styles.rawNumber, { color: theme.text }]}>{data.number}</Text>
						</View>
					)}

					{detailItems.length > 0 && (
						<DetailSection title="Additional Details" items={detailItems} />
					)}
				</View>
			</PreviewModal>
		);
	},
);

PhonePreview.displayName = "PhonePreview";

const styles = StyleSheet.create({
	container: {
		gap: 16,
		alignItems: "center",
	},
	phoneIcon: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#34C759",
		alignItems: "center",
		justifyContent: "center",
	},
	iconText: {
		fontSize: 40,
	},
	phoneSection: {
		gap: 4,
		alignItems: "center",
		width: "100%",
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	phoneNumber: {
		fontSize: 28,
		fontWeight: "600",
	},
	rawSection: {
		gap: 4,
		alignItems: "center",
		paddingTop: 8,
		borderTopWidth: 1,
		width: "100%",
	},
	rawLabel: {
		fontSize: 11,
		fontWeight: "500",
	},
	rawNumber: {
		fontSize: 14,
		fontFamily: "monospace",
	},
});
