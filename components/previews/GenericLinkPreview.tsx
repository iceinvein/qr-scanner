import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

interface GenericLinkPreviewProps<T extends { url: string }> extends PreviewProps<T> {
	title: string;
	icon: string;
	primaryLabel: string;
	buildDetails: (data: T) => DetailItem[];
	renderCustomContent?: (data: T) => React.ReactNode;
}

export function createGenericLinkPreview<T extends { url: string }>() {
	return memo<GenericLinkPreviewProps<T>>(({
		data,
		onPrimaryAction,
		onSecondaryAction,
		onDismiss,
		isProcessing = false,
		metadata,
		title,
		icon,
		primaryLabel,
		buildDetails,
		renderCustomContent,
	}) => {
		const { theme } = useTheme();
		
		const secondaryActions: SecondaryAction[] = [
			{ id: "copy", label: "Copy Link" },
			{ id: "share", label: "Share" },
		];

		const detailItems = buildDetails(data);

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
				title={title}
				primaryActionLabel={primaryLabel}
				onPrimaryAction={onPrimaryAction}
				secondaryActions={secondaryActions}
				onSecondaryAction={onSecondaryAction}
				isLoading={isProcessing}
			>
				<View style={styles.container} accessible={false}>
					<View style={styles.iconSection}>
						<Text style={styles.largeIcon}>{icon}</Text>
						<Text style={[styles.title, { color: theme.text }]}>{title}</Text>
					</View>

					{renderCustomContent?.(data)}

					<View style={styles.urlSection}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							Link
						</Text>
						<Text 
							style={[styles.urlText, { color: theme.primary }]} 
							numberOfLines={2}
							ellipsizeMode="middle"
						>
							{data.url}
						</Text>
					</View>

					{detailItems.length > 0 && (
						<DetailSection title="Details" items={detailItems} />
					)}
				</View>
			</PreviewModal>
		);
	});
}

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
	urlSection: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	urlText: {
		fontSize: 14,
		lineHeight: 20,
	},
});


