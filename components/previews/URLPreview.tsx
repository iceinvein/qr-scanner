import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { URLData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const URLPreview: React.FC<PreviewProps<URLData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const { theme } = useTheme();
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy URL" },
		{ id: "share", label: "Share" },
		{ id: "external", label: "Open in Browser" },
	];

	const truncatePath = (path: string, maxLength: number = 40) => {
		if (path.length <= maxLength) return path;
		return path.substring(0, maxLength - 3) + "...";
	};

	// Build detail items
	const detailItems: DetailItem[] = [];
	
	// Add URL-specific details
	const fullUrl = `${data.protocol}://${data.domain}${data.path}`;
	detailItems.push({ label: "Full URL", value: fullUrl, icon: "🔗" });
	
	if (Object.keys(data.queryParams).length > 0) {
		detailItems.push({
			label: "Parameters",
			value: `${Object.keys(data.queryParams).length} params`,
			icon: "🔧",
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
			title="URL"
			primaryActionLabel="Open"
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
					<Text style={[styles.protocolText, { color: theme.primaryText }]}>{data.protocol.toUpperCase()}</Text>
				</View>

				<View style={styles.urlSection} accessible={true} accessibilityLabel={`Domain: ${data.domain}`}>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Domain</Text>
					<Text style={[styles.domain, { color: theme.text }]}>{data.domain}</Text>
				</View>

				{data.path && data.path !== "/" && (
					<View style={styles.urlSection} accessible={true} accessibilityLabel={`Path: ${data.path}`}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Path</Text>
						<Text style={[styles.path, { color: theme.text }]} numberOfLines={2} ellipsizeMode="middle">
							{truncatePath(data.path)}
						</Text>
					</View>
				)}

				{Object.keys(data.queryParams).length > 0 && (
					<View 
						style={styles.urlSection}
						accessible={true}
						accessibilityLabel={`Parameters: ${Object.entries(data.queryParams).map(([k, v]) => `${k} equals ${v}`).join(', ')}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Parameters</Text>
						{Object.entries(data.queryParams)
							.slice(0, 3)
							.map(([key, value]) => (
								<Text key={key} style={[styles.param, { color: theme.text }]} numberOfLines={1}>
									{key}: {value}
								</Text>
							))}
						{Object.keys(data.queryParams).length > 3 && (
							<Text style={[styles.moreParams, { color: theme.textSecondary }]}>
								+{Object.keys(data.queryParams).length - 3} more
							</Text>
						)}
					</View>
				)}

				{data.fragment && (
					<View style={styles.urlSection} accessible={true} accessibilityLabel={`Fragment: ${data.fragment}`}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Fragment</Text>
						<Text style={[styles.fragment, { color: theme.primary }]}>#{data.fragment}</Text>
					</View>
				)}

				{detailItems.length > 0 && (
					<DetailSection title="Additional Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

URLPreview.displayName = 'URLPreview';

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
	urlSection: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	domain: {
		fontSize: 17,
		fontWeight: "600",
	},
	path: {
		fontSize: 15,
	},
	param: {
		fontSize: 14,
		paddingLeft: 8,
	},
	moreParams: {
		fontSize: 13,
		fontStyle: "italic",
		paddingLeft: 8,
	},
	fragment: {
		fontSize: 14,
	},
});
