/**
 * Action orchestration for scan processing
 */

import { IntentDetectorOrchestrator } from "../detectors/intent-detector-orchestrator";
import {
    AppLinkHandler,
    ContactHandler,
    EmailHandler,
    EventHandler,
    LocationHandler,
    PaymentHandler,
    PhoneHandler,
    SMSHandler,
    TextHandler,
    URLHandler,
    WiFiHandler,
} from "../handlers";
import { errorHandler } from "../services/error-handler-service";
import { hapticService } from "../services/haptic-service";
import type { ActionResult } from "../types/actions";
import type { DetectedIntent, ScanResult } from "../types/intents";
import { IntentType } from "../types/intents";
import type { ParsedContent } from "../types/parsers";
import { parseContent } from "./parse-orchestrator";
import {
    clearError,
    incrementRetryCount,
    resetRetryCount,
    scanStore,
    setDetectedIntent,
    setError,
    setParsedContent,
    setProcessing,
    setScanResult,
} from "./scan-store";

// Initialize detector and handlers
const intentDetector = new IntentDetectorOrchestrator();
const urlHandler = new URLHandler();
const wifiHandler = new WiFiHandler();
const paymentHandler = new PaymentHandler();
const eventHandler = new EventHandler();
const contactHandler = new ContactHandler();
const appLinkHandler = new AppLinkHandler();
const emailHandler = new EmailHandler();
const phoneHandler = new PhoneHandler();
const smsHandler = new SMSHandler();
const locationHandler = new LocationHandler();
const textHandler = new TextHandler();

/**
 * Get the appropriate handler for an intent type
 */
const getHandler = (intentType: IntentType) => {
	switch (intentType) {
		case IntentType.URL:
			return urlHandler;
		case IntentType.WIFI:
			return wifiHandler;
		case IntentType.PAYMENT:
			return paymentHandler;
		case IntentType.EVENT:
			return eventHandler;
		case IntentType.CONTACT:
			return contactHandler;
		case IntentType.APP_LINK:
			return appLinkHandler;
		case IntentType.EMAIL:
			return emailHandler;
		case IntentType.PHONE:
			return phoneHandler;
		case IntentType.SMS:
			return smsHandler;
		case IntentType.LOCATION:
			return locationHandler;
		case IntentType.TEXT:
			return textHandler;
		default:
			return null;
	}
};

/**
 * Process a scan result through detection and parsing
 * Orchestrates detection, parsing, and preview display with performance tracking
 * Requirements: 1.1, 2.1, 4.1, 4.2, 4.3
 */
export const processScan = async (result: ScanResult): Promise<void> => {
	const startTime = Date.now();
	
	try {
		setProcessing(true);
		setError(null);

		// Set the scan result
		setScanResult(result);

		// Stage 1: Detect intent type (target: <100ms)
		const detectionStartTime = Date.now();
		let detectedIntent: DetectedIntent;
		
		try {
			detectedIntent = intentDetector.detect(result);
			const detectionTime = Date.now() - detectionStartTime;
			
			if (detectionTime > 100) {
				console.warn(`Intent detection took ${detectionTime}ms (target: 100ms)`);
			}
			
			setDetectedIntent(detectedIntent);
		} catch (detectionError) {
			// Fallback: treat as plain text (Requirement 4.1)
			console.error("Detection error:", detectionError);
			detectedIntent = {
				type: IntentType.TEXT,
				confidence: 0.5,
				rawData: result.data,
			};
			setDetectedIntent(detectedIntent);
		}

		// Stage 2: Parse content based on detected intent
		let parsedContent: ParsedContent<unknown>;
		
		try {
			parsedContent = parseContent(detectedIntent);
			
			// If parsing failed, provide fallback (Requirement 4.1, 4.2)
			if (!parsedContent.success) {
				console.warn("Parsing failed:", parsedContent.error);
				// Fallback to text content display
				parsedContent = {
					success: true,
					data: { 
						content: detectedIntent.rawData,
						wordCount: detectedIntent.rawData.split(/\s+/).length,
						lineCount: detectedIntent.rawData.split(/\n/).length,
					},
				};
				// Update intent to TEXT to show text preview
				detectedIntent = {
					type: IntentType.TEXT,
					confidence: 0.5,
					rawData: result.data,
				};
				setDetectedIntent(detectedIntent);
			}
			
			setParsedContent(parsedContent);
		} catch (parsingError) {
			// Fallback: show as text content (Requirement 4.1)
			console.error("Parsing error:", parsingError);
			parsedContent = {
				success: true,
				data: { 
					content: detectedIntent.rawData,
					wordCount: detectedIntent.rawData.split(/\s+/).length,
					lineCount: detectedIntent.rawData.split(/\n/).length,
				},
			};
			setParsedContent(parsedContent);
			
			// Update intent to TEXT to show text preview
			detectedIntent = {
				type: IntentType.TEXT,
				confidence: 0.5,
				rawData: result.data,
			};
			setDetectedIntent(detectedIntent);
		}

		// Stage 3: Preview display (target: total <150ms from start)
		const totalTime = Date.now() - startTime;
		
		if (totalTime > 150) {
			console.warn(`Total processing took ${totalTime}ms (target: 150ms)`);
		}

		setProcessing(false);
	} catch (error) {
		// Final fallback: show error with raw content (Requirement 4.1, 4.3)
		console.error("Critical processing error:", error);
		setProcessing(false);
		
		// Use error handler service for user-friendly message
		const errorResponse = errorHandler.handle(
			error instanceof Error ? error : new Error("Failed to process scan"),
			"processScan"
		);
		
		setError(errorResponse.userMessage, errorResponse.retryable);
		
		// Still provide text content as fallback
		setDetectedIntent({
			type: IntentType.TEXT,
			confidence: 0.5,
			rawData: result.data,
		});
		
		setParsedContent({
			success: true,
			data: { 
				content: result.data,
				wordCount: result.data.split(/\s+/).length,
				lineCount: result.data.split(/\n/).length,
			},
		});
	}
};

