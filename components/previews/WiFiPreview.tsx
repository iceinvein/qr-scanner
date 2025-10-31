import { useTheme } from "@/contexts/ThemeContext";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { WiFiData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const WiFiPreview: React.FC<PreviewProps<WiFiData>> = memo(({
	data,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
	metadata,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const { theme } = useTheme();

	const secondaryActions: SecondaryAction[] = [
		{ id: "copy", label: "Copy" },
		{ id: "share", label: "Share" },
	];

	// Build detail items from metadata
	const detailItems: DetailItem[] = [];
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
	if (metadata?.dataLength) {
		detailItems.push({
			label: "Data Size",
			value: `${metadata.dataLength} chars`,
			icon: "📊",
		});
	}
	if (metadata?.encoding) {
		detailItems.push({ label: "Encoding", value: metadata.encoding, icon: "🔤" });
	}

	const getSecurityBadgeColor = (type: string) => {
		switch (type) {
			case "WPA":
			case "WPA2":
				return "#34C759";
			case "WEP":
				return "#FF9500";
			case "nopass":
				return "#FF3B30";
			default:
				return "#8E8E93";
		}
	};

	const getSecurityLabel = (type: string) => {
		switch (type) {
			case "nopass":
				return "Open Network";
			default:
				return type;
		}
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Wi-Fi Network"
			primaryActionLabel="Connect"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View 
					style={styles.networkSection}
					accessible={true}
					accessibilityLabel={`Network name: ${data.ssid}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Network Name</Text>
					<Text style={[styles.ssid, { color: theme.text }]}>{data.ssid}</Text>
				</View>

				<View 
					style={styles.securitySection}
					accessible={true}
					accessibilityLabel={`Security type: ${getSecurityLabel(data.securityType)}`}
				>
					<Text style={[styles.label, { color: theme.textSecondary }]}>Security</Text>
					<View
						style={[
							styles.securityBadge,
							{ backgroundColor: getSecurityBadgeColor(data.securityType) },
						]}
					>
						<Text style={styles.securityText}>
							{getSecurityLabel(data.securityType)}
						</Text>
					</View>
				</View>

				{data.securityType !== "nopass" && data.password && (
					<View style={styles.passwordSection} accessible={false}>
						<View style={styles.passwordHeader}>
							<Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
							<TouchableOpacity
								onPress={() => setShowPassword(!showPassword)}
								activeOpacity={0.7}
								accessible={true}
								accessibilityRole="button"
								accessibilityLabel={showPassword ? "Hide password" : "Show password"}
								accessibilityHint="Toggles password visibility"
							>
								<Text style={[styles.toggleText, { color: theme.primary }]}>
									{showPassword ? "Hide" : "Show"}
								</Text>
							</TouchableOpacity>
						</View>
						<Text 
							style={[styles.password, { color: theme.text, backgroundColor: theme.surface }]}
							accessible={true}
							accessibilityLabel={showPassword ? `Password: ${data.password}` : "Password hidden"}
						>
							{showPassword ? data.password : "•".repeat(data.password.length)}
						</Text>
					</View>
				)}

				{data.hidden && (
					<View 
						style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
						accessible={true}
						accessibilityRole="alert"
						accessibilityLabel="Warning: This is a hidden network"
					>
						<Text style={[styles.infoText, { color: theme.text }]}>⚠️ This is a hidden network</Text>
					</View>
				)}

				{detailItems.length > 0 && (
					<DetailSection title="Technical Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

WiFiPreview.displayName = 'WiFiPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	networkSection: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	ssid: {
		fontSize: 20,
		fontWeight: "600",
	},
	securitySection: {
		gap: 8,
	},
	securityBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
	},
	securityText: {
		color: "#FFF",
		fontSize: 13,
		fontWeight: "600",
	},
	passwordSection: {
		gap: 8,
	},
	passwordHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	toggleText: {
		fontSize: 15,
		fontWeight: "500",
	},
	password: {
		fontSize: 17,
		fontFamily: "monospace",
		padding: 12,
		borderRadius: 8,
	},
	infoBox: {
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
	},
	infoText: {
		fontSize: 14,
	},
});
