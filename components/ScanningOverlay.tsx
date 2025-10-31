/**
 * Scanning Overlay Component
 * Provides visual guidance for QR code scanning with a target frame
 */

import { useTheme } from "@/contexts/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

// Export frame size for use in CameraView bounds checking
export const SCANNING_FRAME_SIZE = 280;

interface ScanningOverlayProps {
	isScanning: boolean;
}

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ 
	isScanning
}) => {
	const { theme } = useTheme();
	const scanLinePosition = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (isScanning) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(scanLinePosition, {
						toValue: 1,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: true,
					}),
					Animated.timing(scanLinePosition, {
						toValue: 0,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: true,
					}),
				])
			).start();
		} else {
			scanLinePosition.setValue(0);
		}
	}, [isScanning, scanLinePosition]);

	const translateY = scanLinePosition.interpolate({
		inputRange: [0, 1],
		outputRange: [0, SCANNING_FRAME_SIZE - 2],
	});

	if (!isScanning) return null;

	return (
		<View style={styles.container} pointerEvents="none">
			{/* Dark overlay with transparent center */}
			<View style={styles.overlay}>
				{/* Top overlay */}
				<View style={[styles.overlaySection, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]} />
				
				{/* Middle section with frame */}
				<View style={styles.middleSection}>
					<View style={[styles.sideOverlay, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]} />
					
					{/* Scanning frame */}
					<View style={styles.frameContainer}>
						{/* Corner brackets */}
						<View style={[styles.cornerTopLeft, { borderColor: theme.primary }]} />
						<View style={[styles.cornerTopRight, { borderColor: theme.primary }]} />
						<View style={[styles.cornerBottomLeft, { borderColor: theme.primary }]} />
						<View style={[styles.cornerBottomRight, { borderColor: theme.primary }]} />
						
						{/* Animated scan line */}
						<Animated.View 
							style={[
								styles.scanLine, 
								{ 
									backgroundColor: theme.primary,
									transform: [{ translateY }]
								}
							]} 
						/>
					</View>
					
					<View style={[styles.sideOverlay, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]} />
				</View>
				
				{/* Bottom overlay */}
				<View style={[styles.overlaySection, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]} />
			</View>

			{/* Instructions */}
			<View style={styles.instructionsContainer}>
				<Text style={[styles.instructionsText, { color: theme.primaryText }]}>
					Position QR code within the frame
				</Text>
			</View>
		</View>
	);
};

const CORNER_SIZE = 40;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	overlaySection: {
		flex: 1,
	},
	middleSection: {
		flexDirection: "row",
		height: SCANNING_FRAME_SIZE,
	},
	sideOverlay: {
		flex: 1,
	},
	frameContainer: {
		width: SCANNING_FRAME_SIZE,
		height: SCANNING_FRAME_SIZE,
		position: "relative",
	},
	// Corner brackets
	cornerTopLeft: {
		position: "absolute",
		top: 0,
		left: 0,
		width: CORNER_SIZE,
		height: CORNER_SIZE,
		borderTopWidth: CORNER_WIDTH,
		borderLeftWidth: CORNER_WIDTH,
		borderTopLeftRadius: 8,
	},
	cornerTopRight: {
		position: "absolute",
		top: 0,
		right: 0,
		width: CORNER_SIZE,
		height: CORNER_SIZE,
		borderTopWidth: CORNER_WIDTH,
		borderRightWidth: CORNER_WIDTH,
		borderTopRightRadius: 8,
	},
	cornerBottomLeft: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: CORNER_SIZE,
		height: CORNER_SIZE,
		borderBottomWidth: CORNER_WIDTH,
		borderLeftWidth: CORNER_WIDTH,
		borderBottomLeftRadius: 8,
	},
	cornerBottomRight: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: CORNER_SIZE,
		height: CORNER_SIZE,
		borderBottomWidth: CORNER_WIDTH,
		borderRightWidth: CORNER_WIDTH,
		borderBottomRightRadius: 8,
	},
	scanLine: {
		position: "absolute",
		left: 0,
		right: 0,
		height: 2,
		opacity: 0.8,
		shadowColor: "#007AFF",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
	},
	instructionsContainer: {
		position: "absolute",
		bottom: 100,
		left: 0,
		right: 0,
		alignItems: "center",
		paddingHorizontal: 20,
		pointerEvents: "none",
	},
	instructionsText: {
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
});
