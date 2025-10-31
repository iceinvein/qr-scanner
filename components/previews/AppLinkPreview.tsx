import { useTheme } from "@/contexts/ThemeContext";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { AppLinkData } from "../../types/parsers";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const AppLinkPreview: React.FC<PreviewProps<AppLinkData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
}) => {
	const { theme } = useTheme();
	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy Link" },
		{ id: "share", label: "Share Link" },
	];

	const getAppName = () => {
		// Try to derive app name from scheme
		const schemeName = data.scheme.replace("://", "").replace(":", "");
		return schemeName.charAt(0).toUpperCase() + schemeName.slice(1);
	};

	const getActionDescription = () => {
		if (data.host) {
			return `Open ${data.host}${data.path || ""}`;
		}
		if (data.path) {
			return `Navigate to ${data.path}`;
		}
		return "Open in app";
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="App Link"
			primaryActionLabel="Open App"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={styles.headerSection}
					accessible={true}
					accessibilityLabel={`App: ${getAppName()}, Scheme: ${data.scheme}`}
					accessibilityRole="header"
				>
					<View style={styles.appIcon}>
						<Text style={styles.appIconText}>🔗</Text>
					</View>
					<View style={styles.appInfo}>
						<Text style={[styles.appName, { color: theme.text }]}>{getAppName()}</Text>
						<Text style={[styles.scheme, { color: theme.textSecondary }]}>{data.scheme}</Text>
					</View>
				</View>

				<View 
					style={styles.actionSection}
					accessible={true}
					accessibilityLabel={`Action: ${getActionDescription()}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Action</Text>
					<Text style={[styles.actionDescription, { color: theme.text }]}>{getActionDescription()}</Text>
				</View>

				{data.host && (
					<View 
						style={styles.detailSection}
						accessible={true}
						accessibilityLabel={`Host: ${data.host}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Host</Text>
						<Text style={[styles.detailText, { color: theme.text }]}>{data.host}</Text>
					</View>
				)}

				{data.path && (
					<View 
						style={styles.detailSection}
						accessible={true}
						accessibilityLabel={`Path: ${data.path}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Path</Text>
						<Text style={[styles.detailText, { color: theme.text }]}>{data.path}</Text>
					</View>
				)}

				{Object.keys(data.params).length > 0 && (
					<View 
						style={styles.detailSection}
						accessible={true}
						accessibilityLabel={`Parameters: ${Object.entries(data.params).map(([k, v]) => `${k} equals ${v}`).join(', ')}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Parameters</Text>
						{Object.entries(data.params).map(([key, value]) => (
							<View key={key} style={styles.paramRow}>
								<Text style={[styles.paramKey, { color: theme.textSecondary }]}>{key}:</Text>
								<Text style={[styles.paramValue, { color: theme.text }]} numberOfLines={1}>
									{value}
								</Text>
							</View>
						))}
					</View>
				)}

				{data.fallbackUrl && (
					<View 
						style={[styles.fallbackSection, { backgroundColor: theme.surface }]}
						accessible={true}
						accessibilityLabel={`Fallback: If app is not installed, will open ${data.fallbackUrl}`}
					>
						<Text style={[styles.fallbackLabel, { color: theme.textSecondary }]}>
							💡 If app is not installed, will open:
						</Text>
						<Text style={[styles.fallbackUrl, { color: theme.primary }]} numberOfLines={2}>
							{data.fallbackUrl}
						</Text>
					</View>
				)}
			</View>
		</PreviewModal>
	);
});

AppLinkPreview.displayName = 'AppLinkPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	appIcon: {
		width: 56,
		height: 56,
		borderRadius: 14,
		backgroundColor: "#5856D6",
		alignItems: "center",
		justifyContent: "center",
	},
	appIconText: {
		fontSize: 32,
	},
	appInfo: {
		flex: 1,
		gap: 4,
	},
	appName: {
		fontSize: 20,
		color: "#000",
		fontWeight: "600",
	},
	scheme: {
		fontSize: 14,
		color: "#8E8E93",
		fontFamily: "monospace",
	},
	actionSection: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		color: "#8E8E93",
		fontWeight: "500",
	},
	actionDescription: {
		fontSize: 16,
		color: "#000",
		fontWeight: "500",
	},
	detailSection: {
		gap: 8,
	},
	detailText: {
		fontSize: 15,
		color: "#000",
	},
	paramRow: {
		flexDirection: "row",
		gap: 8,
		paddingLeft: 8,
	},
	paramKey: {
		fontSize: 14,
		color: "#8E8E93",
		fontWeight: "500",
	},
	paramValue: {
		flex: 1,
		fontSize: 14,
		color: "#000",
	},
	fallbackSection: {
		backgroundColor: "#F2F2F7",
		padding: 12,
		borderRadius: 8,
		gap: 8,
	},
	fallbackLabel: {
		fontSize: 13,
		color: "#8E8E93",
	},
	fallbackUrl: {
		fontSize: 13,
		color: "#007AFF",
	},
});
