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
	ContactData,
	EmailData,
	EventData,
	LocationData,
	ParsedContent,
	PaymentData,
	PhoneData,
	TextData,
	URLData,
	WiFiData,
} from "../types/parsers";
import {
	AppLinkPreview,
	ContactPreview,
	EmailPreview,
	EventPreview,
	LocationPreview,
	PaymentPreview,
	PhonePreview,
	TextPreview,
	URLPreview,
	UnknownPreview,
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
