/**
 * React hooks for accessing scan store
 */

import { useStore } from "@nanostores/react";
import type { ScanState } from "../types/state";
import { scanStore } from "./scan-store";

/**
 * Hook to access the entire scan state
 */
export const useScanStore = (): ScanState => {
	return useStore(scanStore);
};

/**
 * Hook to access specific parts of scan state
 */
export const useScanResult = () => {
	const state = useStore(scanStore);
	return state.currentScan;
};

export const useDetectedIntent = () => {
	const state = useStore(scanStore);
	return state.detectedIntent;
};

export const useParsedContent = () => {
	const state = useStore(scanStore);
	return state.parsedContent;
};

export const useIsProcessing = () => {
	const state = useStore(scanStore);
	return state.isProcessing;
};

export const useScanError = () => {
	const state = useStore(scanStore);
	return state.error;
};
