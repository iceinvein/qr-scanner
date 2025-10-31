import { useTheme } from "@/contexts/ThemeContext";
import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { PreviewProps } from "../../types/components";
import type { ContactData } from "../../types/parsers";
import { DetailSection, type DetailItem } from "../DetailSection";
import { PreviewModal, type SecondaryAction } from "../PreviewModal";

export const ContactPreview: React.FC<PreviewProps<ContactData>> = memo(({
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

	// Build detail items
	const detailItems: DetailItem[] = [];

	// Contact-specific details
	const totalFields = data.phones.length + data.emails.length +
		(data.address ? 1 : 0) + (data.url ? 1 : 0) + (data.organization ? 1 : 0);
	detailItems.push({
		label: "Fields",
		value: `${totalFields} total`,
		icon: "📋",
	});

	// Metadata details
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

	const getInitials = () => {
		if (data.name.given && data.name.family) {
			return `${data.name.given[0]}${data.name.family[0]}`.toUpperCase();
		}
		if (data.name.formatted) {
			const parts = data.name.formatted.split(" ");
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
			}
			return data.name.formatted.substring(0, 2).toUpperCase();
		}
		return "??";
	};

	const getDisplayName = () => {
		if (data.name.formatted) return data.name.formatted;
		if (data.name.given && data.name.family) {
			return `${data.name.given} ${data.name.family}`;
		}
		if (data.name.given) return data.name.given;
		if (data.name.family) return data.name.family;
		return "Unknown Contact";
	};

	return (
		<PreviewModal
			isVisible={true}
			onDismiss={onDismiss}
			title="Contact"
			primaryActionLabel="Add Contact"
			onPrimaryAction={onPrimaryAction}
			secondaryActions={secondaryActions}
			onSecondaryAction={onSecondaryAction}
			isLoading={isProcessing}
		>
			<View style={styles.container} accessible={false}>
				<View
					style={styles.headerSection}
					accessible={true}
					accessibilityLabel={`Contact: ${getDisplayName()}${data.organization ? `, ${data.organization}` : ''}`}
					accessibilityRole="header"
				>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>{getInitials()}</Text>
					</View>
					<View style={styles.nameSection}>
						<Text style={[styles.name, { color: theme.text }]}>{getDisplayName()}</Text>
						{data.organization && (
							<Text style={[styles.organization, { color: theme.textSecondary }]}>{data.organization}</Text>
						)}
					</View>
				</View>

				{data.phones.length > 0 && (
					<View
						style={styles.contactSection}
						accessible={true}
						accessibilityLabel={`Phone numbers: ${data.phones.map(p => `${p.type} ${p.number}`).join(', ')}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Phone Numbers</Text>
						{data.phones.map((phone) => (
							<View key={`phone-${phone.number}`} style={styles.contactItem}>
								<Text style={[styles.contactType, { color: theme.textSecondary }]}>{phone.type.charAt(0).toLocaleUpperCase() + phone.type.slice(1)}:</Text>
								<Text style={[styles.contactValue, { color: theme.text }]}>{phone.number}</Text>
							</View>
						))}
					</View>
				)}

				{data.emails.length > 0 && (
					<View
						style={styles.contactSection}
						accessible={true}
						accessibilityLabel={`Email addresses: ${data.emails.map(e => `${e.type} ${e.address}`).join(', ')}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Email Addresses</Text>
						{data.emails.map((email) => (
							<View key={`email-${email.address}`} style={styles.contactItem}>
								<Text style={[styles.contactValue, { color: theme.text }]} numberOfLines={1}>
									{email.address}
								</Text>
							</View>
						))}
					</View>
				)}

				{data.address && (
					<View
						style={styles.contactSection}
						accessible={true}
						accessibilityLabel={`Address: ${data.address}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Address</Text>
						<Text style={[styles.address, { color: theme.text }]}>{data.address}</Text>
					</View>
				)}

				{data.url && (
					<View
						style={styles.contactSection}
						accessible={true}
						accessibilityLabel={`Website: ${data.url}`}
					>
						<Text style={[styles.label, { color: theme.textSecondary }]}>Website</Text>
						<Text style={[styles.url, { color: theme.primary }]} numberOfLines={1}>
							{data.url}
						</Text>
					</View>
				)}

				{detailItems.length > 0 && (
					<DetailSection title="Additional Details" items={detailItems} />
				)}
			</View>
		</PreviewModal>
	);
});

ContactPreview.displayName = 'ContactPreview';

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	headerSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	avatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#007AFF",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontSize: 24,
		color: "#FFF",
		fontWeight: "600",
	},
	nameSection: {
		flex: 1,
		gap: 4,
	},
	name: {
		fontSize: 22,
		fontWeight: "600",
	},
	organization: {
		fontSize: 15,
	},
	contactSection: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
	},
	contactItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingVertical: 4,
	},
	contactType: {
		fontSize: 14,
	},
	contactValue: {
		flex: 1,
		fontSize: 16,
	},
	address: {
		fontSize: 15,
		lineHeight: 20,
	},
	url: {
		fontSize: 15,
	},
});
