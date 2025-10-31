import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import type { PreviewProps } from "../../types/components";
import type { LocationData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const LocationPreview: React.FC<PreviewProps<LocationData>> = memo(
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

		// Format coordinates for display
		const formatCoordinate = (value: number, isLatitude: boolean) => {
			const direction = isLatitude
				? value >= 0
					? "N"
					: "S"
				: value >= 0
					? "E"
					: "W";
			return `${Math.abs(value).toFixed(6)}° ${direction}`;
		};

		// Build detail items
		const detailItems: DetailItem[] = [];

		detailItems.push({
			label: "Coordinates",
			value: `${data.latitude}, ${data.longitude}`,
			icon: "📍",
		});

		if (data.zoom) {
			detailItems.push({
				label: "Zoom Level",
				value: `${data.zoom}`,
				icon: "🔍",
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
				title="Location"
				primaryActionLabel="Open in Maps"
				onPrimaryAction={onPrimaryAction}
				secondaryActions={secondaryActions}
				onSecondaryAction={onSecondaryAction}
				isLoading={isProcessing}
			>
				<View style={styles.container} accessible={false}>
					<View style={styles.mapContainer}>
						<MapView
							style={styles.map}
							provider={PROVIDER_DEFAULT}
							initialRegion={{
								latitude: data.latitude,
								longitude: data.longitude,
								latitudeDelta: data.zoom ? 1 / 2 ** (data.zoom - 10) : 0.01,
								longitudeDelta: data.zoom ? 1 / 2 ** (data.zoom - 10) : 0.01,
							}}
							scrollEnabled={false}
							zoomEnabled={false}
							pitchEnabled={false}
							rotateEnabled={false}
						>
							<Marker
								coordinate={{
									latitude: data.latitude,
									longitude: data.longitude,
								}}
								title={data.label || "Location"}
								description={data.query}
							/>
						</MapView>
					</View>

					{data.label && (
						<View
							style={styles.labelSection}
							accessible={true}
							accessibilityLabel={`Location: ${data.label}`}
						>
							<Text style={[styles.locationLabel, { color: theme.text }]}>{data.label}</Text>
						</View>
					)}

					{data.query && !data.label && (
						<View
							style={styles.labelSection}
							accessible={true}
							accessibilityLabel={`Search query: ${data.query}`}
						>
							<Text style={[styles.queryLabel, { color: theme.text }]}>{data.query}</Text>
						</View>
					)}

					<View
						style={[styles.coordsSection, { backgroundColor: theme.surface }]}
						accessible={true}
						accessibilityLabel={`Latitude: ${formatCoordinate(data.latitude, true)}, Longitude: ${formatCoordinate(data.longitude, false)}`}
					>
						<View style={styles.coordRow}>
							<Text style={[styles.coordLabel, { color: theme.textSecondary }]}>Latitude</Text>
							<Text style={[styles.coordValue, { color: theme.text }]}>
								{formatCoordinate(data.latitude, true)}
							</Text>
						</View>
						<View style={styles.coordRow}>
							<Text style={[styles.coordLabel, { color: theme.textSecondary }]}>Longitude</Text>
							<Text style={[styles.coordValue, { color: theme.text }]}>
								{formatCoordinate(data.longitude, false)}
							</Text>
						</View>
					</View>

					{detailItems.length > 0 && (
						<DetailSection title="Additional Details" items={detailItems} />
					)}
				</View>
			</PreviewModal>
		);
	},
);

LocationPreview.displayName = "LocationPreview";

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	mapContainer: {
		height: 200,
		borderRadius: 12,
		overflow: "hidden",
	},
	map: {
		width: "100%",
		height: "100%",
	},
	labelSection: {
		alignItems: "center",
	},
	locationLabel: {
		fontSize: 20,
		fontWeight: "600",
		textAlign: "center",
	},
	queryLabel: {
		fontSize: 16,
		textAlign: "center",
	},
	coordsSection: {
		gap: 12,
		padding: 16,
		borderRadius: 12,
	},
	coordRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	coordLabel: {
		fontSize: 14,
		fontWeight: "500",
	},
	coordValue: {
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "monospace",
	},
});
