import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface DetailItem {
	label: string;
	value: string;
	icon?: string;
}

export interface DetailSectionProps {
	title?: string;
	items: DetailItem[];
	collapsible?: boolean;
}

export const DetailSection: React.FC<DetailSectionProps> = memo(({
	title = "Details",
	items,
}) => {
	const { theme } = useTheme();
	
	if (items.length === 0) return null;

	return (
		<View style={[styles.container, { borderTopColor: theme.border }]}>
			<Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
			<View style={styles.grid}>
				{items.map((item) => (
					<View key={item.label} style={[styles.item, { backgroundColor: theme.surface }]}>
						<Text style={[styles.label, { color: theme.textSecondary }]}>
							{item.icon && `${item.icon} `}
							{item.label}
						</Text>
						<Text style={[styles.value, { color: theme.text }]} numberOfLines={2}>
							{item.value}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
});

DetailSection.displayName = "DetailSection";

const styles = StyleSheet.create({
	container: {
		gap: 8,
		paddingTop: 8,
		borderTopWidth: 1,
	},
	title: {
		fontSize: 13,
		fontWeight: "500",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	item: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 6,
		minWidth: "47%",
		maxWidth: "100%",
	},
	label: {
		fontSize: 11,
		fontWeight: "500",
		marginBottom: 2,
	},
	value: {
		fontSize: 14,
		fontWeight: "600",
	},
});
