/**
 * Types for state management with nanostore
 */

import type { DetectedIntent, ScanResult } from "./intents";
import type { ParsedContent } from "./parsers";

export interface ScanState {
	currentScan: ScanResult | null;
	detectedIntent: DetectedIntent | null;
	parsedContent: ParsedContent<unknown> | null;
	isProcessing: boolean;
	error: string | null;
	retryable: boolean;
	retryCount: number;
}
