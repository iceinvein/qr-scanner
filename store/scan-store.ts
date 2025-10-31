/**
 * Nanostore-based state management for scan operations
 */

import { atom } from "nanostores";
import type { DetectedIntent, ScanResult } from "../types/intents";
import type { ParsedContent } from "../types/parsers";
import type { ScanState } from "../types/state";

// Initial state
const initialState: ScanState = {
	currentScan: null,
	detectedIntent: null,
	parsedContent: null,
	isProcessing: false,
	error: null,
	retryable: false,
	retryCount: 0,
};

// Create the scan state atom
export const scanStore = atom<ScanState>(initialState);

// Action functions that update the store
export const setScanResult = (result: ScanResult | null) => {
	scanStore.set({
		...scanStore.get(),
		currentScan: result,
	});
};

export const setDetectedIntent = (intent: DetectedIntent | null) => {
	scanStore.set({
		...scanStore.get(),
		detectedIntent: intent,
	});
};

export const setParsedContent = (content: ParsedContent<unknown> | null) => {
	scanStore.set({
		...scanStore.get(),
		parsedContent: content,
	});
};

export const setProcessing = (isProcessing: boolean) => {
	scanStore.set({
		...scanStore.get(),
		isProcessing,
	});
};

export const setError = (error: string | null, retryable: boolean = false) => {
	scanStore.set({
		...scanStore.get(),
		error,
		retryable,
	});
};

export const clearError = () => {
	scanStore.set({
		...scanStore.get(),
		error: null,
		retryable: false,
	});
};

export const incrementRetryCount = () => {
	const current = scanStore.get();
	scanStore.set({
		...current,
		retryCount: current.retryCount + 1,
	});
};

export const resetRetryCount = () => {
	scanStore.set({
		...scanStore.get(),
		retryCount: 0,
	});
};

export const dismissPreview = () => {
	scanStore.set(initialState);
};

export const resetScanStore = () => {
	scanStore.set(initialState);
};
