import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PreviewModal } from "../PreviewModal";

export interface UnknownPreviewProps {
	rawContent: string;
	onCopy: () => void;
	onDismiss: () => void;
	metadata?: {
		format?: string;
		dataLength?: number;
		encoding?: string;
		detectionTime?: number;
	};
}

export const UnknownPreview: React.FC<UnknownPreviewProps> = memo(({
	rawContent,
	onCopy,
	onDismiss,
	metadata,
}) => {
	const { theme } = useTheme();
	// Analyze content to provide suggestions
	const analyzeContent = () => {
		const suggestions: string[] = [];
		
		// Check for common patterns
		if (/^[0-9]+$/.test(rawContent)) {
			suggestions.push("Numeric code or ID");
		}
		if (/^[A-Z0-9]{8,}$/.test(rawContent)) {
			suggestions.push("Serial number or product code");
		}
		if (rawContent.includes("://") && !rawContent.startsWith("http")) {
			suggestions.push("Custom URL scheme");
		}
		if (/^[A-Za-z0-9+/=]+$/.test(rawContent) && rawContent.length % 4 === 0) {
			suggestions.push("Base64 encoded data");
		}
		if (rawContent.includes("{") || rawContent.includes("[")) {
			suggestions.push("Structured data (JSON-like)");
		}
		if (/[\u4e00-\u9fa5]/.test(rawContent)) {
			suggestions.push("Contains Chinese characters");
		}
		if (/[\u0400-\u04FF]/.test(rawContent)) {
			suggestions.push("Contains Cyrillic characters");
		}
		if (/[\u0600-\u06FF]/.test(rawContent)) {
			suggestions.push("Contains Arabic characters");
		}
		
		return suggestions;
	};

	const suggestions = analyzeContent();

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Unknown Content"
			primaryActionLabel="Copy"
			onPrimaryAction={onCopy}
			secondaryActions={[
				{ id: "search", label: "Search Online" },
				{ id: "share", label: "Share" },
			]}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
					accessible={true}
					accessibilityRole="alert"
					accessibilityLabel="Information: We couldn't recognize this QR code format. You can copy the content below."
				>
					<Text style={styles.infoIcon}>ℹ️</Text>
					<Text style={[styles.infoText, { color: theme.text }]}>
						We couldn&apos;t recognize this QR code format. You can copy the content
						below.
					</Text>
				</View>

				{/* Content Analysis */}
				{suggestions.length > 0 && (
					<View style={styles.analysisSection} accessible={false}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Possible Content Type</Text>
						{suggestions.map((suggestion) => (
							<View key={suggestion} style={styles.suggestionItem}>
								<Text style={[styles.suggestionBullet, { color: theme.primary }]}>•</Text>
								<Text style={[styles.suggestionText, { color: theme.text }]}>{suggestion}</Text>
							</View>
						))}
					</View>
				)}

				{/* Technical Details */}
				{metadata && (
					<View style={styles.metadataSection} accessible={false}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Technical Details</Text>
						<View style={styles.metadataGrid}>
							{metadata.format && (
								<View key="format" style={[styles.metadataItem, { backgroundColor: theme.surface }]}>
									<Text style={[styles.metadataKey, { color: theme.textSecondary }]}>Format</Text>
									<Text style={[styles.metadataValue, { color: theme.text }]}>{metadata.format}</Text>
								</View>
							)}
							<View key="length" style={[styles.metadataItem, { backgroundColor: theme.surface }]}>
								<Text style={[styles.metadataKey, { color: theme.textSecondary }]}>Length</Text>
								<Text style={[styles.metadataValue, { color: theme.text }]}>
									{metadata.dataLength || rawContent.length} chars
								</Text>
							</View>
							{metadata.encoding && (
								<View key="encoding" style={[styles.metadataItem, { backgroundColor: theme.surface }]}>
									<Text style={[styles.metadataKey, { color: theme.textSecondary }]}>Encoding</Text>
									<Text style={[styles.metadataValue, { color: theme.text }]}>{metadata.encoding}</Text>
								</View>
							)}
							{metadata.detectionTime !== undefined && (
								<View key="detection" style={[styles.metadataItem, { backgroundColor: theme.surface }]}>
									<Text style={[styles.metadataKey, { color: theme.textSecondary }]}>Detection</Text>
									<Text style={[styles.metadataValue, { color: theme.text }]}>{metadata.detectionTime}ms</Text>
								</View>
							)}
						</View>
					</View>
				)}

				{/* Raw Content */}
				<View style={styles.contentSection} accessible={false}>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Raw Content</Text>
					<ScrollView 
						style={[styles.contentScroll, { backgroundColor: theme.surface }]} 
						nestedScrollEnabled
						accessible={true}
						accessibilityLabel={`Raw content: ${rawContent}`}
					>
						<Text style={[styles.rawContent, { color: theme.text }]} selectable>
							{rawContent}
						</Text>
					</ScrollView>
				</View>
			</View>
		</PreviewModal>
	);
});

UnknownPreview.displayName = 'UnknownPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	infoBox: {
		flexDirection: "row",
		padding: 12,
		borderRadius: 8,
		gap: 12,
		borderWidth: 1,
	},
	infoIcon: {
		fontSize: 20,
	},
	infoText: {
		flex: 1,
		fontSize: 14,
		lineHeight: 20,
	},
	analysisSection: {
		gap: 8,
	},
	suggestionItem: {
		flexDirection: "row",
		gap: 8,
		paddingLeft: 8,
	},
	suggestionBullet: {
		fontSize: 14,
		fontWeight: "600",
	},
	suggestionText: {
		flex: 1,
		fontSize: 14,
	},
	metadataSection: {
		gap: 8,
	},
	metadataGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	metadataItem: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 6,
		minWidth: "45%",
	},
	metadataKey: {
		fontSize: 11,
		fontWeight: "500",
		marginBottom: 2,
	},
	metadataValue: {
		fontSize: 14,
		fontWeight: "600",
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
		maxHeight: 200,
		borderRadius: 8,
		padding: 12,
	},
	rawContent: {
		fontSize: 14,
		fontFamily: "monospace",
		lineHeight: 20,
	},
});