/**
 * Get user-friendly error message based on intent type and error
 * Requirements: 4.2, 4.3
 */
const getUserFriendlyErrorMessage = (
	intentType: IntentType,
	error: string,
): string => {
	// Check for common error patterns
	if (error.toLowerCase().includes("permission")) {
		switch (intentType) {
			case IntentType.EVENT:
				return "Calendar access is required to add events. Grant permission in Settings.";
			case IntentType.CONTACT:
				return "Contacts access is required to add contacts. Grant permission in Settings.";
			case IntentType.WIFI:
				return "Unable to connect to Wi-Fi. You can copy the password to connect manually.";
			default:
				return "Permission required. Please check your settings.";
		}
	}

	if (error.toLowerCase().includes("not installed") || error.toLowerCase().includes("cannot open")) {
		switch (intentType) {
			case IntentType.APP_LINK:
				return "This app isn't installed. Opening in browser instead.";
			case IntentType.PAYMENT:
				return "No wallet app found. You can copy the address instead.";
			default:
				return "Unable to open. You can copy the content instead.";
		}
	}

	if (error.toLowerCase().includes("network") || error.toLowerCase().includes("connection")) {
		return "Network error. Please check your connection and try again.";
	}

	// Intent-specific default messages
	switch (intentType) {
		case IntentType.URL:
			return "Unable to open URL. You can copy the link instead.";
		case IntentType.WIFI:
			return "Unable to connect to Wi-Fi. You can copy the password to connect manually.";
		case IntentType.PAYMENT:
			return "Unable to open wallet. You can copy the payment details instead.";
		case IntentType.EVENT:
			return "Unable to add event. You can copy the event details instead.";
		case IntentType.CONTACT:
			return "Unable to add contact. You can copy the contact details instead.";
		case IntentType.APP_LINK:
			return "Unable to open app. You can copy the link instead.";
		case IntentType.UNKNOWN:
			return "Couldn't recognize this QR code format. You can copy the content instead.";
		default:
			return error || "Action failed. Please try again.";
	}
};

/**
 * Execute the primary action for the current scan
 * Provides haptic feedback and user-friendly error messages
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.2, 4.3, 6.1, 6.2, 6.3
 */
