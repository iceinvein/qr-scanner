import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { TextData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const TextPreview: React.FC<PreviewProps<TextData>> = memo(
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

		detailItems.push({
			label: "Words",
			value: `${data.wordCount}`,
			icon: "📝",
		});

		detailItems.push({
			label: "Lines",
			value: `${data.lineCount}`,
			icon: "📄",
		});

		if (data.language) {
			detailItems.push({
				label: "Script",
				value: data.language,
				icon: "🌐",
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
				title="Text Content"
				primaryActionLabel="Copy Text"
				onPrimaryAction={onPrimaryAction}
				secondaryActions={secondaryActions}
				onSecondaryAction={onSecondaryAction}
				isLoading={isProcessing}
			>
				<View style={styles.container} accessible={false}>
					<View style={[styles.textIcon, { backgroundColor: theme.primary }]}>
						<Text style={styles.iconText}>📄</Text>
					</View>

					<View
						style={styles.contentSection}
						accessible={true}
						accessibilityLabel={`Text content: ${data.content}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Content</Text>
						<ScrollView
							style={[styles.contentScroll, { backgroundColor: theme.surface }]}
							nestedScrollEnabled
							showsVerticalScrollIndicator={true}
						>
							<Text style={[styles.content, { color: theme.text }]} selectable>
								{data.content}
							</Text>
						</ScrollView>
					</View>

					{detailItems.length > 0 && (
						<DetailSection title="Text Details" items={detailItems} />
					)}
				</View>
			</PreviewModal>
		);
	},
);

TextPreview.displayName = "TextPreview";

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	textIcon: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
	},
	iconText: {
		fontSize: 32,
	},
	contentSection: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	contentScroll: {
		maxHeight: 250,
		borderRadius: 12,
		padding: 16,
	},
	content: {
		fontSize: 16,
		lineHeight: 24,
	},
});
