/**
 * Camera View Component
 * Integrates expo-camera with QR code scanning and permission handling
 * Requirements: 1.1
 */

import { useTheme } from "@/contexts/ThemeContext";
import { PermissionType, permissionService } from "@/services/permission-service";
import { CameraView as ExpoCameraView, useCameraPermissions } from "expo-camera";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScanningOverlay } from "./ScanningOverlay";

export interface CameraViewProps {
	onBarCodeScanned: (data: string) => void;
	isScanning: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
	onBarCodeScanned,
	isScanning,
}) => {
	const [permission, requestPermission] = useCameraPermissions();
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();

	const handleBarCodeScanned = (scanData: any) => {
		if (!isScanning) {
			return;
		}

		// Use raw data if available (preserves original QR code format like WIFI:, MECARD:, etc.)
		// Fall back to processed data if raw is not available
		const dataToUse = scanData.raw || scanData.data;
		onBarCodeScanned(dataToUse);
	};

	// Loading state while checking permissions
	if (!permission) {
		return (
			<View style={styles.container}>
				<View 
					style={[
						styles.messageContainer, 
						{ 
							marginTop: insets.top,
							backgroundColor: theme.cameraPermissionBg 
						}
					]}
					accessible={true}
					accessibilityRole="progressbar"
					accessibilityLabel="Checking camera permissions"
				>
					<Text style={[styles.messageText, { color: theme.cameraPermissionText }]}>
						Checking camera permissions...
					</Text>
				</View>
			</View>
		);
	}

	// Permission denied state with explanatory message (Requirement 1.1)
	if (!permission.granted) {
		const explanation = permissionService.getPermissionExplanation(PermissionType.CAMERA);
		const canAskAgain = permission.canAskAgain;

		const handlePermissionRequest = async () => {
			if (canAskAgain) {
				await requestPermission();
			} else {
				// Show alert with option to open settings
				Alert.alert(
					explanation.title,
					explanation.settingsPrompt,
					[
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "Open Settings",
							onPress: async () => {
								await permissionService.openSettings();
							},
						},
					],
				);
			}
		};

		return (
			<View style={styles.container}>
				<View 
					style={[
						styles.messageContainer, 
						{ 
							marginTop: insets.top,
							backgroundColor: theme.cameraPermissionBg 
						}
					]}
					accessible={false}
				>
					<Text 
						style={[styles.messageTitle, { color: theme.cameraPermissionText }]}
						accessibilityRole="header"
					>
						{explanation.title}
					</Text>
					<Text 
						style={[styles.messageText, { color: theme.cameraPermissionText }]}
						accessible={true}
						accessibilityLabel={canAskAgain ? explanation.message : explanation.settingsPrompt}
					>
						{canAskAgain ? explanation.message : explanation.settingsPrompt}
					</Text>
					<Button
						onPress={handlePermissionRequest}
						title={canAskAgain ? "Grant Camera Permission" : "Open Settings"}
						color={theme.primary}
						accessibilityLabel={canAskAgain ? "Grant camera permission" : "Open settings to grant camera permission"}
					/>
				</View>
			</View>
		);
	}

	// Camera view with QR code scanning enabled (Requirement 1.1)
	return (
		<View style={styles.camera}>
			<ExpoCameraView
				style={styles.camera}
				onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
				barcodeScannerSettings={{
					barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "code93"],
				}}
				accessible={true}
				accessibilityLabel="QR code scanner camera view"
				accessibilityHint="Point camera at a QR code to scan it"
				accessibilityRole="image"
			/>
			<ScanningOverlay isScanning={isScanning} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
	camera: {
		flex: 1,
	},
	messageContainer: {
		padding: 24,
		borderRadius: 16,
		maxWidth: 320,
		gap: 16,
	},
	messageTitle: {
		fontSize: 22,
		fontWeight: "600",
		textAlign: "center",
	},
	messageText: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 22,
	},
	messageSubtext: {
		fontSize: 14,
		textAlign: "center",
		lineHeight: 20,
	},
});
