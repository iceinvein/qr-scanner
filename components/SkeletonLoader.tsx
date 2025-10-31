/**
 * Skeleton Loader Component
 * Displays animated placeholder content while data is loading
 */

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export interface SkeletonLoaderProps {
	width?: number | string;
	height?: number;
	borderRadius?: number;
	style?: object;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
	width = "100%",
	height = 20,
	borderRadius = 4,
	style,
}) => {
	const animatedValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(animatedValue, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(animatedValue, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		);

		animation.start();

		return () => animation.stop();
	}, [animatedValue]);

	const opacity = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: [0.3, 0.7],
	});

	return (
		<Animated.View
			style={[
				styles.skeleton,
				{
					width,
					height,
					borderRadius,
					opacity,
				},
				style,
			]}
		/>
	);
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
	return (
		<View style={styles.textContainer}>
			{Array.from({ length: lines }).map((_, index) => (
				<SkeletonLoader
					key={index}
					height={16}
					width={index === lines - 1 ? "70%" : "100%"}
					style={styles.textLine}
				/>
			))}
		</View>
	);
};

export const SkeletonPreview: React.FC = () => {
	return (
		<View style={styles.previewContainer}>
			{/* Header skeleton */}
			<View style={styles.headerSection}>
				<SkeletonLoader width={60} height={60} borderRadius={12} />
				<View style={styles.headerText}>
					<SkeletonLoader width="80%" height={24} />
					<SkeletonLoader width="60%" height={16} style={{ marginTop: 8 }} />
				</View>
			</View>

			{/* Content skeleton */}
			<View style={styles.contentSection}>
				<SkeletonLoader width="40%" height={14} />
				<SkeletonLoader width="100%" height={20} style={{ marginTop: 8 }} />
			</View>

			<View style={styles.contentSection}>
				<SkeletonLoader width="30%" height={14} />
				<SkeletonLoader width="100%" height={20} style={{ marginTop: 8 }} />
			</View>

			<View style={styles.contentSection}>
				<SkeletonLoader width="50%" height={14} />
				<SkeletonText lines={2} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	skeleton: {
		backgroundColor: "#E1E9EE",
	},
	textContainer: {
		gap: 8,
		marginTop: 8,
	},
	textLine: {
		marginBottom: 0,
	},
	previewContainer: {
		gap: 20,
		padding: 4,
	},
	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	headerText: {
		flex: 1,
	},
	contentSection: {
		gap: 4,
	},
});
