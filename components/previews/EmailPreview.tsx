import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { EmailData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const EmailPreview: React.FC<PreviewProps<EmailData>> = memo(
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

		if (data.cc && data.cc.length > 0) {
			detailItems.push({
				label: "CC Recipients",
				value: `${data.cc.length}`,
				icon: "👥",
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

		return (
			<PreviewModal
				isVisible={true}
				onDismiss={onDismiss}
				title="Email"
				primaryActionLabel="Compose Email"
				onPrimaryAction={onPrimaryAction}
				secondaryActions={secondaryActions}
				onSecondaryAction={onSecondaryAction}
				isLoading={isProcessing}
			>
				<View style={styles.container} accessible={false}>
					<View
						style={styles.emailSection}
						accessible={true}
						accessibilityLabel={`Email address: ${data.address}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>To</Text>
						<Text style={[styles.email, { color: theme.primary }]}>{data.address}</Text>
					</View>

					{data.subject && (
						<View
							style={styles.section}
							accessible={true}
							accessibilityLabel={`Subject: ${data.subject}`}
						>
							<Text style={[styles.label, { color: theme.textSecondary }]}>Subject</Text>
							<Text style={[styles.value, { color: theme.text }]}>{data.subject}</Text>
						</View>
					)}

					{data.body && (
						<View
							style={styles.section}
							accessible={true}
							accessibilityLabel={`Message: ${data.body}`}
						>
							<Text style={[styles.label, { color: theme.textSecondary }]}>Message</Text>
							<Text style={[styles.body, { color: theme.text, backgroundColor: theme.surface }]}>{data.body}</Text>
						</View>
					)}

					{data.cc && data.cc.length > 0 && (
						<View
							style={styles.section}
							accessible={true}
							accessibilityLabel={`CC: ${data.cc.join(", ")}`}
						>
							<Text style={[styles.label, { color: theme.textSecondary }]}>CC</Text>
							{data.cc.map((email) => (
								<Text key={email} style={[styles.ccEmail, { color: theme.primary }]}>
									{email}
								</Text>
							))}
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

EmailPreview.displayName = "EmailPreview";

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	emailSection: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	email: {
		fontSize: 20,
		fontWeight: "600",
	},
	section: {
		gap: 8,
	},
	value: {
		fontSize: 17,
	},
	body: {
		fontSize: 15,
		lineHeight: 22,
		padding: 12,
		borderRadius: 8,
	},
	ccEmail: {
		fontSize: 14,
		paddingLeft: 8,
	},
});
