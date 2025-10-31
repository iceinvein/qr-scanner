/**
 * Scanner Screen
 * Main screen that integrates camera, scan processing, and preview modal
 * Requirements: 1.1, 2.1, 3.1
 */

import { useTheme } from "@/contexts/ThemeContext";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView } from "../components/CameraView";
import { PreviewOrchestrator } from "../components/PreviewOrchestrator";
import { useScanResultHandler } from "../components/ScanResultHandler";
import {
	dismissPreview,
	executePrimaryAction,
	executeSecondaryAction,
	processScan,
	useDetectedIntent,
	useIsProcessing,
	useParsedContent,
	useScanError,
} from "../store";
import type { ScanResult } from "../types/intents";

export default function Index() {
	const [isCameraScanning, setIsCameraScanning] = useState(true);
	const { theme } = useTheme();

	// Access store state using hooks
	const detectedIntent = useDetectedIntent();
	const parsedContent = useParsedContent();
	const isProcessing = useIsProcessing();
	const error = useScanError();

	// Handle scan with debouncing (Requirement 1.1)
	const handleScanResult = useCallback(async (result: ScanResult) => {
		setIsCameraScanning(false);
		await processScan(result);
	}, []);

	const { handleScan, resetScanning } = useScanResultHandler({
		onScan: handleScanResult,
		debounceMs: 2000,
	});

	// Handle primary action (Requirement 3.1)
	const handlePrimaryAction = useCallback(async () => {
		await executePrimaryAction();
	}, []);

	// Handle secondary action (Requirement 3.1)
	const handleSecondaryAction = useCallback(async (action: string) => {
		await executeSecondaryAction(action);
	}, []);

	// Handle dismiss (Requirement 3.1)
	const handleDismiss = useCallback(() => {
		dismissPreview();
		setIsCameraScanning(true);
		resetScanning();
	}, [resetScanning]);

	const showPreview = detectedIntent && parsedContent && !isProcessing;

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
			{/* Camera View (Requirement 1.1) */}
			<CameraView
				onBarCodeScanned={handleScan}
				isScanning={isCameraScanning}
			/>

			{/* Processing Overlay */}
			{isProcessing && (
				<View 
					style={styles.processingOverlay}
					accessible={true}
					accessibilityRole="progressbar"
					accessibilityLabel="Processing scan"
					accessibilityLiveRegion="polite"
				>
					<ActivityIndicator size="large" color="#FFF" />
					<Text style={styles.processingText}>Processing scan...</Text>
				</View>
			)}

			{/* Error Overlay */}
			{error && !showPreview && (
				<SafeAreaView 
					style={[styles.errorOverlay, { backgroundColor: theme.error }]}
					edges={['bottom', 'left', 'right']}
					accessible={true}
					accessibilityRole="alert"
					accessibilityLabel={`Error: ${error}`}
					accessibilityLiveRegion="assertive"
				>
					<Text style={[styles.errorText, { color: theme.errorText }]}>{error}</Text>
				</SafeAreaView>
			)}

			{/* Preview Modal (Requirements: 2.1, 3.1) */}
			{showPreview && (
				<PreviewOrchestrator
					detectedIntent={detectedIntent}
					parsedContent={parsedContent}
					onPrimaryAction={handlePrimaryAction}
					onSecondaryAction={handleSecondaryAction}
					onDismiss={handleDismiss}
					isProcessing={isProcessing}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	processingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	processingText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "500",
	},
	errorOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	errorText: {
		fontSize: 16,
		textAlign: "center",
	},
});