export const executePrimaryAction = async (): Promise<void> => {
	const state = scanStore.get();

	if (!state.detectedIntent || !state.parsedContent) {
		const errorResponse = errorHandler.handle(
			new Error("No scan data available"),
			"executePrimaryAction"
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
		hapticService.error();
		return;
	}

	if (!state.parsedContent.success || !state.parsedContent.data) {
		const errorResponse = errorHandler.handle(
			new Error("Invalid scan data"),
			"executePrimaryAction"
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
		hapticService.error();
		return;
	}

	// Trigger selection haptic on button tap (Requirement 6.1)
	hapticService.selection();

	try {
		setProcessing(true);
		clearError();

		const handler = getHandler(state.detectedIntent.type);
		if (!handler) {
			const errorResponse = errorHandler.handle(
				new Error("No handler available"),
				"executePrimaryAction"
			);
			setError(errorResponse.userMessage, errorResponse.retryable);
			setProcessing(false);
			// Trigger error haptic within 50ms (Requirement 6.3)
			hapticService.error();
			return;
		}

		// Execute the primary action
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: ActionResult = await handler.executePrimary(
			state.parsedContent.data as any,
		);

		setProcessing(false);

		if (result.success) {
			// Trigger success haptic within 50ms of completion (Requirement 6.2)
			hapticService.success();

			// If there's a fallback action, it means the primary succeeded with a fallback
			// (e.g., app not installed, opened browser instead)
			if (result.fallbackAction) {
				// Still show a message but don't treat as error
				const message = getUserFriendlyErrorMessage(
					state.detectedIntent.type,
					result.error || "Using alternative action",
				);
				setError(message, false);
			}
		} else {
			// Trigger error haptic within 50ms of failure (Requirement 6.3)
			hapticService.error();

			// Use error handler service for user-friendly message
			const errorResponse = errorHandler.handle(
				new Error(result.error || "Action failed"),
				`executePrimaryAction:${state.detectedIntent.type}`
			);
			setError(errorResponse.userMessage, errorResponse.retryable);

			// Execute fallback action if available (Requirement 4.3)
			if (result.fallbackAction) {
				try {
					result.fallbackAction();
				} catch (fallbackError) {
					console.error("Fallback action failed:", fallbackError);
				}
			}
		}
	} catch (error) {
		setProcessing(false);
		// Trigger error haptic within 50ms (Requirement 6.3)
		hapticService.error();

		// Use error handler service for user-friendly message
		const errorResponse = errorHandler.handle(
			error instanceof Error ? error : new Error("Action failed"),
			`executePrimaryAction:${state.detectedIntent.type}`
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
	}
};

/**
 * Execute a secondary action for the current scan
 * Provides haptic feedback and user-friendly error messages
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.2, 4.3, 6.1, 6.2, 6.3
 */
export const executeSecondaryAction = async (action: string): Promise<void> => {
	const state = scanStore.get();

	if (!state.detectedIntent || !state.parsedContent) {
		const errorResponse = errorHandler.handle(
			new Error("No scan data available"),
			"executeSecondaryAction"
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
		hapticService.error();
		return;
	}

	if (!state.parsedContent.success || !state.parsedContent.data) {
		const errorResponse = errorHandler.handle(
			new Error("Invalid scan data"),
			"executeSecondaryAction"
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
		hapticService.error();
		return;
	}

	// Trigger selection haptic on button tap (Requirement 6.1)
	hapticService.selection();

	try {
		setProcessing(true);
		clearError();

		const handler = getHandler(state.detectedIntent.type);
		if (!handler) {
			const errorResponse = errorHandler.handle(
				new Error("No handler available"),
				"executeSecondaryAction"
			);
			setError(errorResponse.userMessage, errorResponse.retryable);
			setProcessing(false);
			// Trigger error haptic within 50ms (Requirement 6.3)
			hapticService.error();
			return;
		}

		// Execute the secondary action
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: ActionResult = await handler.executeSecondary(
			action,
			state.parsedContent.data as any,
		);

		setProcessing(false);

		if (result.success) {
			// Trigger success haptic within 50ms of completion (Requirement 6.2)
			hapticService.success();

			// If there's a fallback action, execute it
			if (result.fallbackAction) {
				try {
					result.fallbackAction();
				} catch (fallbackError) {
					console.error("Fallback action failed:", fallbackError);
				}
			}
		} else {
			// Trigger error haptic within 50ms of failure (Requirement 6.3)
			hapticService.error();

			// Use error handler service for user-friendly message
			const errorResponse = errorHandler.handle(
				new Error(result.error || "Action failed"),
				`executeSecondaryAction:${state.detectedIntent.type}:${action}`
			);
			setError(errorResponse.userMessage, errorResponse.retryable);

			// Execute fallback action if available (Requirement 4.3)
			if (result.fallbackAction) {
				try {
					result.fallbackAction();
				} catch (fallbackError) {
					console.error("Fallback action failed:", fallbackError);
				}
			}
		}
	} catch (error) {
		setProcessing(false);
		// Trigger error haptic within 50ms (Requirement 6.3)
		hapticService.error();

		// Use error handler service for user-friendly message
		const errorResponse = errorHandler.handle(
			error instanceof Error ? error : new Error("Action failed"),
			`executeSecondaryAction:${state.detectedIntent.type}:${action}`
		);
		setError(errorResponse.userMessage, errorResponse.retryable);
	}
};

/**
 * Retry the last failed action with exponential backoff
 * Implements retry mechanism for network-related failures
 * Requirements: 4.1, 4.2, 4.3
 */
export const retryLastAction = async (): Promise<void> => {
	const state = scanStore.get();

	if (!state.retryable) {
		console.warn("Last action is not retryable");
		return;
	}

	// Maximum retry attempts
	const MAX_RETRIES = 3;
	if (state.retryCount >= MAX_RETRIES) {
		const errorResponse = errorHandler.handle(
			new Error("Maximum retry attempts reached"),
			"retryLastAction"
		);
		setError(errorResponse.userMessage, false);
		hapticService.error();
		return;
	}

	// Exponential backoff: 1s, 2s, 4s
	const backoffDelay = Math.pow(2, state.retryCount) * 1000;
	
	// Increment retry count
	incrementRetryCount();

	// Wait for backoff delay
	await new Promise(resolve => setTimeout(resolve, backoffDelay));

	// Retry the primary action
	await executePrimaryAction();

	// If successful, reset retry count
	const newState = scanStore.get();
	if (!newState.error) {
		resetRetryCount();
	}
};
