import { useTheme } from "@/contexts/ThemeContext";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SecondaryAction {
	id: string;
	label: string;
	icon?: string;
}

export interface PreviewModalProps {
	isVisible: boolean;
	onDismiss: () => void;
	title: string;
	children: React.ReactNode;
	primaryActionLabel: string;
	onPrimaryAction: () => void;
	secondaryActions?: SecondaryAction[];
	onSecondaryAction?: (actionId: string) => void;
	isLoading?: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
	isVisible,
	onDismiss,
	title,
	children,
	primaryActionLabel,
	onPrimaryAction,
	secondaryActions = [],
	onSecondaryAction,
	isLoading = false,
}) => {
	const snapPoints = useMemo(() => ["50%", "75%"], []);
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();

	React.useEffect(() => {
		if (isVisible) {
			bottomSheetRef.current?.expand();
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isVisible]);

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

	const handleSecondaryAction = (actionId: string) => {
		onSecondaryAction?.(actionId);
	};

	if (!isVisible) {
		return null;
	}

	return (
		<BottomSheet
			ref={bottomSheetRef}
			index={0}
			snapPoints={snapPoints}
			enablePanDownToClose
			onClose={onDismiss}
			backdropComponent={renderBackdrop}
			backgroundStyle={{ backgroundColor: theme.background }}
			handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
			animationConfigs={{
				duration: 200,
			}}
			accessible={true}
			accessibilityLabel={`${title} preview`}
			accessibilityRole="none"
			accessibilityViewIsModal={true}
		>
			<BottomSheetView style={styles.container}>
				<View style={[styles.header, { borderBottomColor: theme.border }]}>
					<Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">{title}</Text>
				</View>

				<ScrollView
					style={styles.content}
					showsVerticalScrollIndicator={false}
					accessible={true}
					accessibilityLabel={`${title} details`}
				>
					{children}
				</ScrollView>

				<View style={[styles.actionsContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
					<TouchableOpacity
						style={[
							styles.primaryButton, 
							{ backgroundColor: theme.primary },
							isLoading && styles.primaryButtonDisabled
						]}
						onPress={onPrimaryAction}
						activeOpacity={0.7}
						disabled={isLoading}
						accessible={true}
						accessibilityRole="button"
						accessibilityLabel={primaryActionLabel}
						accessibilityHint={`Performs the primary action: ${primaryActionLabel}`}
						accessibilityState={{ disabled: isLoading }}
					>
						{isLoading ? (
							<ActivityIndicator color={theme.primaryText} />
						) : (
							<Text style={[styles.primaryButtonText, { color: theme.primaryText }]}>{primaryActionLabel}</Text>
						)}
					</TouchableOpacity>

					{secondaryActions.length > 0 && (
						<ScrollView
							horizontal
							style={styles.secondaryActionsRow}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.secondaryActionsContent}
							accessible={false}
						>
							{secondaryActions.map((action) => (
								<TouchableOpacity
									key={action.id}
									style={[styles.secondaryButton, { backgroundColor: theme.surface }]}
									onPress={() => handleSecondaryAction(action.id)}
									activeOpacity={0.7}
									accessible={true}
									accessibilityRole="button"
									accessibilityLabel={action.label}
									accessibilityHint={`Secondary action: ${action.label}`}
								>
									<Text style={[styles.secondaryButtonText, { color: theme.primary }]}>{action.label}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					)}
				</View>
			</BottomSheetView>
		</BottomSheet>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	header: {
		paddingVertical: 16,
		borderBottomWidth: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
	},
	content: {
		flex: 1,
		paddingVertical: 16,
	},
	actionsContainer: {
		paddingVertical: 16,
		gap: 12,
	},
	primaryButton: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	primaryButtonText: {
		fontSize: 17,
		fontWeight: "600",
	},
	primaryButtonDisabled: {
		opacity: 0.6,
	},
	secondaryActionsRow: {
		maxHeight: 44,
	},
	secondaryActionsContent: {
		gap: 8,
	},
	secondaryButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	secondaryButtonText: {
		fontSize: 15,
		fontWeight: "500",
	},
});
