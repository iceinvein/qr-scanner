/**
 * Preview Orchestrator
 * Selects and renders the appropriate preview component based on intent type
 * Requirements: 2.1, 3.1
 */

import type React from "react";
import type { DetectedIntent } from "../types/intents";
import { IntentType } from "../types/intents";
import type {
	AppLinkData,
	AppStoreData,
	ContactData,
	EmailData,
	EPCPaymentData,
	EventData,
	FIDOData,
	LocationData,
	MeCardData,
	MusicMediaData,
	ParsedContent,
	PaymentData,
	PhoneData,
	SocialMediaData,
	TelegramData,
	TextData,
	TOTPData,
	URLData,
	VideoConferenceData,
	WhatsAppData,
	WiFiData,
} from "../types/parsers";
import {
	AppLinkPreview,
	AppStorePreview,
	ContactPreview,
	EmailPreview,
	EPCPaymentPreview,
	EventPreview,
	FIDOPreview,
	LocationPreview,
	MeCardPreview,
	MusicMediaPreview,
	PaymentPreview,
	PhonePreview,
	SocialMediaPreview,
	TelegramPreview,
	TextPreview,
	TOTPPreview,
	URLPreview,
	UnknownPreview,
	VideoConferencePreview,
	WhatsAppPreview,
	WiFiPreview,
} from "./previews";

export interface PreviewOrchestratorProps {
	detectedIntent: DetectedIntent;
	parsedContent: ParsedContent<unknown>;
	onPrimaryAction: () => void;
	onSecondaryAction: (action: string) => void;
	onDismiss: () => void;
	isProcessing?: boolean;
}

export const PreviewOrchestrator: React.FC<PreviewOrchestratorProps> = ({
	detectedIntent,
	parsedContent,
	onPrimaryAction,
	onSecondaryAction,
	onDismiss,
	isProcessing = false,
}) => {
	// If parsing failed or no data, show unknown preview
	if (!parsedContent.success || !parsedContent.data) {
		return (
			<UnknownPreview
				rawContent={detectedIntent.rawData}
				onCopy={onPrimaryAction}
				onDismiss={onDismiss}
				metadata={detectedIntent.metadata}
			/>
		);
	}

	// Select the appropriate preview component based on intent type
	switch (detectedIntent.type) {
		case IntentType.URL:
			return (
				<URLPreview
					data={parsedContent.data as URLData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.EMAIL:
			return (
				<EmailPreview
					data={parsedContent.data as EmailData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.PHONE:
			return (
				<PhonePreview
					data={parsedContent.data as PhoneData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.WIFI:
			return (
				<WiFiPreview
					data={parsedContent.data as WiFiData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.CONTACT:
			return (
				<ContactPreview
					data={parsedContent.data as ContactData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.EVENT:
			return (
				<EventPreview
					data={parsedContent.data as EventData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.LOCATION:
			return (
				<LocationPreview
					data={parsedContent.data as LocationData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.PAYMENT:
			return (
				<PaymentPreview
					data={parsedContent.data as PaymentData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.APP_LINK:
			return (
				<AppLinkPreview
					data={parsedContent.data as AppLinkData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.FIDO:
			return (
				<FIDOPreview
					data={parsedContent.data as FIDOData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.TOTP:
			return (
				<TOTPPreview
					data={parsedContent.data as TOTPData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.WHATSAPP:
			return (
				<WhatsAppPreview
					data={parsedContent.data as WhatsAppData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.TELEGRAM:
			return (
				<TelegramPreview
					data={parsedContent.data as TelegramData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.MECARD:
			return (
				<MeCardPreview
					data={parsedContent.data as MeCardData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.VIDEO_CONFERENCE:
			return (
				<VideoConferencePreview
					data={parsedContent.data as VideoConferenceData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.SOCIAL_MEDIA:
			return (
				<SocialMediaPreview
					data={parsedContent.data as SocialMediaData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.MUSIC_MEDIA:
			return (
				<MusicMediaPreview
					data={parsedContent.data as MusicMediaData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.APP_STORE:
			return (
				<AppStorePreview
					data={parsedContent.data as AppStoreData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.EPC_PAYMENT:
			return (
				<EPCPaymentPreview
					data={parsedContent.data as EPCPaymentData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.TEXT:
			return (
				<TextPreview
					data={parsedContent.data as TextData}
					onPrimaryAction={onPrimaryAction}
					onSecondaryAction={onSecondaryAction}
					onDismiss={onDismiss}
					isProcessing={isProcessing}
					metadata={detectedIntent.metadata}
				/>
			);

		case IntentType.UNKNOWN:
		default:
			return (
				<UnknownPreview
					rawContent={detectedIntent.rawData}
					onCopy={onPrimaryAction}
					onDismiss={onDismiss}
					metadata={detectedIntent.metadata}
				/>
			);
	}
};
